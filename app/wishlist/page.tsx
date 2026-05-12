import type { Metadata } from "next";
import { WishlistView } from "./_components/wishlist-view";

export const metadata: Metadata = {
  title: "Danh sách yêu thích — Mono Studio",
  description:
    "Xem và quản lý sản phẩm bạn đã lưu tại Mono Studio. Thêm vào giỏ hàng hoặc tiếp tục mua sắm bất cứ lúc nào.",
};

export default function WishlistPage() {
  return <WishlistView />;
}
