export function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 border border-dashed border-line px-6 py-16 text-center">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        stroke="#8A8A93"
        strokeWidth="1.25"
        aria-hidden
      >
        <rect x="6" y="8" width="20" height="16" rx="1" />
        <path d="M10 14h12M10 18h8" />
      </svg>
      <p className="font-sans text-sm text-ash">{text}</p>
    </div>
  );
}
