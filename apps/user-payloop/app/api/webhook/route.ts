import crypto from "crypto";
import { db } from "db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "bank_webhook_secret_key";

const webhookSchema = z.object({
  token: z.string().min(1),
  status: z.enum(["Success", "Failed"]),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const signature = request.headers.get("x-webhook-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature header" },
        { status: 401 },
      );
    }

    const bodyText = await request.text();

    const expectedSignature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(bodyText)
      .digest("hex");

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 },
      );
    }

    let body: unknown;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      );
    }

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
