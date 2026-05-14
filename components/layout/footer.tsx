import Link from "next/link";
import LogoSquare from "components/logo-square";
import { SocialIcons, FooterSection, FooterLink } from "components/layout/footer-menu";

const SITE_NAME = process.env.SITE_NAME ?? "Mono Studio";
const currentYear = new Date().getFullYear();

const SECTIONS = [
  {
    title: "Hỗ trợ",
    children: [
      { id: 101, title: "Hướng dẫn mua hàng", path: "/help/shopping-guide" },
      { id: 102, title: "Chính sách trả hàng", path: "/help/return-policy" },
      { id: 103, title: "Chính sách vận chuyển", path: "/help/shipping" },
      { id: 104, title: "Câu hỏi thường gặp", path: "/help/faq" },
    ],
  },
  {
    title: "Công ty",
    children: [
      { id: 111, title: "Giới thiệu", path: "/about" },
      { id: 112, title: "Tuyển dụng", path: "/careers" },
      { id: 113, title: "Tin tức", path: "/blog" },
    ],
  },
  {
    title: "Kết nối",
    children: [
      { id: 121, title: "Facebook", path: "https://facebook.com", external: true },
      { id: 122, title: "Instagram", path: "https://instagram.com", external: true },
      { id: 123, title: "TikTok", path: "https://tiktok.com", external: true },
    ],
  },
];

export default async function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        {/* Logo + Sections grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-black dark:text-white"
            >
              <LogoSquare size="sm" />
              <span className="text-sm font-medium uppercase tracking-wide">
                {SITE_NAME}
              </span>
            </Link>
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed">
              Thời trang tối giản dành cho những ai yêu thích sự tinh tế và chất lượng.
            </p>
            <div className="mt-4">
              <SocialIcons />
            </div>
          </div>

          {/* Link sections */}
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <FooterSection title={section.title}>
                {section.children.map((item) => (
                  <FooterLink key={item.id} item={item} />
                ))}
              </FooterSection>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              &copy; {currentYear} {SITE_NAME}. Mọi quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              >
                Chính sách bảo mật
              </Link>
              <Link
                href="/terms"
                className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              >
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}