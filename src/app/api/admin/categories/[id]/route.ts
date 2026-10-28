
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../../../../lib/prisma";
import { requireAdmin } from "../../../../../lib/auth/require-admin";

export const runtime = "nodejs";

const updateCategorySchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  description: z.string().trim().max(2000).nullable().optional(),
}).strict().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Provide at least one field to update." }
);

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  const admin = await requireAdmin();

  if (!admin.authorized) {
    return NextResponse.json(
      { error: admin.error },
      { status: admin.status }
    );
  }

  const { id } = await params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request." },
      { status: 400 }
    );
  }

  const result = updateCategorySchema.safeParse(body);

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
    const category = await prisma.category.update({
      where: { id },
      data: result.data,
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A category with this slug already exists." },
        { status: 409 }
      );
    }

    console.error("Category update failed:", error);

    return NextResponse.json(
      { error: "Unable to update the category right now." },
      { status: 500 }
    );
  }
}
