import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính sách vận chuyển — Mono Studio",
  description: "Phạm vi giao hàng và ưu đãi phí vận chuyển tại Mono Studio.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Trợ giúp
      </p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-neutral-900 dark:text-white">
        Chính sách vận chuyển
      </h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        <p>
          Đơn hàng được xử lý và bàn giao đơn vị vận chuyển trong thời gian làm việc. Thời gian nhận
          hàng phụ thuộc khu vực và đối tác giao nhận.
        </p>
        <p>
          Miễn phí vận chuyển cho đơn từ{" "}
          <strong className="text-neutral-900 dark:text-neutral-200">500.000₫</strong> trở lên (áp
          dụng nội địa, có thể điều chỉnh theo chương trình — vui lòng xem tại bước thanh toán).
        </p>
        <p className="text-xs text-neutral-500">
          Nội dung mang tính tham khảo. Phí ship và thời gian giao hiển thị trên đơn hàng là căn cứ
          cuối cùng.
        </p>
      </div>
      <p className="mt-10">
        <Link
          href="/help/return-policy"
          className="text-sm font-medium text-neutral-900 underline underline-offset-4 dark:text-white"
        >
          Xem chính sách trả hàng
        </Link>
      </p>
    </div>
  );
}
