"use client";

import Link from "next/link";
import { useEffect } from "react";

type Props = {
  error: Error;
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // Log to console so user can copy errors during client navigation
    // (This runs in development and in production client navigations.)
    // eslint-disable-next-line no-console
    console.error("GlobalError:", error);
  }, [error]);

  return (
    <html>
      <body className="bg-ink text-bone min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl rounded border border-line bg-ink-soft p-6">
          <h1 className="font-serif text-2xl text-bone mb-2">Ошибка рендеринга</h1>
          <p className="font-sans text-sm text-ash mb-4">
            При навигации произошла ошибка. Обновите страницу или перейдите на
            главную.
          </p>

          <div className="mb-4">
            <button
              onClick={() => reset()}
              className="mr-3 inline-block bg-gold px-3 py-2 font-sans text-sm text-ink"
            >
              Попробовать снова
            </button>
            <Link
              href="/"
              className="inline-block text-sm text-ash underline"
            >
              На главную
            </Link>
          </div>

          {process.env.NODE_ENV !== "production" ? (
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap text-xs font-mono text-ash">
              {String(error?.message)}
              {error?.stack ? `\n\n${error.stack}` : ""}
            </pre>
          ) : null}
        </div>
      </body>
    </html>
  );
}
