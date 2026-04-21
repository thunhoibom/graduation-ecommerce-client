# Tài liệu bàn giao Frontend: Tích hợp Elasticsearch cho tìm kiếm sản phẩm

Hệ thống đã được bổ sung giải pháp tìm kiếm Full-text search sử dụng **Elasticsearch** và **Kafka** để đồng bộ dữ liệu. Dưới đây là các thay đổi quan trọng mà Frontend cần lưu ý và điều chỉnh.

---

## 1. Endpoint Tìm kiếm Mới

Sử dụng endpoint này cho các chức năng: **Thanh tìm kiếm (Search Bar)**, **Trang kết quả tìm kiếm**, và **Search gợi ý (Search Suggestion)**.

- **URL:** `/api/public/products/search`
- **Method:** `GET`
- **Query Parameter:** `q` (bắt buộc) - Từ khoá tìm kiếm của người dùng.
- **Ví dụ:** `http://localhost:8081/api/public/products/search?q=iphone 15 pro`

## 2. Cấu trúc dữ liệu trả về (Response)

Dữ liệu trả về là một **Mảng (Array)** các đối tượng sản phẩm được tối ưu cho việc hiển thị nhanh (từ Elasticsearch).

**Ví dụ JSON response:**
```json
[
  {
    "id": "1",
    "name": "IPhone 15 Pro Max 256GB",
    "barcode": "IP15PM-256",
    "description": "Chip A17 Pro mạnh mẽ, camera 48MP...",
    "price": 32990000,
    "categoryName": "Điện thoại",
    "status": "PUBLISHED"
  },
  {
    "id": "12",
    "name": "IPhone 15 thường 128GB",
    "barcode": "IP15-128",
    "description": "Nhiều màu sắc cá tính...",
    "price": 20990000,
    "categoryName": "Điện thoại",
    "status": "PUBLISHED"
  }
]
```

### Lưu ý quan trọng cho FE:
- Hệ thống Elasticsearch tự động xử lý **Full-text search**: Tìm theo cả tên, mô tả và barcode.
- Các API cũ (`GET /api/public/products`) vẫn hoạt động bình thường, dùng để liệt kê sản phẩm theo Danh mục (Category) hoặc lọc theo Giá (Price range) thông qua các Filter của Postgres.
- **KHÔNG** nên dùng API cũ cho việc tìm kiếm từ khoá (như `name_LIKE=...`) vì Elasticsearch sẽ trả kết quả chính xác và liên quan (relevancy) hơn nhiều.

## 3. Quản trị (Dành cho Admin Tool)

Nếu FE có phần quản trị Admin, cần biết rằng Backend đã có thêm endpoint để "nạp lại" dữ liệu trong trường hợp dữ liệu giữa Database và Elasticsearch bị lệch:

- **URL:** `/api/data/search/reindex-all`
- **Method:** `POST`
- **Quyền:** Yêu cầu quyền Admin (`products:update`).
- **Tác dụng:** Đồng bộ lại toàn bộ Sản phẩm và Bài viết hiện có sang Elasticsearch qua luồng Kafka.

---

> [!NOTE]
> Nếu các bạn cần tôi chuyển mảng kết quả thành dạng phân trang `{ "items": [...], "total": 100 }` giống hệt các API khác, hoặc cần thêm các trường dữ liệu như `thumbnailUrl`, hãy báo lại cho Back-end để cập nhật Map dữ liệu.
