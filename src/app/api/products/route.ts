
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

export const runtime = "nodejs";

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  category: z.string().trim().min(1).optional(),
  search: z.string().trim().max(100).optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = querySchema.safeParse({
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    search: searchParams.get("search") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid catalog query parameters.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { page, limit, category, search } = parsed.data;

  try {
    const where = {
      status: "PUBLISHED" as const,
      ...(category
        ? { category: { slug: category } }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              {
                shortDescription: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
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
        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          material: true,
          dimensions: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          variants: {
            where: { status: "ACTIVE" },
            orderBy: { price: "asc" },
            select: {
              id: true,
              color: true,
              price: true,
              stock: true,
            },
          },
          images: {
            orderBy: { displayOrder: "asc" },
            select: {
              imageUrl: true,
              altText: true,
              displayOrder: true,
            },
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
    console.error("Public product listing failed:", error);

    return NextResponse.json(
      { error: "Unable to load products right now." },
      { status: 500 }
    );
  }
}
