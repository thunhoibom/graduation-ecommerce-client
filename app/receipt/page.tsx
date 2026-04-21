"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ReceiptRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      router.replace(`/receipt/${token}`);
    } else {
      router.replace("/");
    }
  }, [token, router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
      <p className="text-sm text-neutral-500">Đang chuyển hướng đến biên nhận…</p>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={null}>
      <ReceiptRedirect />
    </Suspense>
  );
}
