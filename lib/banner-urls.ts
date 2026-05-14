import type { CompanyDetailsPojo } from "@/services/rest-api/about/about";

function normalizeUrl(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseBannerValue(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((item): item is string => typeof item === "string")
        .map(normalizeUrl)
        .filter((item): item is string => item !== null);
    } catch {
      return [];
    }
  }

  return trimmed
    .split(/[\n,]+/)
    .map(normalizeUrl)
    .filter((item): item is string => item !== null);
}

export function resolveBannerUrls(about?: CompanyDetailsPojo | null): string[] {
  const fromList = (about?.bannerImageURLs ?? [])
    .map(normalizeUrl)
    .filter((item): item is string => item !== null);

  if (fromList.length > 0) {
    return [...new Set(fromList)];
  }

  const single = about?.bannerImageURL?.trim();
  if (!single) return [];

  return [...new Set(parseBannerValue(single))];
}
