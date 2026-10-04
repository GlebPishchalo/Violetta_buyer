/**
 * Design tokens — single source of truth for the visual system.
 * Mirrored in tailwind.config.ts under theme.extend.
 */
export const colors = {
  ink: "rgb(var(--color-ink) / <alpha-value>)",
  inkSoft: "rgb(var(--color-ink-soft) / <alpha-value>)",
  gold: "rgb(var(--color-gold) / <alpha-value>)",
  copper: "rgb(var(--color-copper) / <alpha-value>)",
  bone: "rgb(var(--color-bone) / <alpha-value>)",
  ash: "rgb(var(--color-ash) / <alpha-value>)",
  line: "rgb(var(--color-line) / 0.16)",
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
