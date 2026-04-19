# MONO STUDIO — Frontend Implementation Plan

> Last updated: 2026-04-18. Status reflects actual codebase audit.

---

## 1. Tổng Quan Kiến Trúc Hiện Tại

```
commerce/
├── app/                      # Next.js 15 App Router
├── components/
│   ├── ui/                   # ✅ 22 Shadcn base components
│   ├── layout/                # Navbar, Footer, Search, ProductGridItems
│   ├── cart/                  # Context, Modal, AddToCart, EditItem, DeleteItem
│   ├── home/sections/         # Hero, Collections grid, Featured carousel
│   ├── product/               # Gallery, VariantSelector, ProductDescription
│   ├── grid/                  # Tile, Index
│   └── carousel/              # Home carousel
├── services/rest-api/         # ✅ Full REST API layer (Axios)
└── types/                     # ✅ Shared TypeScript types
```

---

## 2. Backend Integration — REST API Layer

> ⚠️ **Single source of truth:** Spring Boot backend at `http://localhost:8080/api`.
> **Shopify is NOT used** for any data. All cart/product/order data via REST.

### 2.1 Public APIs (no auth)

| Nhóm | Endpoints | File | Trạng thái |
|---|---|---|---|
| Auth | `POST /public/auth/register`, `POST /public/auth/login` | `auth/auth.ts` | ✅ |
| Cart | `GET/DELETE /public/cart`, `POST /public/cart/items`, `PATCH/DELETE /public/cart/items/{sku}` | `cart/cart.ts` | ✅ |
| Shipping | `GET /public/shipping/methods` | `checkout/checkout.ts` | ✅ REST có |
| Discount | `GET /public/discount/validate` | `checkout/checkout.ts` | ✅ REST có |
| Checkout | `POST /public/checkout` → Webpay redirect | `checkout/checkout.ts` | ✅ REST có |
| Receipt | `GET /public/receipt/{token}` | `checkout/checkout.ts` | ✅ REST có |
| Products | `GET /data/products`, `GET /public/products/{barcode}/reviews` | `products/products.ts` | ✅ REST có |
| About | `GET /public/about` | `about/about.ts` | ✅ REST có |
| Collections | `GET /data/categories`, `GET /data/categories/{slug}` | `collections/collections.ts` | ✅ REST có |
| AddressBook | `GET/POST /public/address-book` | `address-book.ts` | ✅ REST có |
| Returns | `POST /public/returns`, `GET /public/returns/{id}` | `returns/returns.ts` | ✅ REST có |

### 2.2 Customer APIs (auth required)

| Nhóm | Endpoints | Trạng thái |
|---|---|---|
| Profile | `GET/PUT /account/profile` | ✅ REST có |
| Reviews | `GET/POST /account/reviews` | ✅ REST có |
| Orders | `GET /data/orders`, `GET /data/orders/{id}` | ✅ REST có |
| Addresses | `GET/POST/PUT/DELETE /account/addresses` | ✅ REST có |

**→ Action required:** UI pages for these endpoints still need to be wired up (not the API).

---

## 3. UI Component Library — Thực Tế

> **Core rule:** MONO STUDIO UI = Shadcn UI + Tailwind + custom composition.
> KHÔNG tự build lại primitive components.

### ✅ Đã có (22 components)

```
components/ui/
├── button.tsx          ✅
├── input.tsx           ✅
├── label.tsx           ✅
├── badge.tsx          ✅
├── card.tsx           ✅
├── dialog.tsx         ✅
├── dropdown-menu.tsx  ✅
├── checkbox.tsx       ✅
├── avatar.tsx         ✅
├── progress.tsx       ✅
├── scroll-area.tsx    ✅
├── popover.tsx        ✅
├── pagination.tsx     ✅
├── alert-dialog.tsx    ✅
├── sonner.tsx         ✅ (Sonner toasts)
├── select.tsx         ✅
├── table.tsx          ✅
├── tabs.tsx           ✅
├── separator.tsx      ✅
├── skeleton.tsx       ✅
├── textarea.tsx       ✅
├── sheet.tsx          ✅ (mobile sidebar / drawer)
└── command.tsx        ❌ Còn thiếu (search command palette)
```

### ❌ Còn thiếu

```
components/ui/
├── command.tsx         ❌ Search command palette (Radix + cmdk)
└── accordion.tsx       ❌ FAQ, filters expandable sections
```

> ✅ `form.tsx` — dùng trực tiếp `react-hook-form` + `zod` + `@hookform/resolvers`, không cần shadcn form primitive. Validation schemas đặt trong `hooks/` hoặc `lib/validations/`.

---

## 4. Pages & Components Status

### Public Pages

| Route | File | Trạng thái | Ghi chú |
|---|---|---|---|
| `/` | `app/page.tsx` | ✅ | Hero, collections grid, featured carousel |
| `/collections` | `app/collections/page.tsx` | ✅ | All categories |
| `/collections/all` | `app/collections/all/page.tsx` | ✅ | Grid of all products |
| `/collections/[slug]` | `app/collections/[slug]/page.tsx` | ✅ | Category filter + product grid |
| `/product/[barcode]` | `app/product/[barcode]/page.tsx` | ✅ | Gallery, variant selector, description |
| `/search` | `app/search/page.tsx` | ✅ | Search results grid |
| `/cart` | `app/cart/page.tsx` | ✅ | Cart page with `cart-view` |
| `/checkout` | `app/checkout/page.tsx` | ✅ | 4-step checkout flow |
| `/checkout/success` | `app/checkout/success/page.tsx` | ✅ | Post-payment success |
| `/about` | `app/about/page.tsx` | ✅ | About page |
| `/receipt/[token]` | `app/receipt/[token]/page.tsx` | ✅ | Order receipt |

### Auth Pages

| Route | File | Trạng thái |
|---|---|---|
| `/login` | `app/login/page.tsx` | ✅ |
| `/register` | `app/register/page.tsx` | ✅ |

### Account Pages

| Route | File | Trạng thái |
|---|---|---|
| `/account` | `app/account/page.tsx` | ✅ |
| `/account/orders` | `app/account/orders/page.tsx` | ✅ |
| `/account/orders/[id]` | `app/account/orders/[id]/page.tsx` | ✅ |
| `/account/addresses` | `app/account/addresses/page.tsx` | ✅ |
| `/account/returns/new` | `app/account/returns/new/page.tsx` | ✅ |

---

## 5. Cart System — Thực Tế

```
CartContext (cart-context.tsx)
├── Optimistic updates với useOptimistic
├── Auto-open modal khi thêm sản phẩm đầu tiên
├── getCart / addToCart / updateCartItem / removeFromCart
└── clearCart / refreshCart

Cart UI:
├── cart/modal.tsx        ✅ Mini cart drawer (Sheet)
├── cart/open-cart.tsx    ✅ Trigger button
├── cart/add-to-cart.tsx  ✅ Add to cart button
├── cart/edit-item-quantity-button.tsx  ✅ +/– buttons
├── cart/delete-item-button.tsx        ✅ Remove button
└── cart/cart-context.tsx             ✅ Provider + hook
```

---

## 6. Checkout Flow (4 bước)

```
Bước 1: Thông tin giao hàng
  └── Form: Họ tên, SĐT, Email, Địa chỉ, Tỉnh/TP, Quận/Huyện
           → react-hook-form + zod validation

Bước 2: Phương thức vận chuyển
  └── GET /api/public/shipping/methods  ✅
  └── Radio/select cards để chọn

Bước 3: Thanh toán
  └── Mã giảm giá: GET /api/public/discount/validate  ✅
  └── Tổng kết đơn hàng (subtotal, discount, shipping, total)
  └── Chọn phương thức → POST /api/public/checkout  ✅
  └── Redirect sang Webpay

Bước 4: Xác nhận (checkout/success)
  └── GET /api/public/checkout/validate?transactionData  ✅
  └── Hiển thị order summary
  └── → Receipt: GET /api/public/receipt/{token}  ✅
```

---

## 7. Các Giai Đoạn Triển Khai

### Phase 1: Hoàn thiện Core UI ✅ → 🟡
- [x] Tất cả pages cơ bản
- [x] Shadcn UI components đầy đủ
- [x] Cart context + optimistic updates
- [x] REST API layer

**Còn lại:**
- [ ] Checkout flow UI hoàn chỉnh (4 bước wired up với API)
- [ ] Cart modal — polish animation, empty state
- [ ] Product page — gallery zoom, sticky add-to-cart bar

### Phase 2: Cart & Checkout (2-3 ngày)
- [ ] Checkout step 1 — form validation với zod
- [ ] Checkout step 2 — shipping method selection UI
- [ ] Checkout step 3 — discount code input + order summary
- [ ] Checkout step 4 — payment redirect + success page
- [ ] Cart page — empty state, quantity validation

### Phase 3: Polish & UX (2 ngày)
- [ ] `components/ui/command.tsx` — search command palette
- [ ] `components/ui/accordion.tsx` — FAQ + filter sections
- [ ] Skeleton loaders cho tất cả async components
- [ ] Error boundaries + toast notifications on API errors
- [ ] Empty states cho: cart rỗng, search không kết quả, order rỗng
- [ ] Loading states (skeleton) cho product grid, collections

### Phase 4: Extra (optional)
- [ ] Dark mode toggle (next-themes đã có)
- [ ] Micro-animations (tailwind + tw-animate-css đã có)
- [ ] SEO metadata dynamic cho tất cả pages

---

## 8. Quality Checklist

- [x] Responsive: Mobile-first (Tailwind breakpoints)
- [x] Accessibility: ARIA labels, focus states
- [x] Form validation: `react-hook-form` + `zod` + `@hookform/resolvers`
- [x] Type safety: Full TypeScript, không `any`
- [x] Clean code: KHÔNG magic numbers, KHÔNG inline styles
- [ ] Loading: Skeleton loaders cho tất cả async components
- [ ] Error: Error boundaries + Sonner toasts on API errors
- [ ] Empty states: UI đẹp khi không có data
- [ ] Performance: `next/image`, lazy loading
- [ ] SEO: Metadata dynamic, OpenGraph
- [ ] Dark mode: Toggle support (low priority)

---

## 9. Tech Stack Thực Tế

| Công nghệ | Package | Trạng thái |
|---|---|---|
| UI primitives | shadcn (22 components) | ✅ |
| Styling | Tailwind CSS v4 + `tailwind-merge` | ✅ |
| Fonts | Geist | ✅ |
| Icons | `@heroicons/react` + `@phosphor-icons/react` | ✅ |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` | ✅ |
| Toasts | `sonner` | ✅ |
| HTTP | Axios | ✅ |
| State | React Context (cart) + `useOptimistic` | ✅ |
| Dark mode | `next-themes` | ✅ |
| Animations | `tw-animate-css` + Tailwind | ✅ |
| Dropdowns/Modals | `@headlessui/react` (Radix via shadcn) | ✅ |
| Data fetching | SWR (`swr`) + Axios | ✅ |

---

Bạn muốn bắt đầu từ Phase nào? Tôi suggest **Phase 2: hoàn thiện Checkout flow** — vì đó là luồng chính còn chưa xong.