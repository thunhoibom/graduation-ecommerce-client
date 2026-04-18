"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { User, Check } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { updateProfile } from "@/services/rest-api/auth/auth";
import type { PersonPojo } from "@/types/person";

const profileSchema = z.object({
  firstName: z.string().min(1, "Họ không được để trống"),
  lastName: z.string().min(1, "Tên không được để trống"),
  email: z.string().email("Email không hợp lệ").or(z.literal("")),
  phone1: z.string().optional(),
  phone2: z.string().optional(),
  idNumber: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initial: PersonPojo;
  onUpdate?: (updated: PersonPojo) => void;
}

export function ProfileForm({ initial, onUpdate }: ProfileFormProps) {
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initial.firstName ?? "",
      lastName: initial.lastName ?? "",
      email: initial.email ?? "",
      phone1: initial.phone1 ?? "",
      phone2: initial.phone2 ?? "",
      idNumber: initial.idNumber ?? "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updated = await updateProfile(data);
      reset(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success("Cập nhật hồ sơ thành công");
      onUpdate?.(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể cập nhật hồ sơ";
      toast.error(msg);
    }
  };

  const handleReset = () => {
    reset();
    setSaved(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <User className="size-5 text-neutral-500" />
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
          Thông tin cá nhân
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">Họ *</Label>
          <Input
            id="firstName"
            {...register("firstName")}
            className={cn(errors.firstName && "border-destructive")}
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="lastName">Tên *</Label>
          <Input
            id="lastName"
            {...register("lastName")}
            className={cn(errors.lastName && "border-destructive")}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">{errors.lastName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className={cn(errors.email && "border-destructive")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone1">Số điện thoại</Label>
          <Input
            id="phone1"
            type="tel"
            placeholder="0901234567"
            {...register("phone1")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone2">Số điện thoại 2</Label>
          <Input
            id="phone2"
            type="tel"
            placeholder="0912345678"
            {...register("phone2")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="idNumber">CMND / CCCD</Label>
          <Input
            id="idNumber"
            placeholder="001234567890"
            {...register("idNumber")}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={!isDirty || isSubmitting}
          size="sm"
          className="min-w-[100px]"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border border-white/30 border-t-white" />
              Đang lưu…
            </span>
          ) : saved ? (
            <span className="flex items-center gap-1.5">
              <Check className="size-3.5" />
              Đã lưu
            </span>
          ) : (
            "Lưu thay đổi"
          )}
        </Button>

        {isDirty && !saved && (
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Huỷ
          </button>
        )}
      </div>
    </form>
  );
}
