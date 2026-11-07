
import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../../../lib/prisma";
import { requireAdmin } from "../../../../../lib/auth/require-admin";

export const runtime = "nodejs";

const imageUrlSchema = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .refine((value) => {
    if (value.startsWith("/") && !value.startsWith("//")) {
      return true;
    }

    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }, "Image must be a valid HTTP(S) URL or a local absolute path.");

const variantSchema = z.object({
  id: z.string().optional(),
  color: z.string().trim().min(1).max(60),
  sku: z.string().trim().min(1).max(100),
  price: z
    .string()
    .regex(/^\d{1,8}(?:\.\d{1,2})?$/)
    .refine((value) => Number(value) > 0, {
      message: "Price must be greater than zero.",
    }),
  stock: z.number().int().min(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

const imageSchema = z.object({
  imageUrl: imageUrlSchema,
  altText: z.string().trim().max(250).optional(),
  displayOrder: z.number().int().min(0),
});

const updateProductSchema = z
  .object({
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

    variants: z
      .array(variantSchema)
      .min(1)
      .refine(
        (variants) => {
          const ids = variants
            .map((variant) => variant.id)
            .filter((id): id is string => Boolean(id));

          return new Set(ids).size === ids.length;
        },
        { message: "Duplicate variant IDs are not allowed." }
      )
      .optional(),

    images: z.array(imageSchema).max(20).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  });

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET: Fetch one product for the edit form.
export async function GET(
  _request: Request,
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
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        variants: {
          orderBy: { createdAt: "asc" },
        },
        images: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product fetch failed:", error);

    return NextResponse.json(
      { error: "Unable to fetch the product right now." },
      { status: 500 }
    );
  }
}

// PATCH: Update product details, variants and images.
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

  const { variants, images, ...productFields } = result.data;

  try {
    if (productFields.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: productFields.categoryId },
        select: { id: true },
      });

      if (!category) {
        return NextResponse.json(
          { error: "The selected category does not exist." },
          { status: 400 }
        );
      }
    }

    const product = await prisma.$transaction(async (tx) => {
      const existingProduct = await tx.product.findUnique({
        where: { id },
        select: {
          id: true,
          variants: {
            select: { id: true },
          },
        },
      });

      if (!existingProduct) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      if (variants) {
        const existingVariantIds = new Set(
          existingProduct.variants.map((variant) => variant.id)
        );

        for (const variant of variants) {
          if (variant.id && !existingVariantIds.has(variant.id)) {
            throw new Error("INVALID_VARIANT_ID");
          }
        }
      }

      await tx.product.update({
        where: { id },
        data: productFields as Prisma.ProductUncheckedUpdateInput,
      });

      if (variants) {
        const submittedIds = variants
          .map((variant) => variant.id)
          .filter((variantId): variantId is string => Boolean(variantId));

        // Keep removed variants and their historical references.
        await tx.productVariant.updateMany({
          where: {
            productId: id,
            ...(submittedIds.length
              ? { id: { notIn: submittedIds } }
              : {}),
          },
          data: { status: "INACTIVE" },
        });

        for (const variant of variants) {
          const { id: variantId, ...variantData } = variant;

          if (variantId) {
            await tx.productVariant.update({
              where: { id: variantId },
              data: variantData,
            });
          } else {
            await tx.productVariant.create({
              data: {
                ...variantData,
                productId: id,
              },
            });
          }
        }
      }

      if (images) {
        await tx.productImage.deleteMany({
          where: { productId: id },
        });

        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((image) => ({
              ...image,
              productId: id,
            })),
          });
        }
      }

      return tx.product.findUniqueOrThrow({
        where: { id },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          variants: {
            orderBy: { createdAt: "asc" },
          },
          images: {
            orderBy: { displayOrder: "asc" },
          },
        },
      });
    });

    return NextResponse.json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    if (error instanceof Error && error.message === "INVALID_VARIANT_ID") {
      return NextResponse.json(
        { error: "One or more variants do not belong to this product." },
        { status: 400 }
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "The product slug or a variant SKU already exists." },
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

// DELETE: Archive a product instead of physically deleting it.
export async function DELETE(
  _request: Request,
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