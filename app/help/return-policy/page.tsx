import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính sách đổi trả — Mono Studio",
  description: "Điều kiện và thời gian đổi trả hàng tại Mono Studio.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Trợ giúp
      </p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-neutral-900 dark:text-white">
        Chính sách đổi trả
      </h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        <p>
          Chúng tôi chấp nhận đổi / trả sản phẩm trong vòng{" "}
          <strong className="text-neutral-900 dark:text-neutral-200">15 ngày</strong> kể từ ngày
          nhận hàng, với điều kiện sản phẩm còn nguyên tem, chưa qua sử dụng và kèm hóa đơn / bằng chứng
          mua hàng.
        </p>
        <p>
          Sản phẩm lỗi do nhà sản xuất hoặc giao nhầm sẽ được hoàn / đổi miễn phí. Chi phí vận chuyển
          đổi trả áp dụng theo từng trường hợp và sẽ được thông báo rõ trước khi xử lý.
        </p>
        <p className="text-xs text-neutral-500">
          Nội dung mang tính tham khảo. Chi tiết cuối cùng theo xác nhận từ bộ phận chăm sóc khách hàng
          tại thời điểm mua hàng.
        </p>
      </div>
      <p className="mt-10">
        <Link
          href="/help/shipping"
          className="text-sm font-medium text-neutral-900 underline underline-offset-4 dark:text-white"
        >
          Xem chính sách vận chuyển
        </Link>
      </p>
    </div>
  );
}
