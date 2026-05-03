"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { setAuthToken } from "@/services/rest-api/app-api";
import { useAuth } from "@/hooks/use-auth";

export default function GoogleAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const completeLogin = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");
      const redirectPath = searchParams.get("redirect") || "/account";

      if (error) {
        toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
        router.replace(`/login?error=${encodeURIComponent(error)}`);
        return;
      }

      if (!token) {
        toast.error("Không nhận được token đăng nhập từ Google.");
        router.replace("/login?error=missing_token");
        return;
      }

      setAuthToken(token);
      try {
        await refreshUser();
        toast.success("Đăng nhập Google thành công!");
        router.replace(redirectPath);
      } catch {
        toast.error("Không thể tải thông tin tài khoản.");
        router.replace("/login?error=profile_load_failed");
      }
    };

    completeLogin();
  }, [refreshUser, router, searchParams]);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <p className="text-sm text-muted-foreground">Đang hoàn tất đăng nhập Google...</p>
    </div>
  );
}
