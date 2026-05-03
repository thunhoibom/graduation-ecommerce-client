# Tài liệu Context Project: Mono Studio E-Commerce - Client Frontend

Tài liệu này tổng hợp toàn bộ thông tin kỹ thuật và chức năng của phần **Client Frontend** (dành cho khách hàng) trong đồ án tốt nghiệp hệ thống thương mại điện tử **Mono Studio**.

---

## 1. Thông tin chung
- **Tên dự án:** Mono Studio E-Commerce - Client Frontend
- **Công nghệ chính:** Next.js 15 (App Router), React 19, TypeScript.
- **Mục tiêu:** Xây dựng giao diện mua sắm hiện đại, hiệu năng cao, tối ưu SEO và trải nghiệm người dùng (UX) cho thương hiệu thời trang Mono Studio.

---

## 2. Kiến trúc Kỹ thuật (Tech Stack)

### Core Framework & Library
- **Framework:** `Next.js 15.6.0-canary` (sử dụng App Router & Turbopack).
- **Ngôn ngữ:** `TypeScript 5.8`.
- **UI Components:** `Shadcn UI`, `Radix UI`, `Headless UI`.
- **Styling:** `Tailwind CSS 4.0` (phiên bản mới nhất với khả năng xử lý CSS ưu việt).
- **Icons:** `Phosphor Icons`, `Heroicons`.

### State Management & Data Fetching
- **API Fetching:** `SWR` (Stale-While-Revalidate) giúp cache dữ liệu, tối ưu tốc độ tải trang và trải nghiệm người dùng mượt mà.
- **Global State:** `React Context API` (đặc biệt cho hệ thống Giỏ hàng - Cart Context).
- **Form Handling:** `React Hook Form` kết hợp với `Zod` để validation dữ liệu phía client.
- **Networking:** `Axios` với cấu hình Interceptor để xử lý JWT Token và Session Token.

### Tiện ích khác
- **Bản đồ:** `Leaflet` & `React Leaflet` cho tính năng chọn vị trí giao hàng (`LocationPicker`).
- **Thông báo:** `Sonner` (Toasts).
- **Xử lý tiền tệ:** Định dạng VNĐ (`Intl.NumberFormat`).

---

## 3. Các Chức năng Chính (Core Features)

### 🛍️ Mua sắm & Sản phẩm
- **Duyệt sản phẩm:** Theo danh mục (Nam, Nữ, Bộ sưu tập mới, Sale).
- **Lọc & Sắp xếp:** Theo giá, màu sắc, kích thước, trạng thái kho hàng.
- **Chi tiết sản phẩm:** Hiển thị đa biến thể (variants), hình ảnh zoom, mô tả chi tiết và thông tin kho hàng thực tế.
- **Hệ thống Review:** Khách hàng có thể đánh giá và bình luận sản phẩm (có nhãn "Verified Purchase" nếu đã mua hàng).

### 🔍 Tìm kiếm nâng cao (Elasticsearch)
- Tích hợp tìm kiếm toàn văn (Full-text search) qua Elasticsearch backend, cho kết quả chính xác và tốc độ phản hồi cực nhanh.

### 🌤️ Gợi ý theo Thời tiết (Weather-based Recommendations)
- **Tính năng độc đáo:** Hệ thống sử dụng tọa độ (Latitude/Longitude) của người dùng để lấy dữ liệu thời tiết hiện tại và gợi ý các danh mục sản phẩm phù hợp (ví dụ: trời lạnh gợi ý áo khoác, trời nắng gợi ý áo thun/short).

### 🛒 Giỏ hàng thông minh (Persistent Cart)
- Hỗ trợ cả khách vãng lai (Guest) và khách đã đăng nhập.
- Sử dụng `cart_session_token` lưu trong Cookie để duy trì giỏ hàng xuyên suốt các phiên làm việc.
- Đồng bộ hóa thời gian thực với kho hàng qua hệ thống **Stock Reservation** của Backend.

### 💳 Quy trình Thanh toán (Checkout Pipeline)
- **Multi-step Checkout:** Thông tin giao hàng -> Phương thức vận chuyển -> Thanh toán -> Xác nhận.
- **Tích hợp GHN (Giao Hang Nhanh):** Lấy danh sách Tỉnh/Thành, Quận/Huyện, Phường/Xã chính xác để tính phí vận chuyển và thời gian giao hàng dự kiến.
- **Đa dạng cổng thanh toán:**
  - VNPAY (ATM, QR, Credit Card).
  - MoMo.
  - PayOS.
  - COD (Thanh toán khi nhận hàng).
- **Hóa đơn:** Hỗ trợ xuất hóa đơn cá nhân hoặc hóa đơn doanh nghiệp (VAT 8%/10%).

### 👤 Quản lý Tài khoản (User Account)
- Đăng nhập/Đăng ký qua JWT.
- Quản lý sổ địa chỉ (Address Book).
- Theo dõi lịch sử đơn hàng và trạng thái đơn hàng (Pending, Confirmed, Shipped, etc.).
- Gửi yêu cầu đổi trả (Return Request) trực tiếp trên giao diện.

---

## 4. Cấu trúc Thư mục (Project Structure)
- `/app`: Chứa các route (pages), layout, và các server components của Next.js.
- `/components`: Các thành phần giao diện tái sử dụng, chia theo module (cart, product, ui, layout).
- `/services/rest-api`: Lớp xử lý gọi API, phân tách rạch ròi logic giao tiếp backend.
- `/hooks`: Các custom hooks xử lý logic nghiệp vụ (auth, search, debounce).
- `/types`: Định nghĩa các interface/types TypeScript đồng bộ với mô hình dữ liệu (Pojo) của Backend Java.
- `/lib`: Các tiện ích dùng chung (utils, formatting, constants).

---

## 5. Điểm nhấn Kỹ thuật cho Báo cáo (Key Highlights)
1. **Performance:** Sử dụng Server-Side Rendering (SSR) và Incremental Static Regeneration (ISR) của Next.js để tối ưu tốc độ tải và SEO.
2. **Security:** Bảo mật qua JWT và HttpOnly Cookies.
3. **UX/UI:** Giao diện tối giản (Minimalism), hỗ trợ Dark Mode, hiệu ứng micro-animations mượt mà.
4. **Integration:** Khả năng tích hợp phức tạp với Elasticsearch, OpenWeather API, và các cổng thanh toán nội địa Việt Nam.
5. **Clean Code:** Codebase được tổ chức chặt chẽ, sử dụng TypeScript giúp giảm thiểu lỗi runtime và dễ dàng bảo trì.
