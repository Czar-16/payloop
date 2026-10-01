import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "db";

const searchSchema = z.object({
  identifier: z.string().min(1),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get("identifier");

    const parsed = searchSchema.safeParse({ identifier });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Identifier parameter is required" },
        { status: 400 },
      );
    }

    const targetUser = await db.user.findFirst({
      where: {
        OR: [
          { email: parsed.data.identifier },
          { phone: parsed.data.identifier },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      );
    }

    if (targetUser.id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot send money to yourself" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone,
      },
    });
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
