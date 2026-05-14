/**
 * Static navigation config — replaces Shopify getMenu() calls
 */

import type { MenuItem } from "@/types/common";

export const HEADER_MENU: MenuItem[] = [
  {
    id: 1,
    title: "Men",
    path: "/men",
    description: "Bold style, timeless comfort",
    children: [
      {
        id: 11,
        title: "Áo thun",
        path: "/collections/men-ao-thun",
        description: "Essential tees for everyday",
        children: [
          { id: 111, title: "Áo thun cổ tròn", path: "/collections/men-ao-thun-tron" },
          { id: 112, title: "Áo thun cổ V", path: "/collections/men-ao-thun-v" },
          { id: 113, title: "Áo thun oversize", path: "/collections/men-ao-thun-oversize" },
        ],
      },
      {
        id: 12,
        title: "Áo polo",
        path: "/collections/men-ao-polo",
        description: "Smart casual meets streetwear",
        children: [
          { id: 121, title: "Áo polo cổ đứng", path: "/collections/men-ao-polo-dung" },
          { id: 122, title: "Áo polo classic", path: "/collections/men-ao-polo-classic" },
          { id: 123, title: "Áo polo pique", path: "/collections/men-ao-polo-pique" },
        ],
      },
      {
        id: 13,
        title: "Quần",
        path: "/collections/men-quan",
        description: "From joggers to chinos",
        children: [
          { id: 131, title: "Quần jogger", path: "/collections/men-quan-jogger" },
          { id: 132, title: "Quần dài", path: "/collections/men-quan-dai" },
          { id: 133, title: "Quần short", path: "/collections/men-quan-short" },
        ],
      },
      {
        id: 14,
        title: "Phụ kiện",
        path: "/collections/men-phu-kien",
        children: [
          { id: 141, title: "Nón & mũ", path: "/collections/men-phu-kien-non" },
          { id: 142, title: "Túi & balo", path: "/collections/men-phu-kien-tui" },
          { id: 143, title: "Thắt lưng", path: "/collections/men-phu-kien-that-lung" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Women",
    path: "/women",
    description: "Refined elegance, effortless wear",
    children: [
      {
        id: 21,
        title: "Áo thun",
        path: "/collections/women-ao-thun",
        description: "Minimal tees with attitude",
        children: [
          { id: 211, title: "Áo thun cổ tròn", path: "/collections/women-ao-thun-tron" },
          { id: 212, title: "Áo thun cổ V", path: "/collections/women-ao-thun-v" },
          { id: 213, title: "Áo thun crop", path: "/collections/women-ao-thun-crop" },
        ],
      },
      {
        id: 22,
        title: "Áo polo",
        path: "/collections/women-ao-polo",
        description: "Polished yet relaxed",
        children: [
          { id: 221, title: "Áo polo classic", path: "/collections/women-ao-polo-classic" },
          { id: 222, title: "Áo polo ngắn", path: "/collections/women-ao-polo-short" },
        ],
      },
      {
        id: 23,
        title: "Quần",
        path: "/collections/women-quan",
        description: "Versatile from studio to street",
        children: [
          { id: 231, title: "Quần jogger", path: "/collections/women-quan-jogger" },
          { id: 232, title: "Quần dài", path: "/collections/women-quan-dai" },
          { id: 233, title: "Quần short", path: "/collections/women-quan-short" },
          { id: 234, title: "Chân váy", path: "/collections/women-quan-chan-vay" },
        ],
      },
      {
        id: 24,
        title: "Phụ kiện",
        path: "/collections/women-phu-kien",
        children: [
          { id: 241, title: "Nón & mũ", path: "/collections/women-phu-kien-non" },
          { id: 242, title: "Túi & balo", path: "/collections/women-phu-kien-tui" },
          { id: 243, title: "Khăn & bandana", path: "/collections/women-phu-kien-khan" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "New Arrivals",
    path: "/new-arrivals",
    description: "Fresh drops, season essentials",
    children: [
      {
        id: 31,
        title: "Men — Mùa mới",
        path: "/collections/new-men",
        children: [
          { id: 311, title: "Toàn bộ", path: "/collections/new-men" },
        ],
      },
      {
        id: 32,
        title: "Women — Mùa mới",
        path: "/collections/new-women",
        children: [
          { id: 321, title: "Toàn bộ", path: "/collections/new-women" },
        ],
      },
      {
        id: 33,
        title: "Bộ sưu tập Capsule",
        path: "/collections/new-capsule",
        children: [
          { id: 331, title: "Mono Noir", path: "/collections/mono-noir" },
          { id: 332, title: "Urban Linen", path: "/collections/urban-linen" },
          { id: 333, title: "Weekend Core", path: "/collections/weekend-core" },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Sale",
    path: "/sale",
    description: "Up to 50% off — limited time",
    children: [
      {
        id: 41,
        title: "Nam giảm giá",
        path: "/collections/sale-men",
      },
      {
        id: 42,
        title: "Nữ giảm giá",
        path: "/collections/sale-women",
      },
      {
        id: 43,
        title: "Khung giờ sale",
        path: "/collections/sale-deal",
      },
    ],
  },
  {
    id: 7,
    title: "Tin tức",
    path: "/blog",
    description: "Câu chuyện, phong cách và tin tức từ Mono Studio",
    menuPanel: "blog",
  },
  {
    id: 5,
    title: "Giới thiệu",
    path: "/about",
    children: [
      { id: 51, title: "Về Mono Studio", path: "/about" },
      { id: 52, title: "Tầm nhìn & Giá trị", path: "/about#vision" },
      { id: 54, title: "Tuyển dụng", path: "/careers" },
    ],
  },
  {
    id: 6,
    title: "Liên hệ",
    path: "/contact",
    children: [
      { id: 61, title: "Liên hệ", path: "/contact" },
      { id: 62, title: "Cửa hàng", path: "/stores" },
      { id: 63, title: "Hỗ trợ", path: "/help" },
      { id: 64, title: "FAQ", path: "/help/faq" },
    ],
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
      { id: 113, title: "Tin tức", path: "/blog" },
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
  // Main nav routes
  men: "/men",
  women: "/women",
  newArrivals: "/new-arrivals",
  sale: "/sale",
  about: "/about",
  blog: "/blog",
  contact: "/contact",
  // Sale sub-routes
  saleMen: "/sale/men",
  saleWomen: "/sale/women",
  // Help routes
  help: "/help",
  faq: "/help/faq",
} as const;
