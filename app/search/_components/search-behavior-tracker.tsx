"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getOrCreateDeviceId } from "@/lib/device-id";
import { postBehaviorEvent } from "@/services/rest-api/behavior";

/** Logs SEARCH_SUBMIT once per distinct query string on the search page. */
export function SearchBehaviorTracker() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("query") ?? "").trim();
  const postedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!query) return;
    if (postedRef.current === query) return;
    const deviceId = getOrCreateDeviceId();
    if (!deviceId) return;

    postedRef.current = query;
    postBehaviorEvent({
      deviceId,
      eventType: "SEARCH_SUBMIT",
      payload: { query },
    }).catch(() => {});
  }, [query]);

  return null;
}
