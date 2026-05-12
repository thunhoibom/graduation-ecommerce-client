/**
 * HeroSection — Server Component
 * Fetches brand info from /api/public/about, renders hero with text or banner.
 * Buttons are in a client sub-component to avoid Turbopack/phosphor-icons SSR bug.
 */

import Image from "next/image";
import { getAbout } from "@/services/rest-api/about/about";
import { HeroArrowButton } from "./hero-arrows";

export async function HeroSection() {
  let about = null;
  try {
    about = await getAbout();
  } catch {
    // fail silently — fall back to static content
  }

  const brandName = about?.name ?? "Mono Studio";
  const description =
    about?.description ??
    "Thời trang tối giản được thiết kế cho những ai đặt chất lượng lên hàng đầu. Mỗi sản phẩm — một câu chuyện, một lựa chọn có chủ đích.";
  const bannerUrl = about?.bannerImageURL;
  const tagline =
    about?.tagline?.trim() ||
    "Chất liệu chọn lọc · phom dáng rõ ràng — minimal, intentional.";

  return (
    <section className="relative w-full bg-neutral-50 dark:bg-black">
      {/* Decorative vertical line */}
      <div className="absolute left-0 top-0 h-full w-px bg-neutral-200 dark:bg-neutral-800" />

      {bannerUrl ? (
        /* ── Banner image hero ─────────────────────────────────────── */
        <div className="relative h-[400px] overflow-hidden md:h-[480px]">
          <Image
            src={bannerUrl}
            alt={brandName}
            fill
            priority
            className="object-cover"
          />
          {/* Dark overlay for text legibility */}
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 flex h-full items-center">
            <div className="mx-auto max-w-7xl px-4">
              <div className="max-w-xl text-white">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                  {brandName} — 2026
                </p>
                <p className="mt-3 text-sm font-medium text-white/75 md:text-base">{tagline}</p>
                <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
                  Minimal.
                  <br />
                  Intentional.
                  <br />
                  Yours.
                </h1>
                <p className="mt-6 line-clamp-3 text-base leading-relaxed text-white/80 md:text-lg">
                  {description}
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <HeroArrowButton
                    href="/collections/all"
                    variant="primary"
                    label="Khám phá bộ sưu tập"
                  />
                  <HeroArrowButton
                    href="/about"
                    variant="outline"
                    label="Về chúng tôi"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Text-only fallback hero ─────────────────────────────────── */
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div
            className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-[min(70%,28rem)] -translate-y-1/2 rounded-[2rem] bg-gradient-to-br from-neutral-200/50 via-transparent to-neutral-300/35 dark:from-neutral-800/40 dark:to-neutral-950/60"
            aria-hidden
          />
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              {brandName} — 2026
            </p>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 md:text-base">{tagline}</p>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight text-neutral-900 dark:text-white md:text-7xl">
              Tối giản.
              <br />
              Có chủ đích.
              <br />
              Dành cho bạn.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg">
              {description}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <HeroArrowButton
                href="/collections/all"
                variant="primary"
                label="Khám phá bộ sưu tập"
              />
              <HeroArrowButton
                href="/about"
                variant="outline"
                label="Về chúng tôi"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom separator */}
      <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />
    </section>
  );
}
