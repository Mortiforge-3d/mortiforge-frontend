
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  const { slug } = await params;

  if (!slug || slug.length > 180) {
    return NextResponse.json(
      { error: "Invalid product slug." },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        description: true,
        material: true,
        weightGrams: true,
        dimensions: true,
        seoTitle: true,
        seoDescription: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        variants: {
          where: {
            status: "ACTIVE",
          },
          orderBy: {
            price: "asc",
          },
          select: {
            id: true,
            color: true,
            price: true,
            stock: true,
          },
        },
        images: {
          orderBy: {
            displayOrder: "asc",
          },
          select: {
            imageUrl: true,
            altText: true,
            displayOrder: true,
          },
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
    console.error("Product detail lookup failed:", error);

    return NextResponse.json(
      { error: "Unable to load this product right now." },
      { status: 500 }
    );
  }
}
