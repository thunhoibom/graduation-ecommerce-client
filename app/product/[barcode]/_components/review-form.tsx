"use client";

import { useState, useRef } from "react";
import { Star, Camera, X, CheckCircle, SpinnerGap } from "@phosphor-icons/react";
import { toast } from "sonner";
import Image from "next/image";
import { uploadImage } from "@/services/rest-api/media";
import { submitProductReview } from "@/services/rest-api/products/products";

interface ReviewFormProps {
  productBarcode: string;
  productName: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function ReviewForm({ productBarcode, productName, onSuccess, onClose }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<{ id: number; url: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      toast.error("Bạn chỉ có thể tải lên tối đa 5 ảnh.");
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadImage(file));
      const uploadedImages = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedImages]);
      toast.success(`Đã tải lên ${files.length} ảnh`);
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Tải ảnh lên thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (id: number) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Vui lòng chọn mức điểm đánh giá (sao).");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitProductReview({
        productBarcode,
        rating,
        title: title.trim(),
        body: body.trim(),
        imageIds: images.map((img) => img.id).filter(id => id != null),
      });

      toast.success("Đánh giá của bạn đã được gửi và đang chờ kiểm duyệt.");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error: any) {
      toast.error(error.message || "Gửi đánh giá thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-neutral-100 dark:border-neutral-800 shadow-2xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Viết đánh giá</h3>
          <p className="text-sm text-neutral-500 mt-1">{productName}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-widest text-neutral-400">Chất lượng sản phẩm</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={32}
                  weight={(hoverRating || rating) >= star ? "fill" : "regular"}
                  className={(hoverRating || rating) >= star ? "text-yellow-400" : "text-neutral-300 dark:text-neutral-700"}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-neutral-400">Tiêu đề (Tùy chọn)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tóm tắt trải nghiệm của bạn..."
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-sm"
          />
        </div>

        {/* Body */}
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-neutral-400">Nội dung đánh giá</label>
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="Chia sẻ thêm về chất liệu, form dáng, màu sắc..."
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-sm resize-none"
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <label className="text-sm font-bold uppercase tracking-widest text-neutral-400">Ảnh thực tế</label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, index) => (
              <div key={`${img.id}-${index}`} className="relative aspect-square w-20 rounded-xl overflow-hidden group">
                <Image src={img.url} alt="Review upload" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            ))}
            
            {images.length < 5 && (
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square w-20 rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center gap-1 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50"
              >
                {isUploading ? <SpinnerGap size={20} className="animate-spin" /> : <Camera size={24} />}
                <span className="text-[10px] font-bold">Thêm ảnh</span>
              </button>
            )}
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <p className="text-[10px] text-neutral-500 italic">Lên đến 5 ảnh, định dạng JPG, PNG.</p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full bg-black text-white dark:bg-white dark:text-black py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <SpinnerGap size={20} className="animate-spin" />
            ) : (
              <>
                <CheckCircle size={20} weight="fill" />
                Gửi đánh giá ngay
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
