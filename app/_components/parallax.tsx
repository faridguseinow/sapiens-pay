"use client";

import { useEffect } from "react";

export function Parallax() {
  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]")
    );

    let raf = 0;
    let currentY = window.scrollY;
    let targetY = window.scrollY;

    const tick = () => {
      targetY = window.scrollY;
      currentY += (targetY - currentY) * 0.08;

      for (const item of items) {
        const speed = Number(item.dataset.speed ?? "0");
        const y = currentY * speed;
        item.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
