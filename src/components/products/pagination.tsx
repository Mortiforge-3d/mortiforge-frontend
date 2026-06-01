import { Container } from "../layout/container";

export function Pagination() {
  return (
    <Container>
      <div className="mt-20 flex items-center justify-center gap-4">
        <button className="text-muted-foreground hover:text-primary">
          ← Previous
        </button>

        <button className="text-primary">1</button>
        <button className="text-muted-foreground">2</button>
        <button className="text-muted-foreground">3</button>

        <button className="text-muted-foreground hover:text-primary">
          Next →
        </button>
      </div>
    </Container>
  );
}
