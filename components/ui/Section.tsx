import { type ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div" | "article";
};

export function Section({
  children,
  className = "",
  id,
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={`mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24 ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
