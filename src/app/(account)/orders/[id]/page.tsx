'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { paths } from 'src/routes/paths';
import { useGetOrderDetail } from 'src/core/orders/hooks/use-get-order-detail';
import { useAuth } from 'src/shared/hooks/use-auth';
import { formatCurrency } from 'src/shared/utils/format-currency';
import { fDate } from 'src/shared/utils/format-date';

type PageProps = {
  params: Promise<{ id: string }>;
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPED: 'Đã giao vận',
  COMPLETED: 'Hoàn thành',
  REJECTED: 'Từ chối',
  CANCELLED: 'Đã hủy',
};

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { isAuthenticated } = useAuth();
  const { data: order, isLoading } = useGetOrderDetail(id);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-lg text-neutral-500">
          Vui lòng{' '}
          <Link href={paths.auth.login} className="underline">đăng nhập</Link> để xem đơn hàng.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 animate-pulse space-y-4">
        <div className="h-8 w-1/3 rounded bg-neutral-200" />
        <div className="h-64 rounded bg-neutral-200" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-neutral-500">Không tìm thấy đơn hàng.</p>
        <Link href={paths.account.orders} className="mt-4 inline-block text-sm underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back */}
      <Link
        href={paths.account.orders}
        className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900"
      >
        ← Lịch sử đơn hàng
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Đơn hàng #{order.buyOrder}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Đặt lúc {fDate(order.date, 'HH:mm, dd/MM/yyyy')}
          </p>
        </div>
        {order.status && (
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
            {STATUS_LABELS[order.status.toUpperCase()] ?? order.status}
          </span>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Order items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-6 py-4">
              <h2 className="font-semibold text-neutral-900">Sản phẩm</h2>
            </div>
            <ul className="divide-y divide-neutral-100">
              {order.details?.map((detail, i) => (
                <li key={i} className="flex items-center gap-4 px-6 py-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-neutral-100">
                    {detail.product?.images?.[0]?.url ? (
                      <Image
                        src={detail.product.images[0].url}
                        alt={detail.product.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-50 text-neutral-400 text-xs">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">
                      {detail.product?.name ?? 'Sản phẩm'}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {formatCurrency(detail.unitValue ?? 0)} × {detail.units}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {detail.units != null && detail.unitValue != null
                      ? formatCurrency(detail.units * detail.unitValue)
                      : ''}
                  </p>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <div className="border-t border-neutral-200 px-6 py-4">
              <dl className="space-y-2 text-sm">
                {order.netValue != null && (
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Tạm tính</dt>
                    <dd>{formatCurrency(order.netValue)}</dd>
                  </div>
                )}
                {order.taxValue != null && order.taxValue > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Thuế</dt>
                    <dd>{formatCurrency(order.taxValue)}</dd>
                  </div>
                )}
                {order.transportValue != null && order.transportValue > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Vận chuyển</dt>
                    <dd>{formatCurrency(order.transportValue)}</dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-neutral-200 pt-2 font-semibold">
                  <dt>Tổng cộng</dt>
                  <dd>{formatCurrency(order.totalValue ?? 0)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Customer */}
          {order.customer && (
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                Khách hàng
              </h3>
              <div className="mt-3 space-y-1 text-sm text-neutral-600">
                <p>{order.customer.firstName} {order.customer.lastName}</p>
                <p>{order.customer.email}</p>
                {order.customer.phone1 && <p>{order.customer.phone1}</p>}
              </div>
            </div>
          )}

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                Địa chỉ giao hàng
              </h3>
              <div className="mt-3 space-y-1 text-sm text-neutral-600">
                <p>{order.shippingAddress.firstLine}</p>
                {order.shippingAddress.secondLine && <p>{order.shippingAddress.secondLine}</p>}
                <p>{order.shippingAddress.municipality}</p>
                <p>{order.shippingAddress.city}{order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}</p>
              </div>
            </div>
          )}

          {/* Billing address */}
          {order.billingAddress && (
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                Địa chỉ xuất hóa đơn
              </h3>
              <div className="mt-3 space-y-1 text-sm text-neutral-600">
                <p>{order.billingAddress.firstLine}</p>
                {order.billingAddress.secondLine && <p>{order.billingAddress.secondLine}</p>}
                <p>{order.billingAddress.municipality}</p>
                <p>{order.billingAddress.city}{order.billingAddress.postalCode ? `, ${order.billingAddress.postalCode}` : ''}</p>
              </div>
            </div>
          )}

          {/* Payment */}
          {order.paymentType && (
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                Thanh toán
              </h3>
              <p className="mt-3 text-sm text-neutral-600">{order.paymentType}</p>
              {order.billingType && (
                <p className="mt-1 text-xs text-neutral-400">{order.billingType}</p>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
