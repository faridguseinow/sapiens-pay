"use client";

import { useEffect, useRef, useState } from "react";

type AboutStoryProps = {
  eyebrow: string;
  title: string;
  lead: string;
  paragraphs: string[];
};

export function AboutStory({
  eyebrow,
  title,
  lead,
  paragraphs,
}: AboutStoryProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const total = Math.max(rect.height - viewportHeight * 0.45, 1);
      const value = ((viewportHeight * 0.22 - rect.top) / total) * 100;
      const clamped = Math.min(Math.max(value, 0), 100);

      setProgress(clamped);

      const focusLine = viewportHeight * 0.42;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cardRefs.current.forEach((card, index) => {
        if (!card) {
          return;
        }

        const cardRect = card.getBoundingClientRect();
        const center = cardRect.top + cardRect.height / 2;
        const distance = Math.abs(center - focusLine);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className="section about-story" id="about" ref={sectionRef}>
      <div className="container about-story__inner">
        <div className="about-story__intro">
          <p className="tag">{eyebrow}</p>
          <h2>{title}</h2>
          <p className="about-story__lead">{lead}</p>

          <div className="about-story__rail" aria-hidden="true">
            <span className="about-story__rail-line" />
            <span
              className="about-story__rail-progress"
              style={{ transform: `scaleY(${progress / 100})` }}
            />
          </div>
        </div>

        <div className="about-story__content">
          {paragraphs.map((paragraph, index) => (
            <article
              key={paragraph}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className="about-story__card"
              data-active={index === activeIndex ? "true" : "false"}
            >
              <span className="about-story__step">0{index + 1}</span>
              <p>{paragraph}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
