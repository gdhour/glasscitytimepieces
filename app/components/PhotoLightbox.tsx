"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

type PhotoLightboxProps = {
  photos: readonly Photo[];
  initialIndex?: number;
  onClose: () => void;
};

export function PhotoLightbox({ photos, initialIndex = 0, onClose }: PhotoLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  const prev = useCallback(() => setIndex((i) => (i - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % photos.length), [photos.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const photo = photos[index];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        aria-label="Close"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Prev */}
      {photos.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          aria-label="Previous photo"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="max-h-[90vh] max-w-[90vw] object-contain"
          sizes="90vw"
          priority
        />
      </div>

      {/* Next */}
      {photos.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          aria-label="Next photo"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Counter */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white/70">
          {index + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}

type ClickablePhotoProps = {
  photo: Photo;
  photos: readonly Photo[];
  index: number;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
};

export function ClickablePhoto({
  photo,
  photos,
  index,
  className = "",
  imageClassName = "",
  sizes = "100vw",
  priority = false,
}: ClickablePhotoProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className={`group cursor-zoom-in ${className}`}
        aria-label={`View ${photo.alt}`}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className={`${imageClassName} transition-transform duration-700 group-hover:scale-[1.02]`}
          sizes={sizes}
          priority={priority}
        />
      </button>
      {lightboxOpen && (
        <PhotoLightbox
          photos={photos}
          initialIndex={index}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
