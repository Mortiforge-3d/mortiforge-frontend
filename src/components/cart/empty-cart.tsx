import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-border bg-card/40 px-6 py-20 text-center">
      <p className="body-font text-sm uppercase tracking-[0.3em] text-primary">
        Your Cart
      </p>

      <h2 className="heading-font mt-4 text-4xl uppercase md:text-5xl">
        Your Cart Is Empty
      </h2>

      <p className="mt-5 max-w-md body-font leading-relaxed text-muted-foreground">
        Looks like you haven&apos;t added anything to your cart yet.
        Explore our collection and find something worth printing.
      </p>

      <Link
        href="/products"
        className="
          mt-8
          rounded-full
          bg-primary
          px-8
          py-4
          body-font
          font-semibold
          text-primary-foreground
          transition-all
          hover:scale-[1.02]
        "
      >
        Browse Products
      </Link>
    </div>
  );
}