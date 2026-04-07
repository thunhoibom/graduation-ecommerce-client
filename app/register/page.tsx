import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/services/rest-api/auth/auth";
import { RegisterForm } from "./_components/register-form";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản mới tại Mono Studio",
};

export default async function RegisterPage() {
  const token = getAuthToken();
  if (token) redirect("/account");

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12 bg-neutral-50 dark:bg-neutral-950">
      <Card className="w-full max-w-md border-border/50 shadow-sm">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-xl font-mono tracking-tight">
            Tạo tài khoản
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tham gia Mono Studio để theo dõi đơn hàng và nhiều hơn nữa
          </p>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}