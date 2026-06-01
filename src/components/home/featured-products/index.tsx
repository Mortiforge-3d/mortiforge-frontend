import { FEATURED_PRODUCTS } from "./data";
import { ProductCard } from "./product-card";
import { SectionHeading } from "./section-heading";
import { Container } from "../../layout/container";
import { Section } from "../../layout/section";

import { Reveal } from "../../animations/reveal";

export function FeaturedProducts() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Featured Collection"
          title="Forged For The Future"
          description="Premium 3D printed creations designed with futuristic precision and crafted for collectors, creators, and innovators."
        />

        <div
          className="
            mt-16
            grid
            gap-6
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {FEATURED_PRODUCTS.map((product,index) => (
            <Reveal key={product.id} delay={index * 0.1}>
              <ProductCard {...product} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
