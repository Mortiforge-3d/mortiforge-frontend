import { Container } from "../../components/layout/container";
import { PRODUCTS } from "./data";
import { ProductCard } from "./product-card";

export function ProductsGrid() {
  return (
      <Container>
      <div className="mt-16 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </Container>
  );
}
