import { type ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  /** Pause animation on hover */
  pauseOnHover?: boolean;
};

export function Marquee({
  children,
  className = "",
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={`overflow-hidden border-y border-line ${className}`.trim()}
    >
      <div
        className={`flex w-max animate-marquee ${
          pauseOnHover ? "hover:[animation-play-state:paused]" : ""
        }`}
      >
        <div className="flex shrink-0 items-center gap-10 px-5 py-4">
          {children}
        </div>
        <div
          className="flex shrink-0 items-center gap-10 px-5 py-4"
          aria-hidden
        >
          {children}
        </div>
      </div>
    </div>
  );
}
