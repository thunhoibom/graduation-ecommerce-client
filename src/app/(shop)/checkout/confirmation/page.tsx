'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { paths } from 'src/routes/paths';
import { formatCurrency } from 'src/shared/utils/format-currency';
import { useValidateCheckout } from 'src/core/checkout/hooks/use-validate-checkout';
import type { ReceiptDetailPojo } from 'src/services/rest-api/app-api/types';

function ConfirmationContent() {
  const { receipt, isSuccess, isLoading, error } = useValidateCheckout();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-neutral-200" />
          <p className="mt-4 text-lg font-medium text-neutral-500">Đang xử lý kết quả thanh toán…</p>
        </div>
      </div>
    );
  }

  if (error || (!isSuccess && !receipt)) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <span className="text-2xl">✗</span>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-neutral-900">
          Thanh toán không thành công
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Đơn hàng đã bị hủy hoặc xảy ra lỗi. Vui lòng thử lại.
        </p>
        <Link
          href={paths.home}
          className="mt-8 inline-block rounded-md bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  if (isSuccess && receipt) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-neutral-900">
          Đặt hàng thành công!
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Cảm ơn bạn đã đặt hàng. Đơn hàng #{receipt.buyOrder} đang được xử lý.
        </p>

        {receipt.details && receipt.details.length > 0 && (
          <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-6 text-left">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Chi tiết đơn hàng
            </h2>
            <ul className="mt-4 space-y-3">
              {receipt.details.map((detail: ReceiptDetailPojo, i: number) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>
                    {detail.product?.name ?? 'Sản phẩm'} × {detail.units}
                  </span>
                  <span className="font-medium">
                    {detail.unitValue != null
                      ? formatCurrency(detail.unitValue * (detail.units ?? 1))
                      : ''}
                  </span>
                </li>
              ))}
            </ul>
            {receipt.totalValue != null && (
              <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 font-semibold">
                <span>Tổng cộng</span>
                <span>{formatCurrency(receipt.totalValue)}</span>
              </div>
            )}
            {receipt.status && (
              <p className="mt-3 text-center text-sm text-neutral-500">
                Trạng thái: <span className="font-medium text-neutral-700">{receipt.status}</span>
              </p>
            )}
          </div>
        )}

        <Link
          href={paths.account.orders}
          className="mt-8 inline-block text-sm underline hover:text-neutral-700"
        >
          Xem lịch sử đơn hàng
        </Link>
        <Link
          href={paths.home}
          className="mt-4 ml-4 inline-block text-sm underline hover:text-neutral-700"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return null;
}

export default function CheckoutConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-neutral-500">Đang tải…</p>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
