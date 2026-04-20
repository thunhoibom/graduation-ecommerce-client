import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, EnvelopeSimple, InstagramLogo, FacebookLogo, TiktokLogo, Clock } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { ContactForm } from "./_components/contact-form";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Liên hệ — Mono Studio",
  description:
    "Liên hệ Mono Studio để được tư vấn, hợp tác hoặc đặt hàng. Chúng tôi luôn sẵn sàng hỗ trợ bạn.",
};

export default function ContactPage() {
  const storeInfo = {
    name: "Mono Studio",
    address: "123 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh, Việt Nam",
    phone: "0901 234 567",
    email: "contact@monostudio.vn",
    hours: [
      { days: "Thứ Hai — Thứ Sáu", time: "09:00 — 20:00" },
      { days: "Thứ Bảy — Chủ Nhật", time: "10:00 — 18:00" },
    ],
    social: {
      facebook: "https://facebook.com/monostudio.vn",
      instagram: "https://instagram.com/monostudio.vn",
      tiktok: "https://tiktok.com/@monostudio.vn",
    },
  };

  return (
    <>
      {/* Page header */}
      <div className="bg-neutral-50 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center lg:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white lg:text-4xl">
            Liên hệ
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-500">
            Bạn có câu hỏi, muốn tư vấn sản phẩm hoặc hợp tác cùng Mono Studio? Hãy liên hệ với chúng tôi.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="mx-auto max-w-7xl px-4 pb-0 text-xs text-neutral-500 lg:px-6">
        <div className="flex items-center gap-1.5">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-white">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white">Liên hệ</span>
        </div>
      </nav>

      {/* ── Main content: 2-column ──────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">

          {/* Left column: contact form (3/5) */}
          <div className="lg:col-span-3">
            <h2 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-white">
              Gửi tin nhắn
            </h2>
            <ContactForm />

            {/* Success / info note */}
            <p className="mt-4 text-xs text-neutral-400">
              Chúng tôi thường phản hồi trong vòng 24 giờ vào ngày làm việc.
            </p>
          </div>

          {/* Right column: store info (2/5) */}
          <div className="lg:col-span-2">
            <div className="space-y-8">

              {/* Store address & contact */}
              <div className="rounded-none border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="mb-5 text-sm font-semibold text-neutral-900 dark:text-white">
                  Thông tin cửa hàng
                </h3>

                <div className="space-y-5">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-red-500" />
                    <div>
                      <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">
                        Địa chỉ
                      </p>
                      <p className="mt-0.5 text-sm text-neutral-700 dark:text-neutral-300">
                        {storeInfo.address}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 size-5 shrink-0 text-red-500" />
                    <div>
                      <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">
                        Điện thoại
                      </p>
                      <a
                        href={`tel:${storeInfo.phone.replace(/\s/g, "")}`}
                        className="mt-0.5 block text-sm text-neutral-700 hover:text-red-600 dark:text-neutral-300 dark:hover:text-red-400 transition-colors"
                      >
                        {storeInfo.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <EnvelopeSimple className="mt-0.5 size-5 shrink-0 text-red-500" />
                    <div>
                      <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">
                        Email
                      </p>
                      <a
                        href={`mailto:${storeInfo.email}`}
                        className="mt-0.5 block text-sm text-neutral-700 hover:text-red-600 dark:text-neutral-300 dark:hover:text-red-400 transition-colors"
                      >
                        {storeInfo.email}
                      </a>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-5 shrink-0 text-red-500" />
                    <div>
                      <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">
                        Giờ mở cửa
                      </p>
                      <div className="mt-1 space-y-1">
                        {storeInfo.hours.map((h) => (
                          <p key={h.days} className="text-sm text-neutral-700 dark:text-neutral-300">
                            <span className="text-neutral-500">{h.days}:</span>{" "}
                            <span className="font-medium">{h.time}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social links */}
                <div className="mt-6 flex items-center gap-3 border-t border-neutral-100 pt-5 dark:border-neutral-800">
                  {storeInfo.social.facebook && (
                    <a
                      href={storeInfo.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="flex h-9 w-9 items-center justify-center rounded-none border border-neutral-200 text-neutral-500 hover:border-red-500 hover:text-red-500 dark:border-neutral-700 dark:hover:border-red-400 dark:hover:text-red-400 transition-colors"
                    >
                      <FacebookLogo className="size-4" />
                    </a>
                  )}
                  {storeInfo.social.instagram && (
                    <a
                      href={storeInfo.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="flex h-9 w-9 items-center justify-center rounded-none border border-neutral-200 text-neutral-500 hover:border-red-500 hover:text-red-500 dark:border-neutral-700 dark:hover:border-red-400 dark:hover:text-red-400 transition-colors"
                    >
                      <InstagramLogo className="size-4" />
                    </a>
                  )}
                  {storeInfo.social.tiktok && (
                    <a
                      href={storeInfo.social.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="TikTok"
                      className="flex h-9 w-9 items-center justify-center rounded-none border border-neutral-200 text-neutral-500 hover:border-red-500 hover:text-red-500 dark:border-neutral-700 dark:hover:border-red-400 dark:hover:text-red-400 transition-colors"
                    >
                      <TiktokLogo className="size-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="rounded-none border border-neutral-200 bg-neutral-50 overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
                <div className="relative flex aspect-[4/3] w-full items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 size-8 text-neutral-400 dark:text-neutral-600" />
                    <p className="text-xs text-neutral-400 dark:text-neutral-600">
                      {storeInfo.address}
                    </p>
                    <p className="mt-1 text-xs text-neutral-300 dark:text-neutral-700">
                      Bản đồ sẽ được cập nhật
                    </p>
                  </div>
                  {/* Decorative grid overlay */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #d4d4d4 1px, transparent 1px), linear-gradient(to bottom, #d4d4d4 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
