
/**
 * Shared types for products returned by the backend API.
 * Prices may arrive as strings from Prisma Decimal serialization,
 * so frontend code should normalize them with Number(price).
 */

export type ApiProductVariant = {
  id: string;
  color: string;
  price: number | string;
  stock: number;
};

export type ApiProductImage = {
  imageUrl: string;
  altText: string | null;
  displayOrder: number;
};

export type ApiProductCategory = {
  name: string;
  slug: string;
};

export type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  material: string | null;
  dimensions: string | null;
  category: ApiProductCategory;
  variants: ApiProductVariant[];
  images: ApiProductImage[];
};

export type ApiProductDetail = ApiProduct & {
  description: string | null;
  weightGrams: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type ProductsApiResponse = {
  products: ApiProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ProductDetailApiResponse = {
  product: ApiProductDetail;
};
