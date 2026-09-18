import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

const components: Components = {
  h2: ({ children }) => (
    <h3 className="mt-8 font-serif text-xl text-bone first:mt-0">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="mt-6 font-serif text-lg text-bone">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="mt-3 font-sans text-sm leading-relaxed text-ash md:text-base">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mt-3 list-disc space-y-2 pl-5 font-sans text-sm text-ash">
      {children}
    </ul>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-medium text-bone">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-gold underline-offset-4 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

type TermsMarkdownProps = {
  content: string;
};

export function TermsMarkdown({ content }: TermsMarkdownProps) {
  return (
    <div className="max-w-2xl">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
