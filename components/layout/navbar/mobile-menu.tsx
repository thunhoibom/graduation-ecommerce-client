"use client";

import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, Suspense, useEffect, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { CaretDownIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import type { MenuItem } from "@/types/common";
import LogoSquare from "components/logo-square";
import Search, { SearchSkeleton } from "./search";

interface MobileMenuProps {
  menu: MenuItem[];
}

interface BreadcrumbItem {
  id: number;
  title: string;
  path: string;
}

export default function MobileMenu({ menu }: MobileMenuProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);
  const [currentItems, setCurrentItems] = useState<MenuItem[]>(menu);

  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => {
    setIsOpen(false);
    resetMenu();
  };

  const resetMenu = () => {
    setBreadcrumb([]);
    setCurrentItems(menu);
  };

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

  // Sync when menu prop changes (e.g. if config updates)
  useEffect(() => {
    setCurrentItems(menu);
  }, [menu]);

  const navigateToParent = () => {
    const newBreadcrumb = [...breadcrumb];
    newBreadcrumb.pop();
    setBreadcrumb(newBreadcrumb);

    if (newBreadcrumb.length === 0) {
      setCurrentItems(menu);
    } else {
      // Navigate to the parent item's children
      const parentId = newBreadcrumb[newBreadcrumb.length - 1]?.id;
      if (parentId === undefined) {
        setCurrentItems(menu);
        return;
      }
      const parent = findItemById(menu, parentId);
      setCurrentItems(parent?.children ?? menu);
    }
  };

  const navigateToChild = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      setBreadcrumb((prev) => [...prev, { id: item.id, title: item.title, path: item.path }]);
      setCurrentItems(item.children);
    }
  };

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Mở menu"
        className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
      >
        <Bars3Icon className="h-6 w-6" />
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
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-white dark:bg-black">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
                {breadcrumb.length > 0 ? (
                  <button
                    onClick={navigateToParent}
                    className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-black transition-colors dark:text-neutral-300 dark:hover:text-white"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Quay lại
                  </button>
                ) : (
                  <Link
                    href="/"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 text-base font-bold uppercase tracking-tight text-black dark:text-white"
                  >
                    <LogoSquare size="sm" />
                    Mono Studio
                  </Link>
                )}

                {/* Breadcrumb */}
                {breadcrumb.length > 0 && (
                  <nav aria-label="Breadcrumb" className="flex flex-1 items-center justify-center gap-1 px-4">
                    <span className="text-xs text-neutral-400">
                      {breadcrumb.map((crumb, i) => (
                        <span key={crumb.id}>
                          {i > 0 && <span className="mx-1">/</span>}
                          <span className={i === breadcrumb.length - 1 ? "text-neutral-700 dark:text-neutral-300" : ""}>
                            {crumb.title}
                          </span>
                        </span>
                      ))}
                    </span>
                  </nav>
                )}

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
                  {currentItems.map((item: MenuItem) => (
                    <MobileMenuItem
                      key={item.id}
                      item={item}
                      onItemClick={() => navigateToChild(item)}
                      onLinkClick={closeMobileMenu}
                    />
                  ))}
                </ul>
              </div>

              {/* Footer links */}
              <div className="border-t border-neutral-200 px-4 py-4 dark:border-neutral-800">
                <div className="flex flex-wrap gap-x-4 gap-y-2">
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
                  <Link
                    href="/sale"
                    onClick={closeMobileMenu}
                    className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors dark:text-red-400 dark:hover:text-red-300"
                  >
                    Sale 🔥
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
  onItemClick,
  onLinkClick,
}: {
  item: MenuItem;
  onItemClick: () => void;
  onLinkClick: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = Boolean(item.children?.length);
  const pathname = usePathname();
  const isActive = pathname === item.path;

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setOpen(!open);
      if (!open) onItemClick();
    } else {
      onLinkClick();
    }
  };

  return (
    <li>
      <div className="flex items-center">
        <Link
          href={item.path}
          onClick={handleClick}
          className={`flex-1 py-3 pr-2 text-base font-medium transition-colors ${isActive
              ? "text-black dark:text-white"
              : "text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
            }`}
        >
          {item.title}
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setOpen(!open);
              if (!open) onItemClick();
            }}
            aria-label={open ? "Thu gọn" : "Mở rộng"}
            className="flex h-10 w-10 items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors dark:text-neutral-600 dark:hover:text-white"
          >
            <CaretDownIcon
              className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {/* Children — accordion style */}
      {hasChildren && open && (
        <div
          className={`overflow-hidden transition-all duration-200 ${open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <ul className="ml-4 border-l border-neutral-200 pl-4 dark:border-neutral-700">
            {item.children!.map((child) => (
              <li key={child.id}>
                <Link
                  href={child.path}
                  onClick={onLinkClick}
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

// Helper to find item by id in menu tree
function findItemById(items: MenuItem[], id: number): MenuItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
}
