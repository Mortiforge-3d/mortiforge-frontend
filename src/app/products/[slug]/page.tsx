import { PRODUCTS } from "@/src/components/products/data";
import { ProductDetails } from "@/src/components/products/product-details";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = PRODUCTS.find((product) => product.slug === slug);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
