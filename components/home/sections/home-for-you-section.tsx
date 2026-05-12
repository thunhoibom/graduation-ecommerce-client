"use client";

import { ForYouRail } from "@/components/product/for-you-rail";

/** Homepage — không truyền excludeIds; backend cho phép q rỗng (browse + boost theo deviceId). */
export function HomeForYouSection() {
  return <ForYouRail variant="home" />;
}
