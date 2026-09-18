# DXB·MOW — Personal Buyer Dubai

Лендинг персонального байера в Дубае. Next.js 14 · Prisma · PostgreSQL · next-intl.

## Стек

- Next.js 14 (App Router) + TypeScript (strict)
- Tailwind CSS + Framer Motion
- Prisma + PostgreSQL
- NextAuth (Credentials)
- next-intl (RU / EN)
- Zod + React Hook Form

## Установка

```bash
pnpm install
cp .env.example .env
```

Заполните `.env`:

| Переменная | Описание |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon / локальный Postgres) |
| `NEXTAUTH_SECRET` | Секрет сессии (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `http://localhost:3000` локально |
| `ADMIN_LOGIN` | Логин админа (по умолчанию `admin`) |

## База данных

```bash
# Применить схему (без миграционных файлов — для старта)
pnpm db:push

# Заполнить ContentBlock, Shop, Admin
pnpm db:seed
```

Админ по умолчанию после seed:

- login: `admin`
- password: `changeme`

Смените пароль перед продакшеном.

## Генерация хеша пароля

```bash
pnpm hash-password your-secure-password
```

Скопируйте вывод в `Admin.passwordHash` (через Prisma Studio или SQL).

## Запуск

```bash
pnpm dev
```

Откройте [http://localhost:3000](http://localhost:3000) — редирект на `/ru`.

- Публичные страницы: `/ru/*`, `/en/*`
- Админка: `/admin` (вне locale, только RU)

## Полезные скрипты

```bash
pnpm db:studio      # Prisma Studio
pnpm db:generate    # prisma generate
pnpm db:migrate     # prisma migrate dev
pnpm lint
pnpm build
```

## Деплой на Vercel + Neon

1. Создайте проект PostgreSQL в [Neon](https://neon.tech).
2. Скопируйте connection string в Vercel → Project → Settings → Environment Variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET` (сгенерируйте новый)
   - `NEXTAUTH_URL` (URL вашего деплоя, например `https://your-app.vercel.app`)
   - `ADMIN_LOGIN`
3. Подключите репозиторий к Vercel и задеплойте.
4. После первого деплоя выполните миграции / push и seed один раз:

```bash
# Локально, указав production DATABASE_URL
pnpm db:push
pnpm db:seed
```

Или добавьте в Vercel Build Command (осторожно с seed в prod):

```bash
prisma generate && prisma db push && next build
```

SQLite на Vercel serverless не использовать — файловая система эфемерна. Только PostgreSQL (Neon / Supabase / Vercel Postgres).

## Структура (кратко)

```
app/
  [locale]/     # публичные страницы (ru/en)
  admin/         # админка вне locale
  api/auth/      # NextAuth
components/
  layout/        # Header, Footer, LocaleSwitcher
  ui/            # Button, Section, Kicker, Grain, Marquee
i18n/            # routing, request, navigation
messages/        # ru.json, en.json
prisma/          # schema + seed
styles/tokens.ts # дизайн-токены
```
