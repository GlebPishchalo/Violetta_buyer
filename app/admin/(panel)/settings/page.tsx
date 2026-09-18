import type { Metadata } from "next";
import type { ContentBlock } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Настройки",
};

export default async function AdminSettingsPage() {
  let blocks: ContentBlock[] = [];
  try {
    blocks = await prisma.contentBlock.findMany({ orderBy: { key: "asc" } });
  } catch {
    blocks = [];
  }

  const missingEn = blocks.filter((b) => !b.valueEn?.trim());
  const telegram = blocks.find((b) => b.key === "telegram_url");

  return (
    <div className="space-y-10">
      <section className="space-y-3 border border-line bg-ink p-6">
        <h2 className="font-serif text-2xl text-bone">Telegram</h2>
        <p className="font-sans text-sm text-ash">
          Текущий URL:{" "}
          <span className="text-bone">
            {telegram?.valueRu ?? "не задан"}
          </span>
        </p>
        <Link
          href="/admin/content"
          className="inline-block font-sans text-sm text-gold hover:underline"
        >
          Редактировать в разделе Контент →
        </Link>
      </section>

      <section className="space-y-4 border border-line bg-ink p-6">
        <h2 className="font-serif text-2xl text-bone">Переводы</h2>
        <p className="font-sans text-sm text-ash">
          ContentBlock без английского перевода:{" "}
          <span className="text-gold">{missingEn.length}</span>
        </p>
        {missingEn.length === 0 ? (
          <p className="font-sans text-sm text-bone">
            Все блоки имеют valueEn.
          </p>
        ) : (
          <ul className="space-y-1">
            {missingEn.map((b) => (
              <li
                key={b.key}
                className="font-mono text-xs text-ash"
              >
                {b.key}
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/admin/content"
          className="inline-block font-sans text-sm text-gold hover:underline"
        >
          Дополнить переводы →
        </Link>
      </section>

      <section className="space-y-3 border border-line bg-ink p-6">
        <h2 className="font-serif text-2xl text-bone">Безопасность</h2>
        <p className="font-sans text-sm leading-relaxed text-ash">
          Чтобы сменить пароль админа:
        </p>
        <ol className="list-decimal space-y-2 pl-5 font-sans text-sm text-ash">
          <li>
            Сгенерируйте хеш:{" "}
            <code className="font-mono text-xs text-bone">
              pnpm hash-password ваш-пароль
            </code>
          </li>
          <li>
            Обновите поле{" "}
            <code className="font-mono text-xs text-bone">passwordHash</code> у
            записи Admin в Prisma Studio (
            <code className="font-mono text-xs text-bone">pnpm db:studio</code>
            ) или через SQL.
          </li>
          <li>Не храните пароль в открытом виде в репозитории.</li>
        </ol>
      </section>

      <section className="space-y-3 border border-line bg-ink p-6">
        <h2 className="font-serif text-2xl text-bone">Деплой</h2>
        <ul className="space-y-2 font-sans text-sm">
          <li>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              Vercel dashboard →
            </a>
          </li>
          <li>
            <a
              href="https://console.neon.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              Neon dashboard →
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
