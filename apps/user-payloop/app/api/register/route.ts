import { NextRequest, NextResponse } from "next/server";
import * as argon2 from "argon2";
import { z } from "zod";
import { db, Prisma } from "db";

const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email().optional(),
    phone: z.string().min(10).optional(),
    password: z.string().min(4),
  })
  .refine((data) => data.email || data.phone, {
    message: "Email or Phone is required",
    path: ["email"],
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, email, phone, password } = parsed.data;

    const hashedPassword = await argon2.hash(password);

    const user = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
        },
      });

      await tx.balance.create({
        data: {
          userId: user.id,
        },
      });

      return user;
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: user.id,
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      //P2002 means a unique constraint was violated.
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error as Prisma.PrismaClientKnownRequestError).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Email or phone already exists" },
        { status: 409 },
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
