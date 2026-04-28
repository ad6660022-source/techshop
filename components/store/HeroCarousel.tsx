"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  linkUrl: string | null;
  linkLabel: string | null;
}

interface HeroCarouselProps {
  initialBanners: Banner[];
}

const INTERVAL = 5000;

export function HeroCarousel({ initialBanners }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const banners = initialBanners;
  const total = banners.length;

  const goTo = useCallback((idx: number) => {
    if (animating || total <= 1) return;
    setAnimating(true);
    setCurrent((idx + total) % total);
    setTimeout(() => setAnimating(false), 600);
  }, [animating, total]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setTimeout(next, INTERVAL);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, next, total]);

  if (total === 0) return <FallbackHero />;

  const slide = banners[current];

  return (
    <section className="relative overflow-hidden" style={{ background: "#1a1510" }}>
      {/* Slide */}
      <div key={slide.id} className="relative w-full" style={{ aspectRatio: "1440/560", minHeight: 320, maxHeight: 600 }}>
        {/* Media */}
        {slide.videoUrl ? (
          <video
            src={slide.videoUrl}
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : slide.imageUrl ? (
          <Image
            src={slide.imageUrl}
            alt={slide.title || "Баннер"}
            fill
            className={`object-cover transition-opacity duration-600 ${animating ? "opacity-0" : "opacity-100"}`}
            priority
            sizes="100vw"
          />
        ) : null}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />

        {/* Content */}
        {(slide.title || slide.subtitle || slide.linkUrl) && (
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 md:px-10 w-full">
              <div className="max-w-lg">
                {slide.title && (
                  <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3 drop-shadow-lg">
                    {slide.title}
                  </h2>
                )}
                {slide.subtitle && (
                  <p className="text-base md:text-lg mb-6 leading-relaxed" style={{ color: "#d8c8a0" }}>
                    {slide.subtitle}
                  </p>
                )}
                {slide.linkUrl && (
                  <Link
                    href={slide.linkUrl}
                    className="inline-flex items-center gap-2 h-11 px-6 font-bold rounded-xl text-white text-[14px] transition-all shadow-lg"
                    style={{ background: "#c4882a" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#a87020"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#c4882a"}
                  >
                    {slide.linkLabel || "Подробнее"}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Arrows */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center transition-all border border-white/20"
              aria-label="Назад"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center transition-all border border-white/20"
              aria-label="Вперёд"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {total > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                background: i === current ? "#c4882a" : "rgba(255,255,255,0.45)",
              }}
              aria-label={`Слайд ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// Fallback when no banners are configured
function FallbackHero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 px-4" style={{ background: "#1a1510" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 60% 50%, rgba(196,136,42,0.12) 0%, transparent 70%)" }} />
      <div className="relative max-w-7xl mx-auto">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-6xl font-black leading-tight text-white mb-5">
            Техника, <span style={{ color: "#c4882a" }}>которая</span><br />
            <span style={{ color: "#c4882a" }}>работает</span>
          </h1>
          <p className="text-[16px] mb-8 leading-relaxed" style={{ color: "#9a8060" }}>
            Смартфоны, ноутбуки, наушники от ведущих брендов. Заказ через мессенджер.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/catalog" className="inline-flex items-center gap-2 h-12 px-6 font-bold rounded-xl text-white text-[15px] transition-all shadow-lg"
              style={{ background: "#c4882a" }}>
              Перейти в каталог <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/catalog?featured=true" className="inline-flex items-center gap-2 h-12 px-6 font-semibold rounded-xl text-[15px] border border-white/15 transition-all"
              style={{ background: "rgba(255,255,255,0.06)", color: "#d8c8a0" }}>
              Хиты продаж
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
