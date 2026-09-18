import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "link";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
  href?: never;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-ink hover:bg-copper px-5 py-2.5 font-sans text-sm font-medium tracking-wide transition-colors",
  ghost:
    "border border-line bg-transparent text-bone hover:border-gold hover:text-gold px-5 py-2.5 font-sans text-sm tracking-wide transition-colors",
  link: "bg-transparent p-0 text-gold hover:text-copper font-sans text-sm tracking-wide underline-offset-4 hover:underline transition-colors",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${variantClasses[variant]} disabled:cursor-not-allowed disabled:opacity-50 ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
