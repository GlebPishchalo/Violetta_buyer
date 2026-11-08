"use client";

import { useState } from "react";
import Image from "next/image";
import { useFormatter } from "next-intl";
import { ArrowUpRight, CalendarDays, Send } from "lucide-react";

type ProductReviewCardProps = {
  review: {
    title: string;
    description: string;
    images: string[];
    productUrl: string;
    createdAt: string;
  };
  telegramUrl: string;
  viewProductLabel: string;
  telegramLabel: string;
};

export function ProductReviewCard({
  review,
  telegramUrl,
  viewProductLabel,
  telegramLabel,
}: ProductReviewCardProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const image = review.images[selectedImage] ?? review.images[0];
  const format = useFormatter();
  const createdAt = new Date(review.createdAt);

  return (
    <article className="reveal-on-scroll group overflow-hidden rounded-3xl border border-[#347d77]/20 bg-white/55 shadow-xl shadow-[#1c4434]/[0.06] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#347d77]/40 hover:shadow-2xl">
      <div className="grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="flex flex-col bg-[#dff2ef]/60">
          <div className="relative aspect-[4/3] min-h-64 overflow-hidden bg-[#dff2ef] md:aspect-auto md:min-h-[360px] md:flex-1">
            {image ? (
              <Image
                src={image}
                alt={review.title}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            ) : null}
          </div>
          {review.images.length > 1 ? (
            <div className="flex gap-2 overflow-x-auto p-3" aria-label="Фото товара">
              {review.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  aria-label={`Фото ${index + 1}`}
                  aria-pressed={selectedImage === index}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ease-out hover:scale-[1.02] ${
                    selectedImage === index
                      ? "border-[#216e67]"
                      : "border-[#347d77]/25"
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 md:p-10">
          <time
            dateTime={createdAt.toISOString()}
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#527a75]"
          >
            <CalendarDays size={14} aria-hidden="true" />
            {format.dateTime(createdAt, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <h2 className="font-serif text-3xl leading-tight text-[#173e3a] sm:text-4xl">
            {review.title}
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-[#426d68] sm:text-base">
            {review.description}
          </p>
          <div className="flex flex-wrap gap-3 border-t border-[#347d77]/15 pt-5">
            <a
              href={review.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#216e67] px-4 font-sans text-xs font-medium text-white shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#185a54] hover:shadow-lg"
            >
              {viewProductLabel}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#347d77]/25 bg-white/40 px-4 font-sans text-xs text-[#205b56] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#347d77]/50 hover:bg-white/80 hover:shadow-lg"
            >
              <Send size={14} aria-hidden="true" />
              {telegramLabel}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
