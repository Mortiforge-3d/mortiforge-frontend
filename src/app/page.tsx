import { Navbar } from "../components/layout/navbar";
import { HeroSection } from "../components/home/hero";
import { FeaturedProducts } from "../components/home/featured-products";
import { HowItWorks } from "../components/home/how-it-works";
import { WhyChooseUs } from "../components/home/why-choose-us";
import { Testimonials } from "../components/home/testimonials";
import { Footer } from "../components/layout/footer/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <Footer/>
    </main>
  );
}
