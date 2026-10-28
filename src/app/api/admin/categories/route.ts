
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/auth/require-admin";

export const runtime = "nodejs";

const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(2000).nullable().optional(),
}).strict();

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.authorized) {
    return NextResponse.json(
      { error: admin.error },
      { status: admin.status }
    );
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Category listing failed:", error);

    return NextResponse.json(
      { error: "Unable to fetch categories right now." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin();

  if (!admin.authorized) {
    return NextResponse.json(
      { error: admin.error },
      { status: admin.status }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request." },
      { status: 400 }
    );
  }

  const result = createCategorySchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Please check the category details.",
        details: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  try {
    const category = await prisma.category.create({
      data: result.data,
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Category created successfully.",
        category,
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A category with this slug already exists." },
        { status: 409 }
      );
    }

    console.error("Category creation failed:", error);

    return NextResponse.json(
      { error: "Unable to create the category right now." },
      { status: 500 }
    );
  }
}
