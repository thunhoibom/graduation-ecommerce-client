import { HeroSection } from "@/components/home/sections/hero-section";
import { ThreeItemGrid } from "@/components/home/sections/three-item-grid";
import { CollectionsGrid } from "@/components/home/sections/collections-grid";
import { FeaturedCarousel } from "@/components/home/sections/featured-carousel";
import Footer from "@/components/layout/footer";

export const metadata = {
  title: "Mono Studio — Thời trang tối giản",
  description:
    "Khám phá bộ sưu tập thời trang tối giản của Mono Studio. Chất lượng cao, thiết kế có chủ đích.",
  openGraph: { type: "website" },
};

// ISR — revalidate homepage every 5 minutes
export const revalidate = 300;

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <ThreeItemGrid />
      <CollectionsGrid />
      <FeaturedCarousel />
      <Footer />
    </>
  );
}
