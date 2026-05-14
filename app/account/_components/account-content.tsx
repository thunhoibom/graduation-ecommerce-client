"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { AccountLayout } from "./account-layout";
import { AccountOverview } from "./account-overview";
import { AddressList } from "./address-list";
import { OrderList } from "../orders/_components/order-list";
import { MyReviewsList } from "./my-reviews-list";

export function AccountContent() {
  const pathname = usePathname();
  const { user } = useAuth();
  const norm = pathname.replace(/\/$/, "") || "/";

  return (
    <AccountLayout>
      {norm === "/account" && user && <AccountOverview user={user} />}

      {norm.startsWith("/account/addresses") && (
        <div className="rounded-none border border-neutral-200 p-6 dark:border-neutral-800">
          <AddressList />
        </div>
      )}

      {(norm === "/account/orders" || norm === "/account/orders/") && (
        <div className="rounded-none border border-neutral-200 p-6 dark:border-neutral-800">
          <OrderList />
        </div>
      )}

      {norm === "/account/reviews" && (
        <div className="rounded-none border border-neutral-200 p-6 dark:border-neutral-800">
          <MyReviewsList />
        </div>
      )}
    </AccountLayout>
  );
}
