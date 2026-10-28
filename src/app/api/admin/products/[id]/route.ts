
import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../../../lib/prisma";
import { requireAdmin } from "../../../../../lib/auth/require-admin";

export const runtime = "nodejs";

const updateProductSchema = z.object({
  categoryId: z.string().min(1).optional(),
  name: z.string().trim().min(2).max(160).optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  shortDescription: z.string().trim().max(300).nullable().optional(),
  description: z.string().trim().min(1).optional(),
  material: z.string().trim().max(100).nullable().optional(),
  weightGrams: z.number().int().positive().nullable().optional(),
  dimensions: z.string().trim().max(100).nullable().optional(),
  seoTitle: z.string().trim().max(180).nullable().optional(),
  seoDescription: z.string().trim().max(320).nullable().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
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

  if (!id.trim()) {
    return NextResponse.json(
      { error: "Product ID is required." },
      { status: 400 }
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

  const result = updateProductSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Please check the product details.",
        details: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = result.data;

  try {
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
        select: { id: true },
      });

      if (!category) {
        return NextResponse.json(
          { error: "The selected category does not exist." },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        variants: true,
        images: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    return NextResponse.json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A product with this slug already exists." },
        { status: 409 }
      );
    }

    console.error("Product update failed:", error);

    return NextResponse.json(
      { error: "Unable to update the product right now." },
      { status: 500 }
    );
  }
}


export async function DELETE(
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

  if (!id.trim()) {
    return NextResponse.json(
      { error: "Product ID is required." },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { status: "ARCHIVED" },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
      },
    });

    return NextResponse.json({
      message: "Product archived successfully.",
      product,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    console.error("Product archival failed:", error);

    return NextResponse.json(
      { error: "Unable to archive the product right now." },
      { status: 500 }
    );
  }
}
