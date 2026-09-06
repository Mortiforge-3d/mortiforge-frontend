export default function CustomerHeader() {
  return (
    <div>
      <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
        MORTIFORGE ACCOUNT
      </p>

      <h1 className="heading-font mt-4 text-5xl uppercase leading-none md:text-6xl">
        Welcome Back
      </h1>

      <p className="mt-5 max-w-2xl body-font leading-relaxed text-muted-foreground">
        Manage your orders, custom projects, and account details from one
        place.
      </p>
    </div>
  );
}