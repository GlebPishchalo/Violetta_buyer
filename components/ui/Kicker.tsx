import { type ReactNode } from "react";

type KickerProps = {
  children: ReactNode;
  className?: string;
};

export function Kicker({ children, className = "" }: KickerProps) {
  return (
    <p
      className={`font-mono text-xs uppercase tracking-[0.2em] text-ash ${className}`.trim()}
    >
      {children}
    </p>
  );
}
