import { PRODUCTS } from "@/src/components/products/data";
import { ProductDetails } from "@/src/components/products/product-details";
import { RelatedProducts } from "@/src/components/products/related-products";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = PRODUCTS.find((p) => p.slug === slug);

  const relatedProducts = PRODUCTS.filter(
    (p) => p.slug !== product?.slug
  ).slice(0, 3);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductDetails product={product} />
      <RelatedProducts product={relatedProducts} />
    </>
  );
}
