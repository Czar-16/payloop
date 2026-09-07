import { db } from "db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const webhookSchema = z.object({
  token: z.string().min(1),
  status: z.enum(["Success", "Failed"]),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const parsed = webhookSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 },
      );
    }

    const { token, status } = parsed.data;

    const result = await db.$transaction(async (tx) => {
      // 1. Find the transaction
      const transaction = await tx.onRampTransaction.findUnique({
        where: {
          token,
        },
      });

      if (!transaction) {
        return {
          type: "not_found" as const,
        };
      }

      // 2. Only update transactions that are still Processing
      const statusUpdate = await tx.onRampTransaction.updateMany({
        where: {
          token,
          status: "Processing",
        },
        data: {
          status,
        },
      });

      // 3. If nothing was updated, this webhook was already processed
      if (statusUpdate.count === 0) {
        return {
          type: "already_processed" as const,
          transaction,
        };
      }

      // 4. Only successful transactions should add money
      if (status === "Success") {
        await tx.balance.update({
          where: {
            userId: transaction.userId,
          },
          data: {
            available: {
              increment: transaction.amount,
            },
          },
        });
      }

      return {
        type: "updated" as const,
        transaction,
      };
    });

    if (result.type === "not_found") {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    if (result.type === "already_processed") {
      return NextResponse.json({
        message: "Transaction already processed",
        transactionId: result.transaction.id,
        amount: result.transaction.amount,
        status: result.transaction.status,
      });
    }

    console.log("Webhook received", {
      token,
      status,
      transactionId: result.transaction.id,
    });

    return NextResponse.json({
      message: "Transaction updated",
      transactionId: result.transaction.id,
      amount: result.transaction.amount,
      status,
    });
  } catch (error) {
    console.error("Webhook error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
