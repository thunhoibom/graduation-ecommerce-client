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
import { register as registerUser } from "@/services/rest-api/auth/auth";

const registerSchema = z
  .object({
    name: z.string().min(1, "Tên đăng nhập không được để trống"),
    firstName: z.string().min(1, "Họ không được để trống"),
    lastName: z.string().min(1, "Tên không được để trống"),
    email: z
      .string()
      .min(1, "Email không được để trống")
      .email("Email không hợp lệ"),
    idNumber: z.string().min(1, "Số CCCD/CMND không được để trống"),
    phone1: z.string().optional(),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string().min(6, "Xác nhận mật khẩu tối thiểu 6 ký tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true);
    try {
      await registerUser({
        name: data.name,
        password: data.password,
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          idNumber: data.idNumber,
          phone1: data.phone1,
        },
      });

      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      window.location.href = "/login";
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } }; message?: string })
          ?.response?.data?.message ??
        (err as Error)?.message ??
        "Đăng ký thất bại. Vui lòng thử lại.";
      setError("root", { message: msg });
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Root error */}
      {errors.root && (
        <div className="rounded-md border border-destructive/50 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {errors.root.message}
        </div>
      )}

      {/* Name (login) */}
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

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">Họ</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Nguyễn"
            autoComplete="given-name"
            {...register("firstName")}
            className={cn(errors.firstName && "border-destructive")}
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="lastName">Tên</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Văn A"
            autoComplete="family-name"
            {...register("lastName")}
            className={cn(errors.lastName && "border-destructive")}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          {...register("email")}
          className={cn(errors.email && "border-destructive")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* ID Number */}
      <div className="space-y-1.5">
        <Label htmlFor="idNumber">Số CCCD / CMND</Label>
        <Input
          id="idNumber"
          type="text"
          placeholder="012345678901"
          autoComplete="off"
          {...register("idNumber")}
          className={cn(errors.idNumber && "border-destructive")}
        />
        {errors.idNumber && (
          <p className="text-xs text-destructive">{errors.idNumber.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="phone1">
          Số điện thoại{" "}
          <span className="text-muted-foreground font-normal">(tuỳ chọn)</span>
        </Label>
        <Input
          id="phone1"
          type="tel"
          placeholder="09xxxxxxxx"
          autoComplete="tel"
          {...register("phone1")}
          className={cn(errors.phone1 && "border-destructive")}
        />
        {errors.phone1 && (
          <p className="text-xs text-destructive">{errors.phone1.message}</p>
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
            autoComplete="new-password"
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

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="new-password"
          {...register("confirmPassword")}
          className={cn(errors.confirmPassword && "border-destructive")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms */}
      <p className="text-xs text-muted-foreground">
        Bằng việc đăng ký, bạn đồng ý với{" "}
        <Link href="/policies/terms" className="underline underline-offset-2">
          Điều khoản dịch vụ
        </Link>{" "}
        và{" "}
        <Link href="/policies/privacy" className="underline underline-offset-2">
          Chính sách bảo mật
        </Link>{" "}
        của Mono Studio.
      </p>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <SpinnerGap className="size-4 animate-spin" />
            <span>Đang đăng ký...</span>
          </>
        ) : (
          "Tạo tài khoản"
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

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="font-medium underline-offset-4 hover:underline hover:text-foreground transition-colors"
        >
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}