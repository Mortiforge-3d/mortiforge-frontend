import { Container } from "../layout/container";

const categories = ["All", "Figures", "Decor", "Props", "Custom"];

export function ProductsFilter() {
  return (
    <Container>
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {categories.map((category) => (
          <button
            key={category}
            className="
              rounded-full
              border
              border-border
              px-6
              py-3
              text-sm
              uppercase
              tracking-wide
              text-muted-foreground
              transition-all
              duration-300
              hover:border-primary
              hover:text-primary
            "
          >
            {category}
          </button>
        ))}
      </div>
    </Container>
  );
}