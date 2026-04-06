import Link from "next/link";

import FooterMenu from "components/layout/footer-menu";
import LogoSquare from "components/logo-square";
import { FOOTER_MENU } from "config/navigation";
import type { MenuItem } from "@/types/common";
import { Suspense } from "react";

const SITE_NAME = process.env.SITE_NAME ?? "Mono Studio";
const currentYear = new Date().getFullYear();

export default async function Footer() {
  // Menu now comes from static config — no backend call needed
  const menu: MenuItem[] = FOOTER_MENU;

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0 dark:border-neutral-700">
        <div>
          <Link
            className="flex items-center gap-2 text-black md:pt-1 dark:text-white"
            href="/"
          >
            <LogoSquare size="sm" />
            <span className="uppercase">{SITE_NAME}</span>
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="flex h-[188px] w-[200px] flex-col gap-2">
              <div className="w-full h-6 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-700" />
              <div className="w-full h-6 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-700" />
              <div className="w-full h-6 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-700" />
              <div className="w-full h-6 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-700" />
              <div className="w-full h-6 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-700" />
              <div className="w-full h-6 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-700" />
            </div>
          }
        >
          <FooterMenu menu={menu} />
        </Suspense>
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p>
            &copy; {currentYear} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
