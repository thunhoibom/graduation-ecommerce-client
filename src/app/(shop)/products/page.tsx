'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { paths } from 'src/routes/paths';
import { useGetProductList } from 'src/core/products/hooks/use-get-product-list';
import { useGetCategoryList } from 'src/core/categories/hooks/use-get-category-list';
import { formatCurrency } from 'src/shared/utils/format-currency';

export default function ProductsPage() {
  const [keyword, setKeyword] = useState('');
  const [categoryCode, setCategoryCode] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;

  const { list, total, isLoading } = useGetProductList({
    page,
    limit,
    keyword: keyword || undefined,
    categoryCode: categoryCode || undefined,
    sort: 'name asc',
  });

  const { list: categories } = useGetCategoryList();

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Sản phẩm
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {total} sản phẩm
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm…"
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
        />
        <select
          value={categoryCode}
          onChange={(e) => { setCategoryCode(e.target.value); setPage(1); }}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat.code} value={cat.code}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square rounded-md bg-neutral-200" />
              <div className="mt-3 h-4 w-3/4 rounded bg-neutral-200" />
              <div className="mt-2 h-4 w-1/2 rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="py-16 text-center text-neutral-500">
          <p>Không tìm thấy sản phẩm nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((product: import('src/services/rest-api/app-api/types').ProductPojo) => {
            const image = product.images?.[0];
            return (
              <Link
                key={product.barcode}
                href={paths.products.detail(product.barcode)}
                className="group block"
              >
                {/* Image */}
                <div className="aspect-square overflow-hidden rounded-md bg-neutral-100">
                  {image?.url ? (
                    <Image
                      src={image.url}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-400">
                      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="mt-3">
                  {product.category && (
                    <p className="text-xs text-neutral-400 uppercase tracking-wide">
                      {product.category.name}
                    </p>
                  )}
                  <h3 className="mt-1 text-sm font-medium text-neutral-900 group-hover:text-neutral-600">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-neutral-100"
          >
            ←
          </button>
          <span className="text-sm text-neutral-500">
            Trang {page} / {totalPages}
          </span>
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
