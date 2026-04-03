'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { paths } from 'src/routes/paths';
import { useLogin } from 'src/core/auth/hooks/use-login';
import { useAuth } from 'src/shared/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const { login: loginTrigger, isLoggingIn, error: loginError } = useLogin();

  const [form, setForm] = useState({ name: '', password: '' });
  const [localError, setLocalError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!form.name.trim() || !form.password) {
      setLocalError('Vui lòng nhập tên đăng nhập và mật khẩu.');
      return;
    }

    try {
      const result = await loginTrigger(form);
      if (result?.token) {
        authLogin(result.token);
        router.push(paths.home);
      }
    } catch {
      // Error shown via loginError
    }
  };

  const errorMsg = loginError || localError;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Mono Studio
          </h1>
          <p className="mt-2 text-sm text-neutral-500">Đăng nhập vào tài khoản của bạn</p>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error banner */}
            {errorMsg && (
              <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            {/* Username */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Tên đăng nhập
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="username"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                placeholder="Nhập tên đăng nhập"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                placeholder="Nhập mật khẩu"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoggingIn ? 'Đang đăng nhập…' : 'Đăng nhập'}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-neutral-500">
            Chưa có tài khoản?{' '}
            <Link
              href={paths.auth.register}
              className="font-medium text-neutral-900 underline hover:text-neutral-700"
            >
              Đăng ký ngay
            </Link>
          </p>

          {/* Continue as guest */}
          <p className="mt-3 text-center text-xs text-neutral-400">
            Có thể tiếp tục mua sắm{' '}
            <Link href={paths.home} className="underline hover:text-neutral-600">
              không cần đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
