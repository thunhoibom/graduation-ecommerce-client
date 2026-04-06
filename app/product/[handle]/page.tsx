"use client";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// TODO: Replace with actual REST API call when backend is ready
// import { getProduct } from "@/services/rest-api/products/products";
// const product = await getProduct(params.slug);

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  await props.params;

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
      <p className="text-center text-neutral-500">
        Đang kết nối backend... Sản phẩm sẽ hiển thị sau khi REST API sẵn sàng.
      </p>
    </div>
  );
}