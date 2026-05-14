"use client";

import LogoSquare from "components/logo-square";
import { HEADER_MENU, SITE_NAV } from "config/navigation";
import type { MenuItem } from "@/types/common";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/components/product/wishlist-context";
import { User, SignOut, Heart } from "@phosphor-icons/react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { getCategoryTree } from "@/services/rest-api/collections/collections";
import type { Collection } from "@/types/collection";

const SITE_NAME = process.env.SITE_NAME ?? "Mono Studio";
const LazyCartModal = dynamic(() => import("components/cart/modal"), {
  ssr: false,
  loading: () => <div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-800" />,
});
const LazyMobileMenu = dynamic(() => import("./mobile-menu"), {
  ssr: false,
});
const LazySearch = dynamic(() => import("./search"), {
  ssr: false,
  loading: () => <div className="h-10 w-full rounded-full bg-neutral-100 dark:bg-neutral-800" />,
});
const LazyNavbarDropdown = dynamic(() => import("./navbar-dropdown"), {
  ssr: false,
});

export default function Navbar() {
  const [menu, setMenu] = useState<MenuItem[]>(HEADER_MENU);
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const { items } = useWishlist();

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch categories from DB
  useEffect(() => {
    const fetchCategories = async () => {
      const tree = await getCategoryTree();
      if (tree && tree.length > 0) {
        const dynamicItems: MenuItem[] = tree.map((cat: Collection) => ({
          id: cat.id || Math.random(),
          title: cat.name,
          path: `/collections/${cat.code}`,
          description: cat.description,
          imageUrl: cat.imageUrl || cat.image?.url,
          children: cat.children?.map((child) => ({
            id: child.id || Math.random(),
            title: child.name,
            path: `/collections/${child.code}`,
            description: child.description,
            imageUrl: child.imageUrl,
            children: child.children?.map((sub) => ({
              id: sub.id || Math.random(),
              title: sub.name,
              path: `/collections/${sub.code}`,
              imageUrl: sub.imageUrl
            }))
          }))
        }));

        // Merge dynamic categories with static non-category items (Tin tức, Giới thiệu, Liên hệ, …)
        const staticItems = HEADER_MENU.filter(item => 
          !["Men", "Women", "New Arrivals", "Sale"].includes(item.title)
        );
        
        // Custom sort or placement: Categories first, then static
        setMenu([...dynamicItems, ...staticItems]);
      }
    };
    fetchCategories();
  }, []);

  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Close on route change
  useEffect(() => {
    setOpenDropdown(null);
  }, []);

  const openDropdownHandler = useCallback((id: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(id);
  }, []);

  const closeDropdownHandler = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150); // 150ms grace period
  }, []);

  return (
    <header
      className={`
        sticky top-0 z-40 w-full transition-all duration-300 ease-in-out
        ${isScrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.05)] py-1 dark:bg-neutral-900/80 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]"
          : "bg-white py-2 dark:bg-neutral-900"
        }
      `}
    >
      <nav className="relative flex items-center gap-4 p-4 lg:px-6 mx-auto max-w-screen-2xl">
        {/* Left: Mobile Menu + Logo + Desktop Nav */}
        <div className="flex items-center gap-3 lg:gap-6 flex-1 md:flex-initial">
          <div className="md:hidden">
            <Suspense fallback={null}>
              <LazyMobileMenu menu={menu} />
            </Suspense>
          </div>

          <Link
            href="/"
            prefetch={true}
            className="flex items-center gap-2 group shrink-0"
          >
            <LogoSquare />
            <div className="hidden text-base font-bold uppercase tracking-tight md:block">
              {SITE_NAME}
            </div>
          </Link>

          {menu.length ? (
            <ul className="hidden md:flex items-center gap-1">
              {menu.map((item: MenuItem) => {
                const hasChildren = Boolean(item.children?.length);
                const isOpen = openDropdown === item.id;

                return (
                  <li
                    key={item.id}
                    onMouseEnter={() => hasChildren && openDropdownHandler(item.id)}
                    onMouseLeave={() => hasChildren && closeDropdownHandler()}
                  >
                    {hasChildren ? (
                      <Link
                        href={item.path}
                        prefetch={true}
                        className={`
                          relative flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-all rounded-full
                          ${isOpen
                            ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                            : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                          }
                        `}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                      >
                        {item.title}
                        <CaretDownIcon
                          size={10}
                          weight="bold"
                          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "opacity-50"}`}
                          aria-hidden
                        />
                      </Link>
                    ) : (
                      <Link
                        href={item.path}
                        prefetch={true}
                        className="px-3 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-white"
                      >
                        {item.title}
                      </Link>
                    )}

                    {/* Dropdown panel */}
                    {hasChildren && isOpen && (
                      <LazyNavbarDropdown
                        item={item}
                        onClose={closeDropdownHandler}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>

        {/* Center: Search (Visible on md+) */}
        <div className="hidden md:flex flex-1 justify-center max-w-md">
          <Suspense fallback={<div className="h-10 w-full rounded-full bg-neutral-100 dark:bg-neutral-800" />}>
            <LazySearch />
          </Suspense>
        </div>

        {/* Right: Actions (Cart + Auth) */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 flex-none md:flex-initial">
          <Link
            href="/wishlist"
            className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200/60 bg-neutral-50/50 transition-colors hover:border-neutral-300 hover:bg-white dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-800"
            aria-label="Xem danh sách yêu thích"
          >
            <Heart size={20} className="text-neutral-700 transition-colors group-hover:text-red-500 dark:text-neutral-300" />
            {items.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-neutral-900">
                {items.length}
              </span>
            )}
          </Link>
          <LazyCartModal />

          <Suspense fallback={<div className="w-8 h-8 rounded-full bg-neutral-100" />}>
            {authLoading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-white" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-1 px-1 py-1 rounded-full border border-neutral-200/60 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/50">
                <Link href={SITE_NAV.account}>
                  <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 gap-2 text-xs font-semibold hover:bg-white dark:hover:bg-neutral-800 shadow-sm transition-all">
                    <User size={14} className="text-neutral-500" />
                    <span className="hidden sm:inline">
                      {user?.firstName || "Tài khoản"}
                    </span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                  title="Đăng xuất"
                >
                  <SignOut size={14} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link href={SITE_NAV.login} className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="h-9 rounded-full px-5 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href={SITE_NAV.register}>
                  <Button size="sm" className="h-9 rounded-full px-5 text-sm font-bold bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-100 shadow-md transition-all active:scale-95">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
