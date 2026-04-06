// TODO: Replace with actual REST API call when backend is ready
// import { getCollectionProducts } from "@/services/rest-api/collections/collections";

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <section className="mx-auto max-w-(--breakpoint-2xl) px-4 pb-8">
      <p className="py-3 text-center text-lg text-neutral-500">
        Đang kết nối backend... Sản phẩm sẽ hiển thị sau khi REST API sẵn sàng.
      </p>
    </section>
  );
}