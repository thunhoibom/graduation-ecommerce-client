'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Price from 'components/price';
import { useCart } from 'components/cart/cart-context';
import { useAuth } from 'src/shared/hooks/use-auth';
import { useInitiateCheckout } from 'src/core/checkout/hooks/use-initiate-checkout';
import { paths } from 'src/routes/paths';
import type { OrderPojo, OrderDetailPojo, PaymentRedirectionDetailsPojo } from 'src/services/rest-api/app-api/types';
import { getErrorMessage } from 'src/services/rest-api/app-api/error-handler';
import { formatCurrency } from 'src/shared/utils/format-currency';

const PAYMENT_TYPES = [
  { value: 'WEBPAY', label: 'Thanh toán thẻ (Webpay Plus)' },
  { value: 'CASH', label: 'Tiền mặt' },
  { value: 'TRANSFER', label: 'Chuyển khoản ngân hàng' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCart();
  const { user } = useAuth();
  const { initiate, isInitiating } = useInitiateCheckout();

  const [form, setForm] = useState({
    // Customer
    firstName: user?.profile?.firstName ?? '',
    lastName: user?.profile?.lastName ?? '',
    email: user?.profile?.email ?? '',
    phone1: user?.profile?.phone1 ?? '',
    // Billing address
    billingFirstLine: '',
    billingSecondLine: '',
    billingMunicipality: '',
    billingCity: '',
    billingPostalCode: '',
    // Shipping address (same as billing for now)
    sameAddress: true,
    shippingFirstLine: '',
    shippingSecondLine: '',
    shippingMunicipality: '',
    shippingCity: '',
    shippingPostalCode: '',
    // Payment
    paymentType: 'WEBPAY',
    billingType: 'INVOICE',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const buildOrderPojo = (): OrderPojo => {
    if (!cart) throw new Error('Cart is empty');

    const details: OrderDetailPojo[] = cart.lines.map((line) => ({
      units: line.quantity,
      unitValue: Math.round(Number(line.cost.totalAmount.amount) / line.quantity),
      product: {
        barcode: line.merchandise.id,
        name: line.merchandise.product.title,
        price: Math.round(Number(line.cost.totalAmount.amount) / line.quantity),
        images: [],
      },
    }));

    const totalAmount = Math.round(Number(cart.cost.totalAmount.amount));
    const taxAmount = Math.round(Number(cart.cost.totalTaxAmount.amount));

    return {
      details,
      paymentType: form.paymentType,
      billingType: form.billingType,
      netValue: totalAmount - taxAmount,
      taxValue: taxAmount,
      transportValue: 0,
      totalValue: totalAmount,
      totalItems: cart.totalQuantity,
      customer: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        idNumber: '',
        phone1: form.phone1,
      },
      billingAddress: {
        firstLine: form.billingFirstLine,
        secondLine: form.billingSecondLine || undefined,
        municipality: form.billingMunicipality,
        city: form.billingCity,
        postalCode: form.billingPostalCode || undefined,
      },
      shippingAddress: form.sameAddress
        ? undefined
        : {
            firstLine: form.shippingFirstLine,
            secondLine: form.shippingSecondLine || undefined,
            municipality: form.shippingMunicipality,
            city: form.shippingCity,
            postalCode: form.shippingPostalCode || undefined,
          },
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!cart || cart.lines.length === 0) {
      setLocalError('Giỏ hàng trống.');
      return;
    }

    try {
      const order = buildOrderPojo();
      const result = await initiate(order) as unknown as PaymentRedirectionDetailsPojo | undefined;

      if (result?.url) {
        // Redirect to Webpay or payment gateway
        window.location.href = result.url;
      } else {
        // Cash/transfer — show success directly
        toast.success('Đơn hàng đã được tạo thành công!');
        router.push(paths.checkout.confirmation);
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      setLocalError(msg);
    }
  };

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-lg text-neutral-500">Giỏ hàng trống.</p>
        <Link href={paths.home} className="mt-4 inline-block text-sm underline">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
        Thanh toán
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
          {localError && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {localError}
            </div>
          )}

          {/* Customer info */}
          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">Thông tin khách hàng</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Họ</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} required
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Tên</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} required
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Điện thoại</label>
                <input name="phone1" type="tel" value={form.phone1} onChange={handleChange} required
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900" />
              </div>
            </div>
          </section>

          {/* Billing address */}
          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">Địa chỉ xuất hóa đơn</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Địa chỉ</label>
                <input name="billingFirstLine" value={form.billingFirstLine} onChange={handleChange} required
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  placeholder="Số nhà, đường" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Quận / Huyện</label>
                <input name="billingMunicipality" value={form.billingMunicipality} onChange={handleChange} required
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Tỉnh / Thành phố</label>
                  <input name="billingCity" value={form.billingCity} onChange={handleChange} required
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Mã bưu điện</label>
                  <input name="billingPostalCode" value={form.billingPostalCode} onChange={handleChange}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900" />
                </div>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">Phương thức thanh toán</h2>
            <div className="mt-4 space-y-3">
              {PAYMENT_TYPES.map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-3 rounded-md border border-neutral-200 p-3 hover:bg-neutral-50">
                  <input type="radio" name="paymentType" value={opt.value}
                    checked={form.paymentType === opt.value} onChange={handleChange}
                    className="h-4 w-4 text-neutral-900" />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>

          <button type="submit" disabled={isInitiating}
            className="w-full rounded-md bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors">
            {isInitiating ? 'Đang xử lý…' : 'Thanh toán ngay'}
          </button>
        </form>

        {/* Right: Order summary */}
        <aside>
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">Đơn hàng của bạn</h2>

            {/* Items */}
            <ul className="mt-4 space-y-4">
              {cart.lines.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200">
                    {item.merchandise.product.featuredImage?.url ? (
                      <Image
                        src={item.merchandise.product.featuredImage.url}
                        alt={item.merchandise.product.title}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{item.merchandise.product.title}</p>
                    <p className="text-neutral-500">x{item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium">
                    <Price
                      amount={item.cost.totalAmount.amount}
                      currencyCode={item.cost.totalAmount.currencyCode}
                    />
                  </div>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <dl className="mt-6 space-y-2 border-t border-neutral-200 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Tạm tính</dt>
                <dd>{formatCurrency(Number(cart.cost.subtotalAmount.amount))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Thuế</dt>
                <dd>{formatCurrency(Number(cart.cost.totalTaxAmount.amount))}</dd>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2 text-base font-semibold">
                <dt>Tổng cộng</dt>
                <dd>{formatCurrency(Number(cart.cost.totalAmount.amount))}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
