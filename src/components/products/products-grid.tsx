
import { Container } from "../../components/layout/container";
import { getProducts } from "../../lib/products";
import { ProductCard } from "./product-card";

export async function ProductsGrid() {
  const { products } = await getProducts({ page: 1, limit: 12 });

  return (
    <Container>
      {products.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 py-16 text-center">
          <h2 className="heading-font text-2xl uppercase">
            No products available
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Check back soon for new creations.
          </p>
        </div>
      )}
    </Container>
  );
}
