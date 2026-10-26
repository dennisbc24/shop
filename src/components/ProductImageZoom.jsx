"use client";
import { useRef, useState } from "react";

const MAX_SCALE = 2;

export default function ProductImageZoom({ src, alt }) {
  const imgRef = useRef(null);
  const baseRect = useRef(null);
  const downPos = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const setOriginFromEvent = (e) => {
    const rect = baseRect.current || imgRef.current?.getBoundingClientRect();
    if (!rect || !rect.width || !rect.height) return;
    const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
    setOrigin({ x, y });
  };

  const handlePointerEnter = (e) => {
    if (e.pointerType !== "mouse") return;
    baseRect.current = imgRef.current?.getBoundingClientRect() ?? null;
    setOriginFromEvent(e);
    setZoomed(true);
  };

  const handlePointerMove = (e) => {
    if (e.pointerType !== "mouse" || !zoomed) return;
    setOriginFromEvent(e);
  };

  const handlePointerLeave = (e) => {
    if (e.pointerType !== "mouse") return;
    setZoomed(false);
    setOrigin({ x: 50, y: 50 });
  };

  const handlePointerDown = (e) => {
    if (e.pointerType === "mouse") return;
    downPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    if (e.pointerType === "mouse") return;
    const start = downPos.current;
    downPos.current = null;
    // si fue un scroll/arrastre, no alternar el zoom
    if (!start || Math.hypot(e.clientX - start.x, e.clientY - start.y) > 10) return;
    if (!zoomed) {
      baseRect.current = imgRef.current?.getBoundingClientRect() ?? null;
      setOriginFromEvent(e);
    }
    setZoomed((z) => !z);
  };

  return (
    <div
      className="relative overflow-hidden bg-white rounded-2xl p-4 border border-zinc-200 flex items-center justify-center min-h-[420px] cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
      style={{ touchAction: "manipulation" }}
      role="button"
      tabIndex={0}
      aria-label={zoomed ? "Reducir imagen" : "Ampliar imagen"}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        downPos.current = null;
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setZoomed((z) => !z);
        }
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        className="max-w-full max-h-[380px] w-auto h-auto object-contain bg-zinc-50 rounded-xl transition-transform duration-200 ease-out select-none"
        style={{
          transform: `scale(${zoomed ? MAX_SCALE : 1})`,
          transformOrigin: `${origin.x}% ${origin.y}%`,
        }}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/window.svg";
        }}
      />

      <span className="pointer-events-none absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-600 shadow-sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
        Zoom
      </span>

      <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-zinc-500 shadow-sm sm:hidden">
        {zoomed ? "Toca para cerrar" : "Toca para ampliar"}
      </span>
    </div>
  );
}
