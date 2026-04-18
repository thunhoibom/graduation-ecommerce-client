"use client";

import CartModal from "components/cart/modal";
import LogoSquare from "components/logo-square";
import { HEADER_MENU, SITE_NAV } from "config/navigation";
import type { MenuItem } from "@/types/common";
import Link from "next/link";
import { Suspense } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { User, SignOut, ShoppingBag } from "@phosphor-icons/react";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

const SITE_NAME = process.env.SITE_NAME ?? "Mono Studio";

export default function Navbar() {
  const menu: MenuItem[] = HEADER_MENU;
  const { user, isAuthenticated, logout, isLoading } = useAuth();

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
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {SITE_NAME}
            </div>
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: MenuItem) => (
                <li key={item.id}>
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
          ) : null}
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex justify-end md:w-1/3 items-center gap-2">
          <CartModal />
          
          {/* Auth buttons */}
          <Suspense fallback={<div className="w-8 h-8" />}>
            {isLoading ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href={SITE_NAV.account}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User size={16} />
                    <span className="hidden sm:inline">
                      {user?.firstName || user?.lastName ? `${user?.firstName} ${user?.lastName}` : "Tài khoản"}
                    </span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="gap-2"
                >
                  <SignOut size={16} />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={SITE_NAV.login}>
                  <Button variant="ghost" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href={SITE_NAV.register}>
                  <Button size="sm">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
