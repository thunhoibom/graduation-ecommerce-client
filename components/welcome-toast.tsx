"use client";

import { useEffect } from "react";
import { toast } from "sonner";

const SITE_NAME = process.env.SITE_NAME ?? "Mono Studio";

export function WelcomeToast() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerHeight < 650) return;
    if (!document.cookie.includes("welcome-toast=2")) {
      toast(`Chào mừng đến với ${SITE_NAME}!`, {
        id: "welcome-toast",
        duration: Infinity,
        onDismiss: () => {
          document.cookie = "welcome-toast=2; max-age=31536000; path=/";
        },
      });
    }
  }, []);

  return null;
}
