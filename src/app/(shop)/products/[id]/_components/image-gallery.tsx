'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ImagePojo } from 'src/services/rest-api/app-api/types';

interface ImageGalleryProps {
  images: ImagePojo[];
  productName: string;
  primaryImage?: ImagePojo;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-square overflow-hidden rounded-md bg-neutral-100">
        <div className="flex h-full items-center justify-center text-neutral-400">
          <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    );
  }

  const currentImage = images[selected]!;

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square overflow-hidden rounded-md bg-neutral-100">
        <Image
          key={currentImage.code}
          src={currentImage.url}
          alt={`${productName} - ${selected + 1}`}
          width={800}
          height={800}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.code}
              onClick={() => setSelected(i)}
              className={`relative flex-shrink-0 overflow-hidden rounded border-2 transition-colors ${
                i === selected
                  ? 'border-neutral-900'
                  : 'border-transparent hover:border-neutral-300'
              }`}
            >
              <Image
                src={img.url}
                alt={`Thumbnail ${i + 1}`}
                width={80}
                height={80}
                className="h-20 w-20 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
