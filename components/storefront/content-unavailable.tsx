import Link from "next/link";
import {
  ArrowLeft,
  House,
  MagnifyingGlass,
  Package,
  SquaresFour,
  Article,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export type ContentUnavailableKind =
  | "default"
  | "product"
  | "collection"
  | "blog";

const COPY: Record<
  ContentUnavailableKind,
  {
    title: string;
    description: string;
    primaryHref: string;
    primaryLabel: string;
    icon: typeof Package;
  }
> = {
  default: {
    title: "Không tìm thấy nội dung",
    description:
      "Trang này không tồn tại hoặc nội dung tạm thời không khả dụng. Hãy quay về cửa hàng hoặc thử tìm kiếm.",
    primaryHref: "/",
    primaryLabel: "Về trang chủ",
    icon: House,
  },
  product: {
    title: "Không tìm thấy sản phẩm",
    description:
      "Sản phẩm có thể đã ngừng bán, đổi mã hoặc chưa được xuất bản. Bạn có thể xem các sản phẩm khác hoặc tìm kiếm theo tên.",
    primaryHref: "/collections/all",
    primaryLabel: "Xem sản phẩm",
    icon: Package,
  },
  collection: {
    title: "Không tìm thấy bộ sưu tập",
    description:
      "Danh mục này không tồn tại hoặc chưa có sản phẩm. Thử khám phá các bộ sưu tập khác hoặc xem toàn bộ cửa hàng.",
    primaryHref: "/collections",
    primaryLabel: "Xem bộ sưu tập",
    icon: SquaresFour,
  },
  blog: {
    title: "Không tìm thấy bài viết",
    description:
      "Bài viết có thể đã được gỡ hoặc đổi đường dẫn. Xem các bài khác trên blog hoặc quay về trang chủ.",
    primaryHref: "/blog",
    primaryLabel: "Về blog",
    icon: Article,
  },
};

interface ContentUnavailableProps {
  kind?: ContentUnavailableKind;
}

export function ContentUnavailable({ kind = "default" }: ContentUnavailableProps) {
  const { title, description, primaryHref, primaryLabel, icon: Icon } = COPY[kind];

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
        <Icon className="size-8" aria-hidden />
      </div>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
        Mono Studio
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white md:text-3xl">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
        {description}
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <Link href={primaryHref}>
            <ArrowLeft className="size-4" aria-hidden />
            {primaryLabel}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/search">
            <MagnifyingGlass className="size-4" aria-hidden />
            Tìm kiếm
          </Link>
        </Button>
      </div>
    </div>
  );
}
