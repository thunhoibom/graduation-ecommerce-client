/**
 * HeroSection — Server Component
 * Fetches brand info from /api/public/about, renders hero with text or banner.
 * Buttons are in a client sub-component to avoid Turbopack/phosphor-icons SSR bug.
 */

import Image from "next/image";
import { getAbout } from "@/services/rest-api/about/about";
import { cn } from "@/lib/utils";
import { HeroArrowButton } from "./hero-arrows";

const DEFAULT_BRAND = "Mono Studio";
const DEFAULT_TAGLINE =
  "Chất liệu chọn lọc · form chuẩn · phong cách tinh giản.";
const DEFAULT_DESCRIPTION =
  "Thời trang tối giản cho người đề cao chất liệu và đường may. Mỗi sản phẩm là một lựa chọn có chủ đích — không dư thừa, không nhất thời.";

function HeroHeadline({ inverted }: { inverted: boolean }) {
  return (
    <h1
      className={cn(
        "mt-5 max-w-[14ch] font-display text-[clamp(2.25rem,6vw,4.5rem)] font-bold leading-[1.06] tracking-tight md:max-w-none",
        inverted ? "text-white" : "text-neutral-900 dark:text-white",
      )}
    >
      Minimal.
      <br />
      Intentional.
      <br />
      Yours.
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
  const description = about?.description?.trim() || DEFAULT_DESCRIPTION;
  const bannerUrl = about?.bannerImageURL?.trim();
  const tagline = about?.tagline?.trim() || DEFAULT_TAGLINE;

  return (
    <section className="relative w-full bg-neutral-50 dark:bg-black">
      <div
        className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-neutral-300 from-10% via-neutral-200 to-transparent dark:from-neutral-700 dark:via-neutral-800 sm:block"
        aria-hidden
      />

      {bannerUrl ? (
        <div className="relative min-h-[min(70vh,28rem)] overflow-hidden md:min-h-[28rem]">
          <Image
            src={bannerUrl}
            alt={brandName}
            fill
            priority
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/52 to-black/35 md:from-black/72 md:via-black/48 md:to-black/28"
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/15 md:bg-transparent" aria-hidden />

          <div className="relative z-10 flex min-h-[min(70vh,28rem)] items-center py-14 md:min-h-[28rem] md:py-0">
            <div className="mx-auto w-full max-w-7xl px-4">
              <div className="max-w-xl text-white">
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-white/65">
                  {brandName}
                  <span className="mx-2 text-white/35" aria-hidden>
                    ·
                  </span>
                  <span className="font-normal tracking-[0.18em] text-white/55">2026</span>
                </p>
                <p className="mt-3 max-w-md text-sm font-normal leading-snug text-white/80 md:text-[0.95rem]">
                  {tagline}
                </p>
                <HeroHeadline inverted />
                <p className="mt-6 max-w-lg text-base leading-relaxed text-white/82 md:text-lg">
                  {description}
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <HeroArrowButton
                    href="/collections/all"
                    variant="primary"
                    label="Khám phá bộ sưu tập"
                    className="shadow-md shadow-black/25"
                  />
                  <HeroArrowButton
                    href="/about"
                    variant="outline"
                    label="Về chúng tôi"
                    className="border-white/45 bg-white/5 text-white backdrop-blur-[2px] hover:bg-white/12 hover:text-white dark:border-white/45 dark:bg-white/5 dark:text-white dark:hover:bg-white/12 dark:hover:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-28">
          <div
            className="pointer-events-none absolute inset-x-4 top-1/2 z-0 h-[min(72%,26rem)] max-w-3xl -translate-y-1/2 rounded-[1.75rem] bg-gradient-to-br from-neutral-200/55 via-transparent to-neutral-300/25 dark:from-neutral-800/35 dark:to-neutral-950/55 md:inset-x-auto md:left-1/2 md:w-[min(100%,42rem)] md:-translate-x-1/2"
            aria-hidden
          />
          <div className="relative z-10 max-w-2xl">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
              {brandName}
              <span className="mx-2 text-neutral-300 dark:text-neutral-600" aria-hidden>
                ·
              </span>
              <span className="font-normal tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
                2026
              </span>
            </p>
            <p className="mt-3 max-w-md text-sm leading-snug text-neutral-600 dark:text-neutral-400 md:text-[0.95rem]">
              {tagline}
            </p>
            <HeroHeadline inverted={false} />
            <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg">
              {description}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <HeroArrowButton href="/collections/all" variant="primary" label="Khám phá bộ sưu tập" />
              <HeroArrowButton href="/about" variant="outline" label="Về chúng tôi" />
            </div>
          </div>
        </div>
      )}

      <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />
    </section>
  );
}
