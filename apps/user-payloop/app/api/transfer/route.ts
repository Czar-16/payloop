import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "db";

const transferSchema = z.object({
  recipient: z.string().min(1, "Recipient email or phone is required"),
  amount: z.number().int().positive("Amount must be greater than 0"),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const senderId = session.user.id;
    const body = await request.json();

    const parsed = transferSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const { recipient, amount } = parsed.data;

    const receiver = await db.user.findFirst({
      where: {
        OR: [{ email: recipient }, { phone: recipient }],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: "Recipient user not found" },
        { status: 404 },
      );
    }

    if (receiver.id === senderId) {
      return NextResponse.json(
        { error: "Cannot transfer money to yourself" },
        { status: 400 },
      );
    }

    // Atomic money transfer transaction
    const transfer = await db.$transaction(async (tx) => {
      const senderBalance = await tx.balance.findUnique({
        where: { userId: senderId },
      });

      if (!senderBalance || senderBalance.available < amount) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      await tx.balance.update({
        where: { userId: senderId },
        data: {
          available: {
            decrement: amount,
          },
        },
      });

      await tx.balance.update({
        where: { userId: receiver.id },
        data: {
          available: {
            increment: amount,
          },
        },
      });

      const record = await tx.transferTransaction.create({
        data: {
          senderId,
          receiverId: receiver.id,
          amount,
          status: "Success",
        },
      });

      return record;
    });

    return NextResponse.json(
      {
        message: "Transfer successful",
        transferId: transfer.id,
        amount: transfer.amount,
        recipient: receiver.name,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_BALANCE") {
      return NextResponse.json(
        { error: "Insufficient available balance" },
        { status: 400 },
      );
    }

    console.error("Transfer error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
