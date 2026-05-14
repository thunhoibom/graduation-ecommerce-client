"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  MapPin,
  Heart,
  ArrowRight,
} from "@phosphor-icons/react";
import { getMyOrders } from "@/services/rest-api/orders/orders";
import { getAddressBook } from "@/services/rest-api/address-book";
import type { OrderPojo } from "@/types/order";
import type { AddressBookPojo } from "@/types/person";
import type { PersonPojo } from "@/types/person";
import { formatMoney } from "@/lib/utils";
import {
  ORDER_FULFILLMENT_LABELS,
  formatOrderShortDate,
} from "../orders/_components/order-list";
import { ProfileForm } from "./profile-form";

interface AccountOverviewProps {
  user: PersonPojo;
}

export function AccountOverview({ user }: AccountOverviewProps) {
  const [recentOrder, setRecentOrder] = useState<OrderPojo | null>(null);
  const [defaultAddr, setDefaultAddr] = useState<AddressBookPojo | null>(null);
  const [loading, setLoading] = useState(true);

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.email ||
    "bạn";
  const missingPhone = !String(user.phone1 ?? "").trim();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ordersRes, addresses] = await Promise.all([
          getMyOrders({ pageIndex: 0, pageSize: 1 }),
          getAddressBook(),
        ]);
        if (cancelled) return;
        const first = ordersRes.items?.[0] ?? null;
        setRecentOrder(first);
        const def =
          addresses.find((a) => a.defaultShipping) ?? addresses[0] ?? null;
        setDefaultAddr(def);
      } catch {
        if (!cancelled) {
          setRecentOrder(null);
          setDefaultAddr(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fulfillment = recentOrder?.fulfillmentStatus ?? recentOrder?.status;
  const statusInfo = ORDER_FULFILLMENT_LABELS[fulfillment ?? ""] ?? {
    label: fulfillment ?? "—",
    color:
      "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
  };

  const addressLine = defaultAddr
    ? [
        defaultAddr.address?.firstLine,
        defaultAddr.address?.municipality,
        defaultAddr.address?.city,
      ]
        .filter(Boolean)
        .join(", ")
    : null;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
          Tổng quan
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Xin chào,{" "}
          <span className="font-medium text-neutral-800 dark:text-neutral-200">
            {displayName}
          </span>
          . Quản lý thông tin và theo dõi đơn hàng tại đây.
        </p>
        {missingPhone && (
          <p className="text-sm text-amber-800 dark:text-amber-200/90">
            Thêm số điện thoại bên dưới để cửa hàng liên hệ khi giao hàng.
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Đơn gần nhất */}
        <div className="flex flex-col rounded-none border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-neutral-500">
            <Package className="size-4 shrink-0" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Đơn gần nhất
            </span>
          </div>
          {loading ? (
            <div className="mt-4 flex flex-1 items-center justify-center py-6">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-600 dark:border-t-neutral-100" />
            </div>
          ) : recentOrder ? (
            <>
              <p className="mt-3 font-mono text-sm font-semibold text-neutral-900 dark:text-white">
                #{recentOrder.buyOrder}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                {formatOrderShortDate(recentOrder.date)}
              </p>
              <span
                className={`mt-2 inline-flex w-fit rounded px-2 py-0.5 text-[11px] font-medium ${statusInfo.color}`}
              >
                {statusInfo.label}
              </span>
              <p className="mt-2 text-sm font-medium text-neutral-900 dark:text-white">
                {formatMoney(
                  recentOrder.totalValue ?? recentOrder.netValue ?? 0
                )}
              </p>
              <Link
                href={`/account/orders/${recentOrder.buyOrder}`}
                className="mt-auto pt-4 inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                Chi tiết đơn
                <ArrowRight className="size-3.5" />
              </Link>
            </>
          ) : (
            <>
              <p className="mt-3 flex-1 text-sm text-neutral-500">
                Bạn chưa có đơn hàng.
              </p>
              <Link
                href="/collections/all"
                className="mt-4 inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                Mua sắm ngay
                <ArrowRight className="size-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Địa chỉ */}
        <div className="flex flex-col rounded-none border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-neutral-500">
            <MapPin className="size-4 shrink-0" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Địa chỉ giao hàng
            </span>
          </div>
          {loading ? (
            <div className="mt-4 flex flex-1 items-center justify-center py-6">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-600 dark:border-t-neutral-100" />
            </div>
          ) : addressLine ? (
            <>
              <p className="mt-3 text-sm font-medium text-neutral-900 dark:text-white">
                {defaultAddr?.label ?? "Địa chỉ"}
              </p>
              <p className="mt-1 text-sm text-neutral-500 line-clamp-3">
                {addressLine}
              </p>
              {defaultAddr?.defaultShipping && (
                <span className="mt-2 inline-flex w-fit rounded border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-500 dark:border-neutral-700">
                  Mặc định
                </span>
              )}
              <Link
                href="/account/addresses"
                className="mt-auto pt-4 inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                Quản lý địa chỉ
                <ArrowRight className="size-3.5" />
              </Link>
            </>
          ) : (
            <>
              <p className="mt-3 flex-1 text-sm text-neutral-500">
                Chưa lưu địa chỉ giao hàng.
              </p>
              <Link
                href="/account/addresses"
                className="mt-4 inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                Thêm địa chỉ
                <ArrowRight className="size-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Yêu thích */}
        <div className="flex flex-col rounded-none border border-neutral-200 p-4 dark:border-neutral-800 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 text-neutral-500">
            <Heart className="size-4 shrink-0" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Danh sách yêu thích
            </span>
          </div>
          <p className="mt-3 flex-1 text-sm text-neutral-500">
            Xem và chỉnh sửa sản phẩm bạn đã lưu.
          </p>
          <Link
            href="/wishlist"
            className="mt-4 inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            Mở yêu thích
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <div className="rounded-none border border-neutral-200 p-6 dark:border-neutral-800">
        <ProfileForm initial={user} />
      </div>
    </div>
  );
}
