import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "db";

export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const balance = await db.balance.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!balance) {
      return NextResponse.json({
        available: 0,
        locked: 0,
      });
    }

    return NextResponse.json({
      available: balance.available,
      locked: balance.locked,
    });
  } catch (error) {
    console.error("Balance fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
