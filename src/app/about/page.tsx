'use client';

import { useGetCategoryList } from 'src/core/categories/hooks/use-get-category-list';
import Link from 'next/link';
import { paths } from 'src/routes/paths';

export default function AboutPage() {
  const { list: categories } = useGetCategoryList();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Brand header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
          Mono Studio
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Thương hiệu thời trang Việt Nam — thiết kế tối giản, chất lượng bền vững.
        </p>
      </div>

      {/* Mission */}
      <div className="mt-12 rounded-xl border border-neutral-200 bg-white p-8">
        <h2 className="text-xl font-semibold text-neutral-900">Về chúng tôi</h2>
        <p className="mt-4 leading-relaxed text-neutral-600">
          Mono Studio ra đời với triết lý "Less is More" — tối giản trong thiết kế,
          tối đa trong chất lượng. Mỗi sản phẩm đều được chọn lọc kỹ lưỡng từ chất liệu
          đến hoàn thiện, mang đến sự thoải mái và phong cách cho người mặc.
        </p>
      </div>

      {/* Categories */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-neutral-900">Danh mục sản phẩm</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.code}
              href={paths.collections.detail(cat.code)}
              className="rounded-lg border border-neutral-200 p-4 text-center text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="mt-12 rounded-xl border border-neutral-200 bg-white p-8">
        <h2 className="text-xl font-semibold text-neutral-900">Liên hệ</h2>
        <div className="mt-4 space-y-2 text-sm text-neutral-600">
          <p>📍 Hồ Chí Minh, Việt Nam</p>
          <p>📞 0xxx xxx xxx</p>
          <p>✉️ contact@monostudio.vn</p>
        </div>
      </div>
    </div>
  );
}
