'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { paths } from 'src/routes/paths';
import { useGetProductDetail } from 'src/core/products/hooks/use-get-product-detail';
import { formatCurrency } from 'src/shared/utils/format-currency';
import { AddToCartButton } from 'src/app/(shop)/products/[id]/_components/add-to-cart-button';
import { ImageGallery } from 'src/app/(shop)/products/[id]/_components/image-gallery';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: product, isLoading } = useGetProductDetail(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-square rounded-md bg-neutral-200" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-neutral-200" />
              <div className="h-6 w-1/4 rounded bg-neutral-200" />
              <div className="h-24 w-full rounded bg-neutral-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const images = product.images ?? [];
  const primaryImage = images[0];
  const hasStock = (product.currentStock ?? 0) > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
        <Link href={paths.home} className="hover:text-neutral-900">Trang chủ</Link>
        <span>/</span>
        <Link href={paths.products.root} className="hover:text-neutral-900">Sản phẩm</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={paths.collections.detail(product.category.code)}
              className="hover:text-neutral-900"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-neutral-900">{product.name}</span>
      </nav>

      {/* Product layout */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <ImageGallery images={images} productName={product.name} primaryImage={primaryImage} />

        {/* Info */}
        <div className="flex flex-col">
          {product.category && (
            <p className="text-sm uppercase tracking-wide text-neutral-400">
              {product.category.name}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">Mã: {product.barcode}</p>

          {/* Price */}
          <div className="mt-6">
            <p className="text-3xl font-bold text-neutral-900">
              {formatCurrency(product.price)}
            </p>
          </div>

          {/* Stock */}
          <div className="mt-4">
            {hasStock ? (
              <span className="inline-flex items-center gap-1 text-sm text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Còn hàng ({product.currentStock})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm text-red-500">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Hết hàng
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-700">
                Mô tả
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-neutral-600">
                {product.description}
              </p>
            </div>
          )}

          {/* Add to cart */}
          <div className="mt-8">
            <AddToCartButton product={product} disabled={!hasStock} />
          </div>
        </div>
      </div>
    </div>
  );
}
