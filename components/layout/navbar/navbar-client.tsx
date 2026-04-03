'use client';

import { useEffect, useState } from 'react';
import CartModal from 'components/cart/modal';
import { Menu } from 'lib/shopify/types';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';
import Search, { SearchSkeleton } from './search';
import { UserNav } from './user-nav';

// Static nav links — replace with backend-driven menu when CMS is ready
const FALLBACK_NAV: Menu[] = [
  { title: 'Trang chủ', path: '/' },
  { title: 'Sản phẩm', path: '/products' },
  { title: 'Giới thiệu', path: '/about' },
];

async function fetchMenu(): Promise<Menu[]> {
  try {
    const res = await fetch('/api/shopify-menu', { cache: 'no-store' });
    if (!res.ok) return FALLBACK_NAV;
    return res.json();
  } catch {
    return FALLBACK_NAV;
  }
}

export function NavbarClient() {
  const [menu, setMenu] = useState<Menu[]>(FALLBACK_NAV);
  const [menuLoaded, setMenuLoaded] = useState(false);

  useEffect(() => {
    fetchMenu()
      .then(setMenu)
      .catch(() => setMenu(FALLBACK_NAV))
      .finally(() => setMenuLoaded(true));
  }, []);

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <span className="text-lg font-bold tracking-widest uppercase">Mono Studio</span>
          </Link>
          <ul className="hidden gap-6 text-sm md:flex md:items-center">
            {menu.map((item: Menu) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  prefetch={true}
                  className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex justify-end md:w-1/3">
          <div className="flex items-center gap-3">
            <UserNav />
            <CartModal />
          </div>
        </div>
      </div>
    </nav>
  );
}
