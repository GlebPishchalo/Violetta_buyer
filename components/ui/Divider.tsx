type DividerProps = {
  variant?: "line" | "diamond";
  className?: string;
};

export function Divider({ variant = "line", className = "" }: DividerProps) {
  if (variant === "diamond") {
    return (
      <div
        className={`flex items-center justify-center py-10 ${className}`.trim()}
        aria-hidden
      >
        <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
      </div>
    );
  }

  return (
    <div
      className={`mx-auto h-px w-full max-w-6xl bg-line ${className}`.trim()}
      aria-hidden
    />
  );
}
