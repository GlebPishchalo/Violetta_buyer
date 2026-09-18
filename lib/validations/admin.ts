import { z } from "zod";

export const reviewCreateSchema = z.object({
  name: z.string().trim().min(2).max(50),
  city: z.string().trim().max(50).optional().or(z.literal("")),
  telegram: z.string().trim().max(50).optional().or(z.literal("")),
  text: z.string().trim().min(20).max(2000),
  rating: z.coerce.number().int().min(1).max(5),
  locale: z.enum(["ru", "en"]).default("ru"),
  _gotcha: z.string().optional().or(z.literal("")),
});

export const reviewUpdateSchema = z.object({
  name: z.string().trim().min(2).max(50),
  city: z.string().trim().max(50).optional().nullable(),
  telegram: z.string().trim().max(50).optional().nullable(),
  text: z.string().trim().min(20).max(2000),
  rating: z.coerce.number().int().min(1).max(5),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  locale: z.enum(["ru", "en"]).optional(),
});

export const shopSchema = z.object({
  name: z.string().trim().min(1).max(120),
  url: z.string().trim().url(),
  category: z.enum([
    "luxury",
    "marketplace",
    "shoes",
    "tech",
    "beauty",
    "other",
  ]),
  descriptionRu: z.string().trim().max(500).optional().or(z.literal("")),
  descriptionEn: z.string().trim().max(500).optional().or(z.literal("")),
  image: z.string().trim().optional().or(z.literal("")),
  order: z.coerce.number().int().optional(),
});

export const flightSchema = z.object({
  date: z.string().min(1),
  direction: z.enum(["DXB-MOW", "MOW-DXB"]),
  noteRu: z.string().trim().max(300).optional().or(z.literal("")),
  noteEn: z.string().trim().max(300).optional().or(z.literal("")),
});

export const contentBlockUpdateSchema = z.object({
  key: z.string().min(1),
  valueRu: z.string(),
  valueEn: z.string().nullable().optional(),
});

export const contentBlocksSchema = z.array(contentBlockUpdateSchema).min(1);

export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
export type ReviewUpdateInput = z.infer<typeof reviewUpdateSchema>;
export type ShopInput = z.infer<typeof shopSchema>;
export type FlightInput = z.infer<typeof flightSchema>;
