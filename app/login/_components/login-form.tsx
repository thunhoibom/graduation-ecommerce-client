"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeSlash, SpinnerGap } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { getGoogleLoginUrl, login } from "@/services/rest-api/auth/auth";

const loginSchema = z.object({
  name: z.string().min(1, "Tên đăng nhập không được để trống"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      const res = await login(data);

      if (res?.message && !res?.token) {
        setError("root", { message: res.message });
        toast.error(res.message);
        return;
      }

      await refreshUser();
      toast.success("Đăng nhập thành công!");
      window.location.href = "/account";
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } }; message?: string })
          ?.response?.data?.message ??
        (err as Error)?.message ??
        "Đăng nhập thất bại";
      setError("root", { message: msg });
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  function onGoogleSignIn() {
    setIsGoogleLoading(true);
    const currentUrl = new URL(window.location.href);
    const redirectTarget = currentUrl.searchParams.get("redirect") || "/account";
    window.location.href = getGoogleLoginUrl(redirectTarget);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Root error */}
      {errors.root && (
        <div className="rounded-md border border-destructive/50 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {errors.root.message}
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">Tên đăng nhập</Label>
        <Input
          id="name"
          type="text"
          placeholder="username"
          autoComplete="username"
          {...register("name")}
          className={cn(errors.name && "border-destructive")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="password">Mật khẩu</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
            className={cn(errors.password && "border-destructive", "pr-10")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? (
              <EyeSlash className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Forgot password */}
      <div className="text-right">
        <Link
          href="/forgot-password"
          className="text-xs text-muted-foreground underline-offset-4 hover:underline hover:text-foreground transition-colors"
        >
          Quên mật khẩu?
        </Link>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <SpinnerGap className="size-4 animate-spin" />
            <span>Đang đăng nhập...</span>
          </>
        ) : (
          "Đăng nhập"
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onGoogleSignIn}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <>
            <SpinnerGap className="size-4 animate-spin" />
            <span>Đang chuyển đến Google...</span>
          </>
        ) : (
          "Tiếp tục với Google"
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">hoặc</span>
        </div>
      </div>

      {/* Register link */}
      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="font-medium underline-offset-4 hover:underline hover:text-foreground transition-colors"
        >
          Đăng ký ngay
        </Link>
      </p>
    </form>
  );
}