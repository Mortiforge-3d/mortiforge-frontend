import { Navbar } from "../components/layout/navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="flex min-h-screen items-center justify-center">
        <h1 className="heading-font text-8xl uppercase">Mortiforge</h1>
      </section>
    </main>
  );
}
