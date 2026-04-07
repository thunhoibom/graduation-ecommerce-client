import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/services/rest-api/auth/auth";
import type { Metadata } from "next";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào tài khoản Mono Studio",
};

export default async function LoginPage() {
  // Redirect if already logged in
  const token = getAuthToken();
  if (token) {
    redirect("/account");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12 bg-neutral-50 dark:bg-neutral-950">
      <Card className="w-full max-w-md border-border/50 shadow-sm">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-xl font-mono tracking-tight">
            Đăng nhập
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Chào mừng bạn quay trở lại Mono Studio
          </p>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}