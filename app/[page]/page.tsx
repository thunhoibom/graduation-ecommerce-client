// TODO: Replace with actual REST API call when backend is ready
// import { getPage } from "@/services/rest-api/menus/menus";

export default async function Page(props: {
  params: Promise<{ page: string }>;
}) {
  await props.params;

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
      <p className="text-center text-neutral-500">
        Đang kết nối backend...
      </p>
    </div>
  );
}