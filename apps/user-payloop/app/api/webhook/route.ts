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
    const transaction = await db.onRampTransaction.findUnique({
      where: {
        token,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    const updates = await db.onRampTransaction.updateMany({
      where: {
        token,
        status: "Processing",
      },
      data: {
        status,
      },
    });

    if (updates.count === 0) {
      return NextResponse.json({
        message: "Transaction already processed",
        transactionId: transaction.id,
        amount: transaction.amount,
        status: transaction.status,
      });
    }

    console.log("Webhook received", { token, status });

    return NextResponse.json({
      message: "Transaction updated",
      transactionId: transaction.id,
      amount: transaction.amount,
      status,
    });
  } catch (error) {
    console.log("Webhook error: ", error);
    return NextResponse.json(
      {
        error: "Invalid request",
      },
      { status: 400 },
    );
  }
}
