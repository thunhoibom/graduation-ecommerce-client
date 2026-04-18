"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  Star,
  SignOut,
} from "@phosphor-icons/react";
import { useAuth } from "@/hooks/use-auth";
import { ProfileForm } from "./profile-form";
import { AddressList } from "./address-list";
import { OrderList } from "../orders/_components/order-list";

const TABS = [
  { href: "/account", label: "Hồ sơ", icon: User },
  { href: "/account/addresses", label: "Địa chỉ", icon: MapPin },
  { href: "/account/orders", label: "Đơn hàng", icon: Package },
  { href: "/account/reviews", label: "Đánh giá", icon: Star },
];

export function AccountContent() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const fullName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "Tài khoản"
    : "Tài khoản";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Tài khoản
          </h1>
          <p className="mt-0.5 text-sm text-neutral-500">{fullName}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-red-500 transition-colors"
        >
          <SignOut className="size-4" />
          Đăng xuất
        </button>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        {/* Sidebar nav */}
        <nav className="w-full shrink-0 lg:w-44">
          <ul className="flex flex-row gap-1 overflow-x-auto pb-1 lg:flex-col lg:gap-1">
            {TABS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
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

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {pathname === "/account" && user && (
            <div className="rounded-none border border-neutral-200 p-6 dark:border-neutral-800">
              <ProfileForm initial={user} />
            </div>
          )}

          {pathname === "/account/addresses" && (
            <div className="rounded-none border border-neutral-200 p-6 dark:border-neutral-800">
              <AddressList />
            </div>
          )}

          {(pathname === "/account/orders" || pathname === "/account/orders/") && (
            <div className="rounded-none border border-neutral-200 p-6 dark:border-neutral-800">
              <OrderList />
            </div>
          )}

          {(pathname === "/account/reviews" || pathname === "/account/reviews/") && (
            <div className="rounded-none border border-neutral-200 p-6 dark:border-neutral-800">
              <ReviewsPlaceholder />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrdersPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <Package className="size-12 text-neutral-200 dark:text-neutral-800" />
      <div>
        <p className="font-medium text-neutral-500">Chưa có đơn hàng nào</p>
        <p className="mt-1 text-sm text-neutral-400">
          Các đơn hàng của bạn sẽ xuất hiện tại đây.
        </p>
      </div>
      <Link
        href="/collections/all"
        className="mt-2 text-sm underline underline-offset-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
      >
        Bắt đầu mua sắm
      </Link>
    </div>
  );
}

function ReviewsPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <Star className="size-12 text-neutral-200 dark:text-neutral-800" />
      <div>
        <p className="font-medium text-neutral-500">Chưa có đánh giá nào</p>
        <p className="mt-1 text-sm text-neutral-400">
          Đánh giá sản phẩm bạn đã mua sẽ xuất hiện tại đây.
        </p>
      </div>
      <Link
        href="/account/orders"
        className="mt-2 text-sm underline underline-offset-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
      >
        Xem đơn hàng
      </Link>
    </div>
  );
}
