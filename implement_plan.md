🎨 MONO STUDIO — Frontend Implementation Plan
1. Tổng Quan Kiến Trúc Hiện Tại

commerce/
├── app/                    # Next.js 15 App Router pages
│   ├── page.tsx            # ✅ Trang chủ (đã có)
│   ├── layout.tsx          # ✅ Root layout (đã có)
│   ├── login/              # ✅ Auth
│   ├── register/          # ✅ Auth
│   ├── cart/               # 🟡 Cần cải thiện
│   ├── checkout/           # 🟡 Cần hoàn thiện
│   ├── product/[barcode]/  # 🟡 Cần cải thiện
│   ├── collections/        # 🟡 Cần cải thiện
│   ├── search/             # 🟡 Cần cải thiện
│   ├── account/            # 🟡 Cần hoàn thiện
├── components/             # UI components
│   ├── ui/                 # ✅ Shadcn base (đã có)
│   ├── layout/             # 🟡 Cần mở rộng
│   ├── cart/               # 🟡 Cần cải thiện
│   └── product/            # 🟡 Cần mở rộng
├── services/rest-api/      # ✅ API layer (đã có)
├── types/                  # ✅ Types (đã có)
└── hooks/                  # 🟡 Cần mở rộng
2. API Endpoints Theo Nhóm
2.1 Public APIs (không cần auth)
Nhóm	Endpoints	Trạng thái
Auth	POST /api/public/auth/register, POST /api/public/auth/login	✅ Đã có
Cart	GET/DELETE /api/public/cart, POST /api/public/cart/items, PATCH/DELETE /api/public/cart/items/{sku}	✅ Đã có
Checkout	POST /api/public/checkout, GET /api/public/checkout/validate	🟡 Cần tích hợp
Products	GET /api/data/products, GET /api/public/products/{barcode}/reviews	🟡 Cần cải thiện
Discount	GET /api/public/discount/validate	🟡 Cần tích hợp
Shipping	GET /api/public/shipping/methods	🟡 Cần tích hợp
Receipt	GET /api/public/receipt/{token}	❌ Chưa có
About	GET /api/public/about	❌ Chưa có
Address Book	GET/POST /api/public/address-book	❌ Chưa có
2.2 Customer APIs (cần auth)
Nhóm	Endpoints	Trạng thái
Profile	GET/PUT /api/account/profile	✅ Đã có
Reviews	GET/POST /api/account/reviews	🟡 Cần tích hợp
Orders	GET /api/data/orders	🟡 Cần cải thiện
3. Thiết Kế Hệ Thống Màu Sắc

Primary Brand: MONO STUDIO (Thời trang tối giản Việt Nam)

Theme mặc định: Light (sáng tạo)

Primary:       #0A0A0A  (Jet Black - tối giản)
Secondary:     #525252  (Neutral 600)
Accent:        #A3A3A3  (Neutral 400 - highlights)
Background:    #FAFAFA  (Neutral 50)
Surface:       #FFFFFF  (White card)
Border:        #E5E5E5  (Neutral 200)
Muted:         #F5F5F5  (Neutral 100)

Text:          #171717  (Neutral 900)
Text Muted:    #737373  (Neutral 500)
Text Subtle:   #A3A3A3  (Neutral 400)

Semantic:
- Success:     #22C55E  (Green)
- Warning:     #F59E0B  (Amber)
- Error:       #EF4444  (Red)
- Info:        #3B82F6  (Blue)
4. Phases Triển Khai

Phase 1: Core Pages (2-3 ngày)
├── Trang chủ (cải thiện)
├── Trang sản phẩm (PDP)
├── Collections / Danh mục
├── Search kết quả
└── Footer & Navigation nâng cao

Phase 2: Cart & Checkout (2-3 ngày)
├── Cart page hoàn chỉnh
├── Checkout flow (4 bước)
├── Discount code integration
├── Shipping method selection
└── Payment redirect (Webpay)

Phase 3: Account & Auth (2 ngày)
├── Login / Register UI
├── Profile management
├── Address book CRUD
├── Order history
└── Return request form

Phase 4: Polish & Extra (2 ngày)
├── About page
├── Receipt page
├── Review system UI
├── Loading states
├── Error pages
└── Animations & transitions


5. Pages & Components Cần Xây Dựng
PUBLIC PAGES
Route	File	Priority	Mô tả
/	app/page.tsx	P1	Trang chủ
/collections	app/collections/page.tsx	P1	Tất cả danh mục
/collections/[slug]	app/collections/[slug]/page.tsx	P1	Chi tiết danh mục
/product/[barcode]	app/product/[barcode]/page.tsx	P1	Trang sản phẩm
/search	app/search/page.tsx	P1	Tìm kiếm
/cart	app/cart/page.tsx	P2	Giỏ hàng
/checkout	app/checkout/page.tsx	P2	Thanh toán
/checkout/success	app/checkout/success/page.tsx	P2	Thanh toán thành công
/about	app/about/page.tsx	P5	Giới thiệu
AUTH PAGES
Route	File	Priority
/login	app/login/page.tsx	P3
/register	app/register/page.tsx	P3
ACCOUNT PAGES
Route	File	Priority
/account	app/account/page.tsx	P3
/account/orders	app/account/orders/page.tsx	P3
/account/orders/[id]	app/account/orders/[id]/page.tsx	P3
/account/addresses	app/account/addresses/page.tsx	P3
/account/returns/new	app/account/returns/new/page.tsx	P3

6. UI Component Library (UPDATED ARCHITECTURE)

👉 Core rule:
MONO STUDIO UI = Shadcn UI + Tailwind + custom composition, KHÔNG tự build lại primitive components.

components/ui/
├── button.tsx              ✅
├── input.tsx                ✅
├── label.tsx                ✅
├── badge.tsx                ✅
├── card.tsx                 ✅
├── dialog.tsx               ✅
├── dropdown-menu.tsx        ✅
├── checkbox.tsx             ✅
├── avatar.tsx               ✅
├── progress.tsx             ✅
├── scroll-area.tsx          ✅
├── popover.tsx              ✅
├── pagination.tsx           ✅
├── alert-dialog.tsx         ✅
├── toast.tsx / sonner       ✅ (dùng Sonner)
├── select.tsx               ❌ Cần thêm
├── table.tsx                ❌ Cần thêm
├── tabs.tsx                 ❌ Cần thêm
├── separator.tsx             ❌ Cần thêm
├── skeleton.tsx             ❌ Cần thêm
├── textarea.tsx             ❌ Cần thêm
├── form.tsx                 ❌ Cần thêm (react-hook-form + zod)
├── sheet.tsx                ❌ Cần thêm (sidebar mobile)
├── accordion.tsx            ❌ Cần thêm (FAQ, filters)
└── command.tsx              ❌ Cần thêm (search)


---

8. Checkout Flow (4 bước)

Bước 1: Thông tin giao hàng
  └── Form: Họ tên, SĐT, Email, Địa chỉ, Tỉnh/TP, Quận/Huyện

Bước 2: Phương thức vận chuyển
  └── GET /api/public/shipping/methods
  └── Hiển thị danh sách, chọn 1

Bước 3: Thanh toán
  └── Mã giảm giá: GET /api/public/discount/validate
  └── Tổng kết đơn hàng
  └── Chọn phương thức (Webpay redirect)

Bước 4: Xác nhận
  └── GET /api/public/receipt/{token}
  └── Hiển thị order summary
9. Quality Checklist

□ Responsive: Mobile-first, breakpoints: sm/md/lg/xl/2xl
□ Accessibility: ARIA labels, keyboard navigation, focus states
□ Loading: Skeleton loaders cho tất cả async components
□ Error: Error boundaries + toast notifications (Sonner)
□ Empty states: UI đẹp khi không có data
□ Form validation: react-hook-form + zod
□ Performance: Image optimization (next/image), lazy loading
□ SEO: Metadata dynamic, OpenGraph, sitemap
□ Dark mode: Hỗ trợ toggle (optional, thấp priority)
□ Type safety: Full TypeScript, không any
□ Clean code: KHÔNG magic numbers, KHÔNG inline styles
Bạn muốn tôi bắt đầu từ Phase nào? Hoặc muốn tôi triển khai từng phần để review trước?