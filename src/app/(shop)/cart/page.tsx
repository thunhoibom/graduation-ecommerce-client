'use client';

import Image from 'next/image';
import Link from 'next/link';
import { paths } from 'src/routes/paths';
import { useCart } from 'components/cart/cart-context';
import { DeleteItemButton } from 'components/cart/delete-item-button';
import { EditItemQuantityButton } from 'components/cart/edit-item-quantity-button';
import Price from 'components/price';

export default function CartPage() {
  const { cart, updateCartItem } = useCart();

  const isEmpty = !cart || cart.lines.length === 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
        Giỏ hàng
      </h1>

      {isEmpty ? (
        <div className="mt-12 text-center">
          <p className="text-lg text-neutral-500">Giỏ hàng của bạn đang trống.</p>
          <Link
            href={paths.home}
            className="mt-4 inline-block text-sm font-medium text-neutral-900 underline hover:text-neutral-600"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          {/* Line items */}
          <ul className="divide-y divide-neutral-200 border-b border-t border-neutral-200">
            {cart.lines.map((item, i) => (
              <li key={i} className="flex py-6">
                {/* Image */}
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200">
                  {item.merchandise.product.featuredImage?.url ? (
                    <Image
                      src={item.merchandise.product.featuredImage.url}
                      alt={item.merchandise.product.title}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-neutral-100 text-neutral-400">
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div className="flex justify-between pr-6 sm:grid sm:grid-cols-3">
                    <div>
                      <h3 className="text-sm font-medium">
                        <Link
                          href={`/product/${item.merchandise.product.handle}`}
                          className="hover:text-neutral-600"
                        >
                          {item.merchandise.product.title}
                        </Link>
                      </h3>
                      {item.merchandise.title !== 'Default' && (
                        <p className="mt-1 text-xs text-neutral-500">
                          {item.merchandise.title}
                        </p>
                      )}
                    </div>
                    <Price
                      className="text-right font-medium"
                      amount={item.cost.totalAmount.amount}
                      currencyCode={item.cost.totalAmount.currencyCode}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex h-9 items-center rounded-full border border-neutral-200">
                      <EditItemQuantityButton
                        item={item}
                        type="minus"
                        optimisticUpdate={updateCartItem}
                      />
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <EditItemQuantityButton
                        item={item}
                        type="plus"
                        optimisticUpdate={updateCartItem}
                      />
                    </div>
                    <DeleteItemButton
                      item={item}
                      optimisticUpdate={updateCartItem}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Summary */}
          <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-6">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Tạm tính</dt>
                <dd>
                  <Price
                    amount={cart.cost.subtotalAmount.amount}
                    currencyCode={cart.cost.subtotalAmount.currencyCode}
                  />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Thuế</dt>
                <dd>
                  <Price
                    amount={cart.cost.totalTaxAmount.amount}
                    currencyCode={cart.cost.totalTaxAmount.currencyCode}
                  />
                </dd>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-medium">
                <dt>Tổng cộng</dt>
                <dd>
                  <Price
                    amount={cart.cost.totalAmount.amount}
                    currencyCode={cart.cost.totalAmount.currencyCode}
                  />
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <Link
                href={paths.checkout.root}
                className="block w-full rounded-md bg-neutral-900 py-3 text-center text-sm font-medium text-white hover:bg-neutral-800"
              >
                Tiến hành thanh toán
              </Link>
              <Link
                href={paths.home}
                className="mt-3 block text-center text-sm text-neutral-500 underline hover:text-neutral-700"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
