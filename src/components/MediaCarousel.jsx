import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl, handleImageError } from "../utils/image";

const AUTO_ADVANCE_MS = 4500;

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".ogg"];

function isVideoUrl(url) {
  if (!url || typeof url !== "string") return false;
  const lower = url.split("?")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/** Normaliza ítems a { url, type, caption? } con url absoluta si hace falta. */
export function normalizeCarouselItems(items, baseUrl = "") {
  if (!items?.length) return [];
  return items.map((item) => {
    const entry = typeof item === "string" ? { url: item, type: null } : item;
    let url = entry.url || entry;
    if (typeof url !== "string") return null;
    if (baseUrl && url.startsWith("/") && !url.startsWith("//")) {
      url = `${baseUrl.replace(/\/$/, "")}${url}`;
    }
    const type = entry.type || (isVideoUrl(url) ? "video" : "image");
    return { url, type, caption: entry.caption || null };
  }).filter(Boolean);
}

export default function MediaCarousel({ items, alt = "", className = "", style = {} }) {
  const [index, setIndex] = useState(0);

  const total = items.length;
  const hasMultiple = total > 1;

  const goTo = useCallback((nextIndex) => {
    if (total < 1) return;
    setIndex((nextIndex % total + total) % total);
  }, [total]);

  const goNext = useCallback(() => goTo(index + 1), [index, goTo]);
  const goPrev = useCallback(() => goTo(index - 1), [index, goTo]);

  useEffect(() => {
    if (!hasMultiple) return;
    const id = setInterval(goNext, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [hasMultiple, goNext]);

  if (!total) {
    return (
      <div className={`rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center ${className}`} style={{ minHeight: 176, ...style }}>
        <span className="text-sm text-gray-500">Sin medios</span>
      </div>
    );
  }

  return (
    <div className={`rounded-xl overflow-hidden relative ${className}`} style={style}>
      <div className="relative w-full h-44 overflow-hidden bg-gray-100">
        {items.map((item, i) => (
          <div
            key={`${item.url}-${i}`}
            className="absolute inset-0 w-full h-full transition-transform duration-[450ms] ease-out"
            style={{
              transform: `translateX(${(i - index) * 100}%)`,
            }}
          >
            {item.type === "video" ? (
              <video
                src={item.url}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay={i === index}
                controls={false}
              />
            ) : (
              <img
                src={getImageUrl({ image: item.url })}
                alt={alt && i === index ? alt : ""}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, `carrusel ${alt}`)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Caption del ítem actual (mensaje personalizado por LLM desde Telegram) */}
      {total > 0 && items[index]?.caption && (
        <div
          className="absolute left-0 right-0 bottom-10 px-3 py-1.5 z-10 text-center text-xs text-white"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
            textShadow: "0 0 4px rgba(0,0,0,0.8)",
          }}
        >
          {items[index].caption}
        </div>
      )}
      {/* Barra inferior del carrusel: siempre visible para que se identifique como galería */}
      {total > 0 && (
        <div
          className="absolute bottom-0 left-0 right-0 py-2 flex items-center justify-center gap-2 z-10"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
          }}
        >
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={() => goPrev()}
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: "rgba(255,255,255,0.95)", color: "#1a1a1a" }}
                aria-label="Anterior"
              >
                <ChevronLeft size={20} />
              </button>
            </>
          )}
          <div className="flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className="rounded-full transition-all border-2 border-white shadow"
                style={{
                  width: i === index ? 10 : 8,
                  height: i === index ? 10 : 8,
                  minWidth: i === index ? 10 : 8,
                  minHeight: i === index ? 10 : 8,
                  background: i === index ? "#86bb4a" : "rgba(255,255,255,0.8)",
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          {hasMultiple && (
            <button
              type="button"
              onClick={() => goNext()}
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: "rgba(255,255,255,0.95)", color: "#1a1a1a" }}
              aria-label="Siguiente"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
