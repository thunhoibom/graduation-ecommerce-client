"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { addItem } from "components/cart/actions";
import type { Product, ProductVariant } from "@/types/product";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useCart } from "./cart-context";

function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-full bg-black p-4 tracking-wide text-white";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Hết hàng
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Vui lòng chọn phân loại"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Thêm vào giỏ
      </button>
    );
  }

  return (
    <button
      aria-label="Thêm vào giỏ hàng"
      className={clsx(buttonClasses, {
        "hover:opacity-90": true,
      })}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Thêm vào giỏ
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? String(variants[0]?.id) : undefined;
  const selectedVariantId = variant?.id ? String(variant.id) : defaultVariantId;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => String(variant.id) === selectedVariantId,
  );

  return (
    <form
      action={async () => {
        if (finalVariant && selectedVariantId) {
          addCartItem(finalVariant, product);
          addItemAction();
        }
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
