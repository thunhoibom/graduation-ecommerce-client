import { api } from "../app-api";

export interface ImagePojo {
  id: number;
  code: string;
  filename: string;
  url: string;
  altText?: string;
}

/**
 * Upload an image to the backend.
 * Uses multipart/form-data.
 */
export async function uploadImage(file: File): Promise<ImagePojo> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<ImagePojo>("/api/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}
