/**
 * Design tokens — single source of truth for the visual system.
 * Mirrored in tailwind.config.ts under theme.extend.
 */
export const colors = {
  ink: "#0B0B0F",
  inkSoft: "#111114",
  gold: "#C9A227",
  copper: "#B87333",
  bone: "#EDEDED",
  ash: "#8A8A93",
  line: "rgba(255,255,255,0.06)",
} as const;

export const fonts = {
  serif: "var(--font-serif)",
  sans: "var(--font-sans)",
  mono: "var(--font-mono)",
} as const;

export const tokens = {
  colors,
  fonts,
} as const;

export type ColorToken = keyof typeof colors;
export type FontToken = keyof typeof fonts;
