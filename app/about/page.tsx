import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, EnvelopeSimple, InstagramLogo, FacebookLogo, TiktokLogo } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { getAbout } from "@/services/rest-api/about/about";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Về chúng tôi — Mono Studio",
  description:
    "Tìm hiểu câu chuyện của Mono Studio — thương hiệu thời trang tối giản Việt Nam. Chất lượng cao, thiết kế có chủ đích.",
};

export default async function AboutPage() {
  let about: Awaited<ReturnType<typeof getAbout>> | null = null;
  try {
    about = await getAbout();
  } catch {
    about = null;
  }

  const description =
    "Mono Studio là thương hiệu thời trang tối giản đến từ Việt Nam. Chúng tôi tin rằng mỗi người đều xứng đáng được mặc những gì họ thực sự thích — không quá phức tạp, không quá đông đúc, chỉ cần đúng với phong cách riêng.";
  const phone = about?.phone ?? "0901 234 567";
  const email = about?.email ?? "contact@monostudio.vn";
  const address = about?.address ?? "TP. Hồ Chí Minh, Việt Nam";
  const socialLinks = about?.socialLinks ?? {};

  const team = [
    {
      name: "Founder & Creative Director",
      role: "Người sáng lập",
      desc: "Kiến trúc sư thời trang với 10+ năm kinh nghiệm trong ngành.",
    },
    {
      name: "Head of Design",
      role: "Thiết kế",
      desc: "Chịu trách nhiệm biến ý tưởng thành những sản phẩm thực tế.",
    },
    {
      name: "Operations Manager",
      role: "Vận hành",
      desc: "Đảm bảo mọi đơn hàng đến tay bạn đúng hẹn, đúng chất lượng.",
    },
  ];

  const values = [
    {
      title: "Tối giản",
      desc: "Less is more. Chúng tôi loại bỏ những thứ không cần thiết để giữ lại điều quan trọng nhất — chất lượng và sự thoải mái.",
    },
    {
      title: "Bền vững",
      desc: "Mỗi sản phẩm được thiết kế để tồn tại lâu dài, không theo xu hướng nhất thời.",
    },
    {
      title: "Minh bạch",
      desc: "Từ nguồn vải đến quy trình sản xuất — chúng tôi công khai mọi thông tin.",
    },
    {
      title: "Cộng đồng",
      desc: "Khách hàng không phải người mua — họ là một phần của cộng đồng Mono.",
    },
  ];

  return (
    <>
          {/* ── Values ───────────────────────────────────────────── */}
      <section className="bg-neutral-50 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Giá trị cốt lõi
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              4 nguyên tắc định hình mọi quyết định của Mono Studio
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-none border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <h3 className="mb-2 text-base font-semibold text-neutral-900 dark:text-white">
                  {v.title}
                </h3>
                <p className="text-sm text-neutral-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Con người Mono
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Đội ngũ nhỏ, tâm huyết lớn
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-none border border-neutral-200 p-6 dark:border-neutral-800"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                <span className="text-xl font-semibold text-neutral-500 dark:text-neutral-400">
                  {member.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                {member.name}
              </h3>
              <p className="mt-0.5 text-xs text-neutral-400">{member.role}</p>
              <p className="mt-3 text-sm text-neutral-500">{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <section className="bg-neutral-50 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                Liên hệ
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                Bạn có câu hỏi hoặc muốn hợp tác? Hãy liên hệ với chúng tôi.
              </p>
              <div className="mt-6 space-y-4">
                {address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-neutral-400" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        Địa chỉ
                      </p>
                      <p className="text-sm text-neutral-500">{address}</p>
                    </div>
                  </div>
                )}
                {phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 size-5 shrink-0 text-neutral-400" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        Điện thoại
                      </p>
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>
                )}
                {email && (
                  <div className="flex items-start gap-3">
                    <EnvelopeSimple className="mt-0.5 size-5 shrink-0 text-neutral-400" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        Email
                      </p>
                      <a
                        href={`mailto:${email}`}
                        className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        {email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Social links */}
              {(socialLinks?.facebook || socialLinks?.instagram || socialLinks?.tiktok) && (
                <div className="mt-6 flex items-center gap-3">
                  {socialLinks?.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="flex h-9 w-9 items-center justify-center rounded-none border border-neutral-200 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:hover:border-white dark:hover:text-white transition-colors"
                    >
                      <FacebookLogo className="size-4" />
                    </a>
                  )}
                  {socialLinks?.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="flex h-9 w-9 items-center justify-center rounded-none border border-neutral-200 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:hover:border-white dark:hover:text-white transition-colors"
                    >
                      <InstagramLogo className="size-4" />
                    </a>
                  )}
                  {socialLinks?.tiktok && (
                    <a
                      href={socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="TikTok"
                      className="flex h-9 w-9 items-center justify-center rounded-none border border-neutral-200 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:hover:border-white dark:hover:text-white transition-colors"
                    >
                      <TiktokLogo className="size-4" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex flex-col items-start justify-center">
              <div className="rounded-none border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Bắt đầu mua sắm
                </h3>
                <p className="mt-2 text-sm text-neutral-500">
                  Khám phá bộ sưu tập mới nhất của Mono Studio — chất lượng cao, thiết kế tối giản.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/collections/all">
                    <Button size="lg" className="w-full rounded-none">
                      Xem sản phẩm
                    </Button>
                  </Link>
                  <Link href="/collections/all">
                    <Button variant="outline" size="lg" className="w-full rounded-none">
                      Bộ sưu tập
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
