import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "db";

const onRampSchema = z.object({
  amount: z.number().int().positive(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = onRampSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const { amount } = parsed.data;
    const token = crypto.randomUUID();

    const transaction = await db.onRampTransaction.create({
      data: {
        userId: session.user.id,
        amount,
        token,
      },
    });

    return NextResponse.json(
      {
        message: "On-ramp transaction created",
        transactionId: transaction.id,
        amount: transaction.amount,
        status: transaction.status,
        token: transaction.token,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error processing on-ramp request:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
