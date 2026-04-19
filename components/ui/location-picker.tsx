"use client";

import dynamic from "next/dynamic";

const LocationPickerMap = dynamic(() => import("@/components/ui/location-picker-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-none flex items-center justify-center">
      <span className="text-neutral-500">Đang tải bản đồ...</span>
    </div>
  ),
});

export function LocationPicker(props: any) {
  return <LocationPickerMap {...props} />;
}
