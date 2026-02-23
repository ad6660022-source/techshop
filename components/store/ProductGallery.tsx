"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: { id: string; url: string; alt: string | null }[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [current, setCurrent] = useState(0);

  const displayImages =
    images.length > 0
      ? images
      : [{ id: "placeholder", url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800", alt: productName }];

  const prev = () => setCurrent((c) => (c === 0 ? displayImages.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === displayImages.length - 1 ? 0 : c + 1));

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden group">
        <Image
          src={displayImages[current].url}
          alt={displayImages[current].alt || productName}
          fill
          className="object-contain p-6 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 shadow-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 shadow-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setCurrent(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                idx === current ? "border-blue-600" : "border-gray-100 hover:border-gray-300"
              }`}
            >
              <div className="relative w-full h-full bg-gray-50">
                <Image
                  src={img.url}
                  alt={img.alt || productName}
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
