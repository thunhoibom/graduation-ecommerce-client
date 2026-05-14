import Link from "next/link";
import { Minus, Plus, Ruler } from "@phosphor-icons/react";

interface ProductSizeGuideProps {
  /** Hiển thị khi sản phẩm có ít nhất một biến thể có kích thước */
  visible: boolean;
}

export function ProductSizeGuide({ visible }: ProductSizeGuideProps) {
  if (!visible) return null;

  return (
    <details className="group border-b border-neutral-100 pb-4 dark:border-neutral-900">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-neutral-900 dark:text-white">
        <span className="flex items-center gap-2">
          <Ruler className="size-4 shrink-0 text-neutral-500" aria-hidden />
          Hướng dẫn chọn size
        </span>
        <span className="transition-transform group-open:rotate-180">
          <Plus size={14} className="group-open:hidden" />
          <Minus size={14} className="hidden group-open:block" />
        </span>
      </summary>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        <p>
          Chọn đúng size giúp sản phẩm vừa vặn và thoải mái. Bạn có thể đối chiếu với trang phục
          đang mặc vừa ý nhất (cùng kiểu: áo thun, hoodie, quần dài…) và với bảng tham khảo dưới
          đây.
        </p>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
            Gợi ý nhanh
          </p>
          <ul className="list-inside list-disc space-y-1.5 text-sm">
            <li>
              <strong className="font-medium text-neutral-800 dark:text-neutral-200">
                Đo trực tiếp cơ thể:
              </strong>{" "}
              dùng thước dây ôm sát nhưng không siết; đứng thả lỏng, thở bình thường.
            </li>
            <li>
              <strong className="font-medium text-neutral-800 dark:text-neutral-200">
                Giữa hai size:
              </strong>{" "}
              ưu tiên form ôm vừa → chọn size nhỏ hơn; thích rộng rãi / layer trong → chọn size lớn
              hơn.
            </li>
            <li>
              Vải co giãn (hoặc form oversized) có thể khác với vải cứng — luôn xem mô tả chi tiết
              sản phẩm nếu có.
            </li>
          </ul>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-500">
          Size dạng số (ví dụ giày, phụ kiện) cần đối chiếu bảng quy đổi của từng dòng sản phẩm — ghi
          chú trên trang chi tiết luôn được ưu tiên.
        </p>

        <div className="overflow-x-auto rounded-none border border-neutral-200 dark:border-neutral-800">
          <table className="w-full min-w-[280px] border-collapse text-left text-xs">
            <caption className="border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-left text-[11px] font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
              Bảng tham khảo áo (cm) — mang tính minh họa; số đo thực tế có thể khác theo mẫu cụ thể.
            </caption>
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/40">
                <th scope="col" className="px-3 py-2 font-semibold text-neutral-900 dark:text-white">
                  Size
                </th>
                <th scope="col" className="px-3 py-2 font-semibold text-neutral-900 dark:text-white">
                  Ngực
                </th>
                <th scope="col" className="px-3 py-2 font-semibold text-neutral-900 dark:text-white">
                  Dài áo
                </th>
              </tr>
            </thead>
            <tbody className="text-neutral-700 dark:text-neutral-300">
              {[
                { size: "XS", chest: "88–92", length: "64–66" },
                { size: "S", chest: "92–96", length: "66–68" },
                { size: "M", chest: "96–100", length: "68–70" },
                { size: "L", chest: "100–106", length: "70–73" },
                { size: "XL", chest: "106–112", length: "73–76" },
              ].map((row) => (
                <tr
                  key={row.size}
                  className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/80"
                >
                  <td className="px-3 py-2 font-medium tabular-nums">{row.size}</td>
                  <td className="px-3 py-2 tabular-nums">{row.chest}</td>
                  <td className="px-3 py-2 tabular-nums">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-500">
          Nếu cần tư vấn thêm theo số đo của bạn, hãy liên hệ qua trang{" "}
          <Link
            href="/contact"
            className="font-medium text-neutral-900 underline underline-offset-2 dark:text-white"
          >
            Liên hệ
          </Link>
          .
        </p>
      </div>
    </details>
  );
}
