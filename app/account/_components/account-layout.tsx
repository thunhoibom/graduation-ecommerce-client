"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  Star,
  ArrowsClockwise,
  SignOut,
} from "@phosphor-icons/react";
import { useAuth } from "@/hooks/use-auth";

const TABS = [
  { href: "/account", label: "Hồ sơ", icon: User },
  { href: "/account/addresses", label: "Địa chỉ", icon: MapPin },
  { href: "/account/orders", label: "Đơn hàng", icon: Package },
  { href: "/account/returns/new", label: "Trả hàng", icon: ArrowsClockwise },
  { href: "/account/reviews", label: "Đánh giá", icon: Star },
];

function tabActive(pathname: string, href: string): boolean {
  const norm = pathname.replace(/\/$/, "") || "/";
  if (href === "/account") return norm === "/account";
  if (href === "/account/orders") return norm.startsWith("/account/orders");
  if (href === "/account/returns/new") return norm.startsWith("/account/returns");
  if (href === "/account/addresses") return norm.startsWith("/account/addresses");
  if (href === "/account/reviews") return norm === "/account/reviews";
  return false;
}

export function AccountLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const fullName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "Tài khoản"
    : "Tài khoản";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Tài khoản
          </h1>
          <p className="mt-0.5 text-sm text-neutral-500">{fullName}</p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-red-500 transition-colors"
        >
          <SignOut className="size-4" />
          Đăng xuất
        </button>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <nav className="w-full shrink-0 lg:w-44" aria-label="Tài khoản">
          <ul className="flex flex-row gap-1 overflow-x-auto pb-1 lg:flex-col lg:gap-1">
            {TABS.map(({ href, label, icon: Icon }) => {
              const active = tabActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={[
                      "flex items-center gap-2 whitespace-nowrap rounded px-3 py-2 text-sm transition-colors lg:w-full",
                      active
                        ? "bg-neutral-900 font-medium text-white dark:bg-white dark:text-black"
                        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800",
                    ].join(" ")}
                  >
                    <Icon className="size-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
