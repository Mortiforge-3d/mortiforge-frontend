import { PRODUCTS } from "./data";
import { ProductCard } from "../home/featured-products/product-card";
import { Container } from "../layout/container";
import { Reveal } from "../animations/reveal";

export function ProductsGrid() {
  return (
    <Container>
      <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {PRODUCTS.map((product, index) => (
          <Reveal key={product.id} delay={index * 0.08}>
            <ProductCard {...product}/>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
