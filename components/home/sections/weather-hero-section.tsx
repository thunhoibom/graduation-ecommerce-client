import Link from "next/link";
import Image from "next/image";
import { getWeatherRecommendations } from "@/services/rest-api/products/products";
import type { ProductSearchItem, WeatherCategoryRecommendation, WeatherContext } from "@/types/product";
import { formatMoney } from "@/lib/utils";

const CONDITION_VI: Record<string, string> = {
  clear: "Trời quang",
  cloudy: "Nhiều mây",
  rain: "Có mưa",
  snow: "Lạnh / tuyết",
  fog: "Sương mù",
};

const TAG_VI: Record<string, string> = {
  clear: "Nắng nhẹ",
  cloudy: "Ít nắng",
  rain: "Ẩm ướt",
  cold: "Rét",
  windy: "Gió / mù",
};

function skyLabel(condition?: string): string {
  if (!condition) return "Ổn định";
  return CONDITION_VI[condition] ?? condition;
}

function tagLabelVi(tag?: string): string {
  if (!tag) return "Đa dụng";
  return TAG_VI[tag] ?? tag;
}

function comfortBand(temp?: number): "hot" | "warm" | "mild" | "cool" {
  if (temp == null) return "warm";
  if (temp >= 31) return "hot";
  if (temp >= 24) return "warm";
  if (temp >= 17) return "mild";
  return "cool";
}

function buildDressingTips(weather?: WeatherContext): string[] {
  const temp = weather?.temperature;
  const condition = weather?.condition ?? "clear";
  const band = comfortBand(temp);
  const tips: string[] = [];

  if (band === "hot") {
    tips.push("Ưu tiên vải thoáng (cotton, linen) và phom rộng vừa đủ để da thở.");
    tips.push("Tông màu sáng hoặc trung tính hấp thụ nhiệt ít hơn khi ra ngoài lâu.");
  } else if (band === "warm") {
    tips.push("Một lớp áo mỏng + quần dài là đủ; có thể mang thêm sơ mi để cởi khi vào máy lạnh.");
    tips.push("Phụ kiện nhẹ (mũ nồi, túi canvas) vừa tiện vừa giữ phong cách tối giản.");
  } else if (band === "mild") {
    tips.push("Nên có áo khoác mỏng, cardigan hoặc hoodie để chủ động khi trời lệch nhiệt.");
    tips.push("Layer 2 lớp dễ điều chỉnh: áo trong ôm + ngoài rộng vừa.");
  } else {
    tips.push("Giữ ấm cổ tay và cổ áo; chọn lớp giữ nhiệt mỏng bên trong để không phình phạm.");
    tips.push("Áo khoác dày vừa hoặc phối nhiều lớp mỏng thường linh hoạt hơn một chiếc quá dày.");
  }

  if (condition === "rain") {
    tips.push("Trời mưa: nên có áo gió chống nước hoặc ô gọn — ưu tiên đế giày bám tốt.");
  } else if (condition === "snow") {
    tips.push("Trời rất lạnh: ưu tiên lớp giữ nhiệt, găng và khăn quàng để tránh hở cổ tay.");
  } else if (condition === "fog") {
    tips.push("Sương mù / ẩm: chất liệu khô nhanh và lớp ngoài dễ nhận diện an toàn hơn khi di chuyển.");
  } else if (condition === "cloudy") {
    tips.push("Nhiều mây: nhiệt có thể thay đổi nhanh — mang theo áo phụ gấp gọn trong túi.");
  } else if (condition === "clear" && band === "hot") {
    tips.push("Trời quang nắng: mũ/nón và kính râm giúp bảo vệ khi đi bộ hoặc xe máy.");
  }

  return tips.slice(0, 4);
}

function buildLeadParagraph(weather?: WeatherContext): string {
  const temp = weather?.temperature;
  const sky = skyLabel(weather?.condition);
  if (temp != null) {
    return `Dựa trên khoảng ${Math.round(temp)}°C và ${sky.toLowerCase()}, chúng tôi ưu tiên những món có tag thời tiết và khoảng nhiệt phù hợp trên từng sản phẩm — để bạn chọn nhanh mà vẫn đúng ngữ cảnh mặc hôm nay.`;
  }
  return "Gợi ý dựa trên thời tiết tại khu vực cửa hàng và metadata từng sản phẩm (tag thời tiết, khoảng nhiệt), giúp bạn lướt nhanh các lựa chọn hợp lý cho cả ngày dài.";
}

export async function WeatherHeroSection() {
  let payload: WeatherCategoryRecommendation | null = null;

  try {
    payload = await getWeatherRecommendations({ limit: 6 });
  } catch {
    return null;
  }

  const items = payload?.items ?? [];
  const weather = payload?.weatherContext;

  if (!items.length) return null;

  const heading =
    payload?.sectionTitle?.trim() ||
    (weather?.temperature != null
      ? `Gợi ý hôm nay (${Math.round(weather.temperature)}°C)`
      : "Gợi ý hôm nay");

  const tagChipLabel = weather?.weatherTag
    ? tagLabelVi(weather.weatherTag)
    : skyLabel(weather?.condition);

  const weatherTone =
    weather?.temperature != null
      ? weather.temperature >= 31
        ? "Nóng"
        : weather.temperature <= 21
          ? "Mát / lạnh"
          : "Dễ chịu"
      : "Theo mùa";

  const tips = buildDressingTips(weather);
  const lead = buildLeadParagraph(weather);
  const tempRounded = weather?.temperature != null ? Math.round(weather.temperature) : null;

  return (
    <section className="border-b border-neutral-200 bg-neutral-100/70 py-10 dark:border-neutral-800 dark:bg-neutral-900/40 md:py-12">
      <div className="section-shell">
        <div className="mb-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_min(100%,280px)] lg:items-start">
          <div>
            <p className="section-subtitle">Theo thời tiết</p>
            <h2 className="section-title mt-1 max-w-2xl">{heading}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {lead}
            </p>

            {payload?.category ? (
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Góc danh mục: {payload.category}
              </p>
            ) : null}

            <ul className="mt-5 max-w-2xl space-y-2.5 border-l-2 border-neutral-300 pl-4 dark:border-neutral-600">
              {tips.map((line) => (
                <li key={line} className="text-sm leading-snug text-neutral-700 dark:text-neutral-200">
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <aside className="flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-950">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                Thời tiết hiện tại
              </p>
              {tempRounded != null ? (
                <p className="mt-2 font-mono text-4xl font-light tabular-nums text-neutral-900 dark:text-white">
                  {tempRounded}
                  <span className="align-top text-lg text-neutral-500 dark:text-neutral-400">°C</span>
                </p>
              ) : (
                <p className="mt-2 text-2xl font-medium text-neutral-800 dark:text-neutral-100">—</p>
              )}
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{skyLabel(weather?.condition)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-xs uppercase tracking-wide text-neutral-800 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100">
                {weatherTone}
              </span>
              <span className="rounded-full border border-neutral-300 px-3 py-1 text-xs uppercase tracking-wide text-neutral-700 dark:border-neutral-600 dark:text-neutral-200">
                {tagChipLabel}
              </span>
            </div>
          </aside>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => (
            <Link
              key={item.barcode}
              href={`/product/${item.barcode}`}
              className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-500"
            >
              <div className="relative aspect-[3/4] bg-neutral-100 dark:bg-neutral-900">
                {item.primaryImageUrl ? (
                  <Image
                    src={item.primaryImageUrl}
                    alt={item.name}
                    fill
                    loading="lazy"
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl font-semibold text-neutral-300 dark:text-neutral-700">
                    {item.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="space-y-1 p-3">
                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {item.categoryName}
                </p>
                <p className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-white">
                  {item.name}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {formatMoney(item.price)}
                  </p>
                  <span className="text-[11px] uppercase tracking-wide text-neutral-500 transition-colors group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-white">
                    Xem
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <Link
            href="/collections/all"
            className="text-sm font-medium text-neutral-600 underline-offset-4 transition-colors hover:text-neutral-900 hover:underline dark:text-neutral-300 dark:hover:text-white"
          >
            Xem thêm
          </Link>
        </div>
      </div>
    </section>
  );
}
