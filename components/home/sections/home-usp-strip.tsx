/**
 * Homepage trust / value props — Server Component (static copy).
 */

function IconTruck() {
  return (
    <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17h6M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM13 17V6H4v11h5M13 17h2l3-3V9h-3"
      />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 9a8 8 0 0113.657-3.657M20 15a8 8 0 01-13.657 3.657M20 9v4h-4M4 15v-4h4"
      />
    </svg>
  );
}

function IconFabric() {
  return (
    <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3C10 5 6 6 6 10v7a2 2 0 002 2h8a2 2 0 002-2v-7c0-4-4-5-6-7zM9 21V12m6 9V12"
      />
    </svg>
  );
}

const items = [
  {
    icon: IconTruck,
    title: "Giao hàng nhanh",
    body: "Đối tác vận chuyển uy tín, theo dõi đơn minh bạch.",
  },
  {
    icon: IconRefresh,
    title: "Đổi trả trong 7 ngày",
    body: "Hỗ trợ đổi size / trả hàng theo chính sách rõ ràng.",
  },
  {
    icon: IconFabric,
    title: "Chất liệu & phom dáng",
    body: "Tuyển chọn form tối giản, bền mặc và dễ phối hằng ngày.",
  },
] as const;

export function HomeUspStrip() {
  return (
    <section
      className="border-y border-neutral-200/90 bg-neutral-100/80 py-10 dark:border-neutral-800 dark:bg-neutral-900/50"
      aria-label="Cam kết dịch vụ"
    >
      <div className="section-shell">
        <ul className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {items.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100">
                <Icon />
              </span>
              <div>
                <p className="font-semibold tracking-tight text-neutral-900 dark:text-white">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
