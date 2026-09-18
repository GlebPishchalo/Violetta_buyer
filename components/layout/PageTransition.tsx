"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import { animationsEnabled } from "@/lib/animations";
import { type ReactNode } from "react";

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const enabled = animationsEnabled();

  return (
    <>
      {enabled ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={reduceMotion ? { opacity: 1, y: 8 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0, y: 8 } : { opacity: 0, y: -4 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.2, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div>{children}</div>
      )}
    </>
  );
}
