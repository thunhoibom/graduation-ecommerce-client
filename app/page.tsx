import HeroSection from "@/components/home/hero-section";
import { ThreeItemGrid } from "@/components/grid/three-items";
import { CollectionsGrid } from "@/components/home/collections-grid";
import { Carousel } from "@/components/carousel";
import Footer from "@/components/layout/footer";

export const metadata = {
  title: "Mono Studio — Thời trang tối giản",
  description:
    "Khám phá bộ sưu tập thời trang tối giản của Mono Studio. Chất lượng cao, thiết kế có chủ đích.",
  openGraph: { type: "website" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ThreeItemGrid />
      <CollectionsGrid />
      <Carousel />
      <Footer />
    </>
  );
}
