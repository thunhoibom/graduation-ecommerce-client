"use client";

import { useState } from "react";
import { ReviewForm } from "./review-form";
import { PencilSimple } from "@phosphor-icons/react";

interface WriteReviewButtonProps {
  barcode: string;
  productName: string;
}

export function WriteReviewButton({ barcode, productName }: WriteReviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold transition-transform hover:scale-105 active:scale-95 dark:bg-white dark:text-black"
      >
        <PencilSimple size={18} />
        Viết đánh giá
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl transform transition-all animate-in zoom-in-95 duration-300">
             <ReviewForm 
                productBarcode={barcode} 
                productName={productName}
                onClose={() => setIsOpen(false)}
                onSuccess={() => {
                  setIsOpen(false);
                  // Optionally refresh the page or update local state
                  window.location.reload(); 
                }}
             />
          </div>
        </div>
      )}
    </>
  );
}
