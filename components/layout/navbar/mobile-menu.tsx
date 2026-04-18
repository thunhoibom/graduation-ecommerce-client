"use client";

import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, Suspense, useEffect, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { CaretDownIcon } from "@phosphor-icons/react";
import type { MenuItem } from "@/types/common";
import Search, { SearchSkeleton } from "./search";

export default function MobileMenu({ menu }: { menu: MenuItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Mở menu"
        className="flex h-11 w-11 items-center justify-center border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
      >
        <Bars3Icon className="h-4" />
      </button>

      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>

          {/* Panel */}
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-white dark:bg-black">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-black dark:text-white"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <rect width="20" height="20" fill="currentColor" />
                    <rect x="3" y="3" width="14" height="14" fill="white" />
                    <rect x="6" y="6" width="8" height="8" fill="currentColor" />
                  </svg>
                  Mono Studio
                </Link>
                <button
                  onClick={closeMobileMenu}
                  aria-label="Đóng menu"
                  className="flex h-10 w-10 items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-white"
                >
                  <XMarkIcon className="h-6" />
                </button>
              </div>

              {/* Search */}
              <div className="border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
                <Suspense fallback={<SearchSkeleton />}>
                  <Search />
                </Suspense>
              </div>

              {/* Nav items */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <ul className="space-y-1">
                  {menu.map((item: MenuItem) => (
                    <MobileMenuItem
                      key={item.id}
                      item={item}
                      onClick={closeMobileMenu}
                    />
                  ))}
                </ul>
              </div>

              {/* Footer links */}
              <div className="border-t border-neutral-200 px-4 py-4 dark:border-neutral-800">
                <div className="flex gap-4">
                  <Link
                    href="/help/faq"
                    onClick={closeMobileMenu}
                    className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-white"
                  >
                    FAQ
                  </Link>
                  <Link
                    href="/about"
                    onClick={closeMobileMenu}
                    className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-white"
                  >
                    Về chúng tôi
                  </Link>
                  <Link
                    href="/contact"
                    onClick={closeMobileMenu}
                    className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-white"
                  >
                    Liên hệ
                  </Link>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function MobileMenuItem({
  item,
  onClick,
}: {
  item: MenuItem;
  onClick: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = Boolean(item.children?.length);
  const pathname = usePathname();
  const isActive = pathname === item.path;

  return (
    <li>
      <div className="flex items-center">
        <Link
          href={item.path}
          onClick={hasChildren ? (e) => { e.preventDefault(); setOpen(!open); } : onClick}
          className={`flex-1 py-3 text-base font-medium transition-colors ${
            isActive
              ? "text-black dark:text-white"
              : "text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
          }`}
        >
          {item.title}
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Thu gọn" : "Mở rộng"}
            className="flex h-10 w-10 items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors dark:text-neutral-600 dark:hover:text-white"
          >
            <CaretDownIcon
              className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && (
        <div
          className={`overflow-hidden transition-all duration-200 ${
            open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="ml-4 border-l border-neutral-200 pl-4 dark:border-neutral-700">
            {item.children!.map((child) => (
              <li key={child.id}>
                <Link
                  href={child.path}
                  onClick={onClick}
                  className="block py-2.5 text-sm text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors"
                >
                  {child.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
