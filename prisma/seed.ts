import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const contentBlocks = [
  {
    key: "hero_kicker",
    valueRu: "Personal Buyer · Dubai",
    valueEn: "Personal Buyer · Dubai",
  },
  {
    key: "hero_title",
    valueRu: "Покупаю в Дубае то, что вы не найдёте в Москве",
    valueEn: "I buy in Dubai what you won't find in Moscow",
  },
  {
    key: "hero_subtitle",
    valueRu:
      "Стабильные вылеты, выкуп из любых магазинов ОАЭ, передача посылок в обе стороны.",
    valueEn:
      "Regular flights, purchases from any UAE store, parcel handoff both ways.",
  },
  {
    key: "telegram_url",
    valueRu: "https://t.me/PLACEHOLDER",
    valueEn: "https://t.me/PLACEHOLDER",
  },
  {
    key: "service_1_title",
    valueRu: "Стабильные вылеты",
    valueEn: "Regular flights",
  },
  {
    key: "service_1_body",
    valueRu: "Дважды в месяц. Расписание — в разделе вылетов.",
    valueEn: "Twice a month. Schedule is in the flights section.",
  },
  {
    key: "service_2_title",
    valueRu: "Выкуп товара",
    valueEn: "Product purchase",
  },
  {
    key: "service_2_body",
    valueRu: "Аванс 50% или полная предоплата. Официальные чеки.",
    valueEn: "50% deposit or full prepayment. Official receipts.",
  },
  {
    key: "service_3_title",
    valueRu: "Дубай → Москва",
    valueEn: "Dubai → Moscow",
  },
  {
    key: "service_3_body",
    valueRu: "Передача посылок лично в руки или через курьера.",
    valueEn: "Parcel handoff in person or via courier.",
  },
  {
    key: "service_4_title",
    valueRu: "Москва → Дубай",
    valueEn: "Moscow → Dubai",
  },
  {
    key: "service_4_body",
    valueRu: "Обратное направление для отправки документов и вещей.",
    valueEn: "Reverse direction for documents and personal items.",
  },
  {
    key: "stat_flights",
    valueRu: "12",
    valueEn: "12",
  },
  {
    key: "stat_parcels",
    valueRu: "800",
    valueEn: "800",
  },
  {
    key: "stat_years",
    valueRu: "5",
    valueEn: "5",
  },
  {
    key: "terms_body",
    valueRu: `## Оплата
Аванс 50% или полная предоплата до выкупа. Официальные чеки магазинов ОАЭ.

## Сроки
Вылеты примерно дважды в месяц. Точная дата — в разделе расписания и в Telegram.

## Передача
Лично в Москве или через курьера. Обратное направление — документы и личные вещи.

## Ограничения
Не беру товары, запрещённые к провозу. Перед заказом уточняю наличие и размер.`,
    valueEn: `## Payment
50% deposit or full prepayment before purchase. Official UAE store receipts.

## Timing
Flights about twice a month. Exact dates are in the schedule section and on Telegram.

## Handoff
In person in Moscow or via courier. Reverse direction — documents and personal items.

## Limits
I do not carry restricted goods. Availability and size are confirmed before order.`,
  },
] as const;

const shops = [
  {
    name: "Farfetch",
    url: "https://www.farfetch.com",
    category: "luxury",
    descriptionRu: "Люксовый маркетплейс: одежда, обувь, аксессуары.",
    descriptionEn: "Luxury marketplace: clothing, shoes, accessories.",
    image: "/images/shop-placeholder.jpg",
    order: 1,
  },
  {
    name: "Amazon.ae",
    url: "https://www.amazon.ae",
    category: "marketplace",
    descriptionRu: "Крупнейший маркетплейс ОАЭ — от техники до косметики.",
    descriptionEn: "UAE's largest marketplace — from tech to beauty.",
    image: "/images/shop-placeholder.jpg",
    order: 2,
  },
  {
    name: "Namshi",
    url: "https://www.namshi.com",
    category: "marketplace",
    descriptionRu: "Мода и lifestyle с быстрой доставкой по Эмиратам.",
    descriptionEn: "Fashion and lifestyle with fast UAE delivery.",
    image: "/images/shop-placeholder.jpg",
    order: 3,
  },
  {
    name: "Ounass",
    url: "https://www.ounass.ae",
    category: "luxury",
    descriptionRu: "Премиальный ритейлер: дизайнерские бренды и эксклюзивы.",
    descriptionEn: "Premium retailer: designer brands and exclusives.",
    image: "/images/shop-placeholder.jpg",
    order: 4,
  },
  {
    name: "Level Shoes",
    url: "https://www.levelshoes.com",
    category: "shoes",
    descriptionRu: "Обувной концепт-стор в Dubai Mall.",
    descriptionEn: "Footwear concept store in Dubai Mall.",
    image: "/images/shop-placeholder.jpg",
    order: 5,
  },
  {
    name: "Bloomingdale's",
    url: "https://www.bloomingdales.ae",
    category: "other",
    descriptionRu: "Универмаг с мировыми брендами в Дубае.",
    descriptionEn: "Department store with global brands in Dubai.",
    image: "/images/shop-placeholder.jpg",
    order: 6,
  },
] as const;

const reviews = [
  {
    name: "Анна",
    city: "Москва",
    text: "Заказала сумку с Ounass — всё прозрачно, чек прислали сразу. Передача в Москве без задержек.",
    rating: 5,
    status: "approved",
    locale: "ru",
  },
  {
    name: "Дмитрий",
    city: "Санкт-Петербург",
    text: "Выкуп техники с Amazon.ae. Сроки совпали с расписанием вылета, упаковка аккуратная.",
    rating: 5,
    status: "approved",
    locale: "ru",
  },
  {
    name: "Мария",
    city: "Москва",
    text: "Отправила документы в Дубай обратным рейсом. Всё дошло целым, связь в Telegram отличная.",
    rating: 5,
    status: "approved",
    locale: "ru",
  },
  {
    name: "Elena",
    city: "Dubai",
    text: "Reliable handoff both ways. Clear communication and honest timing on flights.",
    rating: 5,
    status: "approved",
    locale: "en",
  },
  {
    name: "Игорь",
    city: "Казань",
    text: "Первый раз пользовался байером — объяснили условия, аванс, передачу. Без сюрпризов.",
    rating: 4,
    status: "approved",
    locale: "ru",
  },
  {
    name: "Ольга",
    city: "Москва",
    text: "Несколько заказов с Farfetch и Level Shoes. Удобно, что можно копить к одному вылету.",
    rating: 5,
    status: "approved",
    locale: "ru",
  },
] as const;

async function main() {
  console.log("Seeding ContentBlock…");
  for (const block of contentBlocks) {
    await prisma.contentBlock.upsert({
      where: { key: block.key },
      update: {
        valueRu: block.valueRu,
        valueEn: block.valueEn,
      },
      create: {
        key: block.key,
        valueRu: block.valueRu,
        valueEn: block.valueEn,
      },
    });
  }

  console.log("Seeding Shop…");
  const existingShops = await prisma.shop.count();
  if (existingShops === 0) {
    await prisma.shop.createMany({
      data: shops.map((shop) => ({ ...shop })),
    });
  } else {
    console.log(`Shops already present (${existingShops}), skipping.`);
  }

  console.log("Seeding Admin…");
  const passwordHash = await hash("Violetta1@pass", 12);
  await prisma.admin.upsert({
    where: { login: "admin" },
    update: { passwordHash },
    create: {
      login: "admin",
      passwordHash,
    },
  });

  console.log("Seeding Reviews…");
  const existingReviews = await prisma.review.count();
  if (existingReviews === 0) {
    await prisma.review.createMany({
      data: reviews.map((review) => ({ ...review })),
    });
  }

  console.log("Seeding Flights…");
  const existingFlights = await prisma.flight.count();
  if (existingFlights === 0) {
    const now = new Date();
    await prisma.flight.createMany({
      data: [
        {
          date: new Date(now.getFullYear(), now.getMonth() + 1, 5),
          direction: "DXB-MOW",
          noteRu: "Приём посылок до 1 числа",
          noteEn: "Parcels accepted until the 1st",
        },
        {
          date: new Date(now.getFullYear(), now.getMonth() + 1, 18),
          direction: "MOW-DXB",
          noteRu: "Документы и личные вещи",
          noteEn: "Documents and personal items",
        },
        {
          date: new Date(now.getFullYear(), now.getMonth() + 2, 8),
          direction: "DXB-MOW",
          noteRu: "Стандартный вылет",
          noteEn: "Regular flight",
        },
      ],
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
