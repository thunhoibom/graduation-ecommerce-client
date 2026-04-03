'use client';

import Link from 'next/link';
import { useAuth } from 'src/shared/hooks/use-auth';
import { paths } from 'src/routes/paths';

export function UserNav() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Link
        href={paths.auth.login}
        className="text-sm text-neutral-500 underline-offset-4 hover:text-black hover:underline"
      >
        Đăng nhập
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href={paths.account.orders}
        className="text-sm text-neutral-500 underline-offset-4 hover:text-black hover:underline"
      >
        Đơn hàng
      </Link>
      <span className="text-xs text-neutral-400">
        {user?.profile?.firstName
          ? `${user.profile.firstName} ${user.profile.lastName ?? ''}`.trim()
          : 'Tài khoản'}
      </span>
    </div>
  );
}
