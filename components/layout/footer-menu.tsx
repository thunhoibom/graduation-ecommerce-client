"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import type { MenuItem } from "@/types/common";

const SITE_NAME = process.env.SITE_NAME ?? "Mono Studio";

function SocialIcons() {
  return (
    <div className="flex items-center gap-3">
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="flex h-9 w-9 items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      </a>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="flex h-9 w-9 items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
        </svg>
      </a>
      <a
        href="https://tiktok.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok"
        className="flex h-9 w-9 items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.84a4.85 4.85 0 0 1-1.01-.15z" />
        </svg>
      </a>
    </div>
  );
}

function FooterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800 md:border-none">
      {/* Mobile: collapsible */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 text-left md:cursor-default md:py-0"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-900 dark:text-white">
          {title}
        </span>
        <CaretDownIcon
          className={`size-4 text-neutral-400 transition-transform duration-200 md:hidden ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-200 md:block ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 md:opacity-100 md:max-h-96"
        }`}
      >
        <ul className="space-y-2 pb-3 md:space-y-3 md:pb-0">
          {children}
        </ul>
      </div>
    </div>
  );
}

function FooterLink({ item }: { item: MenuItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.path;
  const isExternal = item.external;

  const linkContent = (
    <span
      className={`text-sm transition-colors ${
        isActive
          ? "text-neutral-900 dark:text-white"
          : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      }`}
    >
      {item.title}
    </span>
  );

  if (isExternal) {
    return (
      <li>
        <a href={item.path} target="_blank" rel="noopener noreferrer">
          {linkContent}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link href={item.path}>{linkContent}</Link>
    </li>
  );
}

const SECTIONS = [
  { title: "Hỗ trợ", children: [
    { id: 101, title: "Hướng dẫn mua hàng", path: "/help/shopping-guide" },
    { id: 102, title: "Chính sách đổi trả", path: "/help/return-policy" },
    { id: 103, title: "Chính sách vận chuyển", path: "/help/shipping" },
    { id: 104, title: "Câu hỏi thường gặp", path: "/help/faq" },
  ]},
  { title: "Công ty", children: [
    { id: 111, title: "Giới thiệu", path: "/about" },
    { id: 112, title: "Tuyển dụng", path: "/careers" },
    { id: 113, title: "Tin tức", path: "/blog" },
  ]},
  { title: "Kết nối", children: [
    { id: 121, title: "Facebook", path: "https://facebook.com", external: true },
    { id: 122, title: "Instagram", path: "https://instagram.com", external: true },
    { id: 123, title: "TikTok", path: "https://tiktok.com", external: true },
  ]},
];

export { SocialIcons, FooterSection, FooterLink };
