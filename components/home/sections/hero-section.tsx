/**
 * HeroSection — Server Component
 * Full-bleed banner first, then editorial brand intro.
 */

import { getAbout } from "@/services/rest-api/about/about";
import { resolveBannerUrls } from "@/lib/banner-urls";
import { HeroArrowButton } from "./hero-arrows";
import { HeroBannerCarousel } from "./hero-banner-carousel";

const DEFAULT_BRAND = "Mono Studio";

function HeroHeadline() {
  return (
    <h1 className="max-w-[14ch] text-[clamp(2.5rem,6.5vw,4.75rem)] font-bold leading-[1.02] tracking-tight text-neutral-900 dark:text-white md:max-w-none">
      Minimal.
      <br />
      Intentional.
      <br />
      <span className="text-neutral-500 dark:text-neutral-400">Yours.</span>
    </h1>
  );
}

export async function HeroSection() {
  let about = null;
  try {
    about = await getAbout();
  } catch {
    // fail silently — fall back to static content
  }

  const brandName = about?.name?.trim() || DEFAULT_BRAND;
  const banners = resolveBannerUrls(about);

  return (
    <section className="home-surface relative overflow-hidden">
      <HeroBannerCarousel banners={banners} brandName={brandName} />

      <div className="border-t border-neutral-200/80 bg-neutral-50/70 dark:border-neutral-800 dark:bg-neutral-950/40">
        <div className="section-shell home-section">
          <div className="max-w-2xl">
            <HeroHeadline />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <HeroArrowButton href="/collections/all" variant="primary" label="Khám phá bộ sưu tập" arrow />
              <HeroArrowButton href="/about" variant="outline" label="Về chúng tôi" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
