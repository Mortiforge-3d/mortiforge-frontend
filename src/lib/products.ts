
import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import type {
  ApiProduct,
  ApiProductDetail,
  ProductsApiResponse,
} from "../types/product";

type GetProductsOptions = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
};

const productListSelect = {
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
} satisfies Prisma.ProductSelect;

export async function getProducts(
  options: GetProductsOptions = {},
): Promise<ProductsApiResponse> {
  const page = Math.max(1, Math.floor(options.page ?? 1));
  const limit = Math.min(
    50,
    Math.max(1, Math.floor(options.limit ?? 12)),
  );
  const search = options.search?.trim();

  const where: Prisma.ProductWhereInput = {
    status: "PUBLISHED",
    ...(options.category
      ? { category: { slug: options.category } }
      : {}),
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              shortDescription: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      select: productListSelect,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map((product): ApiProduct => ({
      ...product,
      variants: product.variants.map((variant) => ({
        ...variant,
        price: Number(variant.price),
      })),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProductBySlug(
  slug: string,
): Promise<ApiProductDetail | null> {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    select: {
      ...productListSelect,
      description: true,
      weightGrams: true,
      seoTitle: true,
      seoDescription: true,
    },
  });

  if (!product) {
    return null;
  }

  return {
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      price: Number(variant.price),
    })),
  };
}