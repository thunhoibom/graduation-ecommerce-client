'use client';

import { useState } from 'react';
import Link from 'next/link';
import { paths } from 'src/routes/paths';
import { useGetOrderList } from 'src/core/orders/hooks/use-get-order-list';
import { useAuth } from 'src/shared/hooks/use-auth';
import { formatCurrency } from 'src/shared/utils/format-currency';
import { fDate } from 'src/shared/utils/format-date';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPED: 'Đã giao vận',
  COMPLETED: 'Hoàn thành',
  REJECTED: 'Từ chối',
  CANCELLED: 'Đã hủy',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  COMPLETED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-600',
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { list, total, isLoading } = useGetOrderList({ page, limit });

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-lg text-neutral-500">
          Vui lòng{' '}
          <Link href={paths.auth.login} className="underline hover:text-neutral-700">
            đăng nhập
          </Link>{' '}
          để xem đơn hàng.
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
        Lịch sử đơn hàng
      </h1>

      {isLoading ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-neutral-200 bg-white p-6">
              <div className="h-4 w-1/3 rounded bg-neutral-200" />
              <div className="mt-3 h-4 w-1/2 rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="mt-8 text-center text-neutral-500">
          <p>Chưa có đơn hàng nào.</p>
          <Link href={paths.home} className="mt-4 inline-block text-sm underline">
            Bắt đầu mua sắm
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {list.map((order: import('src/services/rest-api/app-api/types').OrderPojo) => (
            <Link
              key={order.buyOrder}
              href={paths.account.orderDetail(order.buyOrder ?? '')}
              className="block rounded-lg border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    Đơn hàng #{order.buyOrder}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {fDate(order.date, 'HH:mm, dd/MM/yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-neutral-900">
                    {formatCurrency(order.totalValue ?? 0)}
                  </p>
                  {order.status && (
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[order.status.toUpperCase()] ??
                        'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {STATUS_LABELS[order.status.toUpperCase()] ?? order.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Items preview */}
              {order.details && order.details.length > 0 && (
                <p className="mt-3 text-xs text-neutral-500">
                  {order.details
                    .slice(0, 3)
                    .map((d: import('src/services/rest-api/app-api/types').OrderDetailPojo) => d.product?.name ?? 'Sản phẩm')
                    .join(', ')}
                  {order.details.length > 3 ? ` +${order.details.length - 3} sản phẩm` : ''}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-neutral-100"
          >
            ←
          </button>
          <span className="text-sm text-neutral-500">Trang {page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-neutral-100"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
