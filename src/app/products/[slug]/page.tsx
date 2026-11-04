
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/src/lib/products";
import { ProductDetails } from "@/src/components/products/product-details";
import { RelatedProducts } from "@/src/components/products/related-products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const { products } = await getProducts({
    page: 1,
    limit: 12,
    category: product.category.slug,
  });

  const relatedProducts = products
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  return (
    <>
      <ProductDetails product={product} />
      <RelatedProducts product={relatedProducts} />
    </>
  );
}
