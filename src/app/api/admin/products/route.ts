
import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/auth/require-admin";

export const runtime = "nodejs";

const productSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().trim().min(2).max(160),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  shortDescription: z.string().trim().max(300).optional(),
  description: z.string().trim().min(1),
  material: z.string().trim().max(100).optional(),
  weightGrams: z.number().int().positive().optional(),
  dimensions: z.string().trim().max(100).optional(),
  seoTitle: z.string().trim().max(180).optional(),
  seoDescription: z.string().trim().max(320).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),

  variants: z
    .array(
      z.object({
        color: z.string().trim().min(1).max(60),
        sku: z.string().trim().min(1).max(100),
        price: z
          .string()
          .regex(/^\d{1,8}(?:\.\d{1,2})?$/)
          .refine((value) => Number(value) > 0, {
            message: "Price must be greater than zero.",
          }),
        stock: z.number().int().min(0).default(0),
        status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
      })
    )
    .min(1),

  images: z
    .array(
      z.object({
        imageUrl: z
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
          }, "Image must be a valid HTTP(S) URL or a local absolute path."),
        altText: z.string().trim().max(250).optional(),
        displayOrder: z.number().int().min(0).default(0),
      })
    )
    .max(20)
    .default([]),
});

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

  const result = productSchema.safeParse(body);

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

    const product = await prisma.$transaction(async (tx) => {
      return tx.product.create({
        data: {
          categoryId: data.categoryId,
          name: data.name,
          slug: data.slug,
          description: data.description,
          shortDescription: data.shortDescription,
          material: data.material,
          weightGrams: data.weightGrams,
          dimensions: data.dimensions,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          status: data.status,

          variants: {
            create: data.variants.map((variant) => ({
              color: variant.color,
              sku: variant.sku,
              price: variant.price,
              stock: variant.stock,
              status: variant.status,
            })),
          },

          images: {
            create: data.images.map((image) => ({
              imageUrl: image.imageUrl,
              altText: image.altText,
              displayOrder: image.displayOrder,
            })),
          },
        },
        include: {
          category: true,
          variants: true,
          images: true,
        },
      });
    });

    return NextResponse.json(
      {
        message: "Product created successfully.",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "The product slug or a variant SKU already exists." },
        { status: 409 }
      );
    }

    console.error("Product creation failed:", error);

    return NextResponse.json(
      { error: "Unable to create the product right now." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const admin = await requireAdmin();

  if (!admin.authorized) {
    return NextResponse.json(
      { error: admin.error },
      { status: admin.status }
    );
  }

  const { searchParams } = new URL(request.url);

  const pageParam = Number(searchParams.get("page") ?? "1");
  const limitParam = Number(searchParams.get("limit") ?? "10");
  const search = searchParams.get("search")?.trim() ?? "";
  const statusParam = searchParams.get("status");

  const page = Number.isInteger(pageParam) && pageParam > 0
    ? pageParam
    : 1;

  const limit = Number.isInteger(limitParam)
    ? Math.min(Math.max(limitParam, 1), 50)
    : 10;

  const validStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

  const status = validStatuses.includes(
    statusParam as (typeof validStatuses)[number]
  )
    ? (statusParam as (typeof validStatuses)[number])
    : undefined;

  try {
    const where = {
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { slug: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          variants: true,
          images: {
            orderBy: { displayOrder: "asc" },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Product listing failed:", error);

    return NextResponse.json(
      { error: "Unable to fetch products right now." },
      { status: 500 }
    );
  }
}
