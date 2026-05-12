import type { Metadata } from "next";
import { HeroSection } from "@/components/home/sections/hero-section";
import { WeatherHeroSection } from "@/components/home/sections/weather-hero-section";
import { ThreeItemGrid } from "@/components/home/sections/three-item-grid";
import { CollectionsGrid } from "@/components/home/sections/collections-grid";
import { FeaturedCarousel } from "@/components/home/sections/featured-carousel";
import { HomeForYouSection } from "@/components/home/sections/home-for-you-section";
import { HomeBlogSection } from "@/components/home/sections/home-blog-section";
import { HomeUspStrip } from "@/components/home/sections/home-usp-strip";
import { HomeShopShortcuts } from "@/components/home/sections/home-shop-shortcuts";
import Footer from "@/components/layout/footer";
import { getAbout } from "@/services/rest-api/about/about";
import { baseUrl } from "@/lib/utils";

const defaultTitle = "Mono Studio — Thời trang tối giản";
const defaultDescription =
  "Khám phá bộ sưu tập thời trang tối giản của Mono Studio. Chất lượng cao, thiết kế có chủ đích.";

function absoluteOgImageUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  try {
    return new URL(url.startsWith("/") ? url : `/${url}`, baseUrl).toString();
  } catch {
    return url;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  let about: Awaited<ReturnType<typeof getAbout>> | null = null;
  try {
    about = await getAbout();
  } catch {
    about = null;
  }

  const title = about?.name ? `${about.name} — Thời trang tối giản` : defaultTitle;
  const description = about?.description?.trim() || defaultDescription;
  const ogImage = about?.bannerImageURL ? absoluteOgImageUrl(about.bannerImageURL) : undefined;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: baseUrl,
      siteName: about?.name ?? "Mono Studio",
      title,
      description,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

// ISR — revalidate homepage every 5 minutes (nested routes use the minimum revalidate of the tree).
export const revalidate = 300;

export default async function HomePage() {
  return (
    <div className="space-y-0 pb-6 md:pb-8">
      <HeroSection />
      <HomeUspStrip />
      <HomeShopShortcuts />
      <WeatherHeroSection />
      <ThreeItemGrid />
      <CollectionsGrid />
      <FeaturedCarousel />
      <HomeForYouSection />
      <HomeBlogSection />
      <Footer />
    </div>
  );
}
