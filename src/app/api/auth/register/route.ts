import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(72),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request." },
      { status: 400 }
    );
  }

  const result = registerSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Please check your registration details.",
        details: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { name, email, password } = result.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Unable to register with these details." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        // The database default assigns CUSTOMER.
        // Never accept a role from registration input.
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle concurrent registration attempts for the same email.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Unable to register with these details." },
        { status: 409 }
      );
    }

    console.error("Registration failed:", error);

    return NextResponse.json(
      { error: "Unable to create your account right now." },
      { status: 500 }
    );
  }
}
