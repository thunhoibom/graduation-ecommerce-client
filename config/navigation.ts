/**
 * Static navigation config — replaces Shopify getMenu() calls
 */

import type { MenuItem } from "@/types/common";

export const HEADER_MENU: MenuItem[] = [
  {
    id: 1,
    title: "Sản phẩm",
    path: "/collection/all",
  },
  {
    id: 2,
    title: "Bộ sưu tập",
    path: "/search",
    children: [
      { id: 21, title: "Áo thun", path: "/collection/ao-thun" },
      { id: 22, title: "Áo polo", path: "/collection/ao-polo" },
      { id: 23, title: "Quần", path: "/collection/quan" },
      { id: 24, title: "Phụ kiện", path: "/collection/phu-kien" },
    ],
  },
  {
    id: 3,
    title: "Về chúng tôi",
    path: "/about",
  },
  {
    id: 4,
    title: "Liên hệ",
    path: "/contact",
  },
];

export const FOOTER_MENU: MenuItem[] = [
  {
    id: 10,
    title: "Hỗ trợ",
    path: "#",
    children: [
      { id: 101, title: "Hướng dẫn mua hàng", path: "/help/shopping-guide" },
      { id: 102, title: "Chính sách đổi trả", path: "/help/return-policy" },
      { id: 103, title: "Chính sách vận chuyển", path: "/help/shipping" },
      { id: 104, title: "Câu hỏi thường gặp", path: "/help/faq" },
    ],
  },
  {
    id: 11,
    title: "Công ty",
    path: "#",
    children: [
      { id: 111, title: "Giới thiệu", path: "/about" },
      { id: 112, title: "Tuyển dụng", path: "/careers" },
      { id: 113, title: "Blog", path: "/blog" },
    ],
  },
  {
    id: 12,
    title: "Kết nối",
    path: "#",
    children: [
      { id: 121, title: "Facebook", path: "https://facebook.com", external: true },
      { id: 122, title: "Instagram", path: "https://instagram.com", external: true },
      { id: 123, title: "TikTok", path: "https://tiktok.com", external: true },
    ],
  },
];

export const SITE_NAV = {
  home: "/",
  search: "/search",
  account: "/account",
  orders: "/account/orders",
  login: "/login",
  register: "/register",
  cart: "/cart",
} as const;
