"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@phosphor-icons/react";

export default async function HeroSection() {
  return (
    <section className="relative w-full bg-neutral-50 dark:bg-black">
      {/* Decorative vertical line */}
      <div className="absolute left-0 top-0 h-full w-px bg-neutral-200 dark:bg-neutral-800" />

      <div className="mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Mono Studio — 2026
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-7xl">
            Minimal.
            <br />
            Intentional.
            <br />
            Yours.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg">
            Thời trang tối giản được thiết kế cho những ai đặt chất lượng lên
            hàng đầu. Mỗi sản phẩm — một câu chuyện, một lựa chọn có chủ đích.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/collection/all">
                Khám phá bộ sưu tập
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Về chúng tôi</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom decorative separator */}
      <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />
    </section>
  );
}
