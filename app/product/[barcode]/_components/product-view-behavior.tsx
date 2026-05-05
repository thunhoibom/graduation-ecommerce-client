"use client";

import { useEffect, useRef } from "react";
import { getOrCreateDeviceId } from "@/lib/device-id";
import { postBehaviorEvent } from "@/services/rest-api/behavior";

interface Props {
  productId?: number;
  barcode: string;
  categoryCode?: string;
}

export function ProductViewBehavior({ productId, barcode, categoryCode }: Props) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    const deviceId = getOrCreateDeviceId();
    if (!deviceId) return;

    sentRef.current = true;
    postBehaviorEvent({
      deviceId,
      eventType: "PRODUCT_VIEW",
      payload: {
        productId,
        barcode,
        categoryCode,
      },
    }).catch(() => {});
  }, [productId, barcode, categoryCode]);

  return null;
}
