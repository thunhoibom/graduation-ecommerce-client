"use client";

const FAQ_ITEMS = [
  {
    q: "Làm sao để chọn đúng size?",
    a: "Tham khảo bảng size trên từng trang sản phẩm. Nếu vẫn phân vân, hãy liên hệ hỗ trợ hoặc đặt hai size để đổi trả trong 7 ngày theo chính sách.",
  },
  {
    q: "Tôi có được đổi hoặc trả hàng không?",
    a: "Áp dụng đổi/trả trong 7 ngày với sản phẩm còn nguyên tem mác và chưa qua sử dụng. Chi tiết xem mục chính sách trên website.",
  },
  {
    q: "Thời gian giao hàng dự kiến?",
    a: "Đơn nội thành thường 1–3 ngày làm việc; đơn liên tỉnh 3–5 ngày tùy khu vực. Bạn sẽ nhận mã vận đơn để theo dõi.",
  },
  {
    q: "Sản phẩm có được giặt máy không?",
    a: "Tuỳ chất liệu — luôn làm theo nhãn hướng dẫn trên tag sản phẩm. Phần lớn áo cotton có thể giặt máy ở chế độ nhẹ.",
  },
];

export function CollectionFaq() {
  return (
    <section className="mt-12 border border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-900/30 md:p-8">
      <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
        Câu hỏi thường gặp
      </h2>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Thông tin tham khảo — có thể khác theo từng mặt hàng.
      </p>
      <ul className="mt-6 space-y-2">
        {FAQ_ITEMS.map((item) => (
          <li
            key={item.q}
            className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
          >
            <details className="group">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-neutral-900 outline-none marker:hidden dark:text-white [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  {item.q}
                  <span className="text-neutral-400 transition group-open:rotate-180">▼</span>
                </span>
              </summary>
              <div className="border-t border-neutral-100 px-4 py-3 text-sm leading-relaxed text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
                {item.a}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
