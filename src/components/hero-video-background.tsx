"use client";

import { useEffect, useRef } from "react";

export function HeroVideoBackground({ src = "/generate_it.mp4" }: { src?: string }) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    let frame = 0;

    function updateFromScroll() {
      if (!layer) return;
      const rect = layer.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, rect.top / Math.max(1, window.innerHeight)));
      layer.style.setProperty("--hero-scroll", String(progress));
    }

    function onScroll() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateFromScroll);
    }

    function onPointerMove(event: PointerEvent) {
      if (!layer) return;
      const rect = layer.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      const y = (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
      layer.style.setProperty("--hero-x", String(x));
      layer.style.setProperty("--hero-y", String(y));
    }

    function onPointerLeave() {
      if (!layer) return;
      layer.style.setProperty("--hero-x", "0");
      layer.style.setProperty("--hero-y", "0");
    }

    updateFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    layer.addEventListener("pointermove", onPointerMove);
    layer.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      layer.removeEventListener("pointermove", onPointerMove);
      layer.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      className="absolute inset-0 overflow-hidden [--hero-scroll:0] [--hero-x:0] [--hero-y:0]"
      aria-hidden="true"
    >
      <video
        className="h-full w-full object-cover opacity-95 saturate-[1.12] transition-transform duration-300 ease-out [transform:translate3d(calc(var(--hero-x)*20px),calc((var(--hero-y)*16px)+(var(--hero-scroll)*-46px)),0)_scale(1.16)] motion-reduce:transform-none"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,28,58,0.94)_0%,rgba(8,28,58,0.78)_42%,rgba(23,104,179,0.4)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,28,58,0.34)_0%,rgba(8,28,58,0.5)_56%,rgba(8,28,58,0.82)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(242,183,5,0.16)_0%,rgba(242,183,5,0)_32%,rgba(75,183,232,0.12)_100%)] mix-blend-screen" />
    </div>
  );
}
