"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );

    const observeReveals = (root: ParentNode) => {
      if (root instanceof Element && root.matches(".reveal-on-scroll")) {
        observer.observe(root);
      }
      root.querySelectorAll(".reveal-on-scroll").forEach((element) => {
        observer.observe(element);
      });
    };

    document.body.classList.add("reveal-ready");
    observeReveals(document);

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) observeReveals(node);
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      document.body.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
