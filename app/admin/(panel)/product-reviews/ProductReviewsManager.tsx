"use client";

import { useState, useTransition, type FormEvent } from "react";
import Image from "next/image";
import { ExternalLink, ImagePlus, Pencil, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import {
  createProductReview,
  deleteProductReview,
  updateProductReview,
} from "./actions";

export type AdminProductReview = {
  id: string;
  title: string;
  descriptionRu: string;
  descriptionEn: string | null;
  image: string;
  images: string[];
  productUrl: string;
  order: number;
};

type FormValues = {
  title: string;
  descriptionRu: string;
  descriptionEn: string;
  images: string[];
  productUrl: string;
  order: string;
};

type ProductReviewsManagerProps = {
  productReviews: AdminProductReview[];
};

const emptyForm: FormValues = {
  title: "",
  descriptionRu: "",
  descriptionEn: "",
  images: [],
  productUrl: "",
  order: "",
};

const inputClass =
  "w-full border border-line bg-ink-soft px-3 py-2 font-sans text-sm text-bone focus:border-gold";

export function ProductReviewsManager({
  productReviews,
}: ProductReviewsManagerProps) {
  const [items, setItems] = useState(productReviews);
  const [editing, setEditing] = useState<AdminProductReview | null>(null);
  const [deleting, setDeleting] = useState<AdminProductReview | null>(null);
  const [values, setValues] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  function startCreate() {
    setEditing(null);
    setValues(emptyForm);
  }

  function startEdit(item: AdminProductReview) {
    setEditing(item);
    setValues({
      title: item.title,
      descriptionRu: item.descriptionRu,
      descriptionEn: item.descriptionEn ?? "",
      images: item.images.length > 0 ? item.images : [item.image],
      productUrl: item.productUrl,
      order: String(item.order),
    });
  }

  function setField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function uploadFiles(files: File[]) {
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/upload", {
          method: "POST",
          body,
          credentials: "same-origin",
        });
        const data = (await response.json().catch(() => ({}))) as {
          url?: string;
          error?: string;
        };
        if (!response.ok || !data.url) {
          toast.error(data.error ?? "Не удалось загрузить изображение");
          break;
        }
        uploaded.push(data.url);
      }
      if (uploaded.length > 0) {
        setValues((current) => ({
          ...current,
          images: [...current.images, ...uploaded].slice(0, 20),
        }));
        toast.success(
          uploaded.length === 1
            ? "Изображение загружено"
            : `Загружено изображений: ${uploaded.length}`
        );
      }
    } catch {
      toast.error("Ошибка сети при загрузке");
    } finally {
      setUploading(false);
    }
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = {
      ...values,
      order: values.order.trim() ? Number(values.order) : undefined,
    };
    startTransition(async () => {
      try {
        const result = editing
          ? await updateProductReview(editing.id, data)
          : await createProductReview(data);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }

        const saved: AdminProductReview = {
          id: result.productReview.id,
          title: result.productReview.title,
          descriptionRu: result.productReview.descriptionRu,
          descriptionEn: result.productReview.descriptionEn,
          image: result.productReview.image,
          images: result.productReview.images,
          productUrl: result.productReview.productUrl,
          order: result.productReview.order,
        };
        setItems((current) =>
          editing
            ? current.map((item) => (item.id === saved.id ? saved : item))
            : [...current, saved]
        );
        setEditing(null);
        setValues(emptyForm);
        toast.success(editing ? "Обзор обновлён" : "Обзор добавлен");
      } catch (error) {
        console.error("saveProductReview failed", error);
        toast.error("Ошибка сервера при сохранении");
      }
    });
  }

  function confirmDelete() {
    if (!deleting) return;
    const item = deleting;
    startTransition(async () => {
      try {
        await deleteProductReview(item.id);
        setItems((current) => current.filter((entry) => entry.id !== item.id));
        setDeleting(null);
        toast.success("Обзор удалён");
      } catch (error) {
        console.error("deleteProductReview failed", error);
        toast.error("Ошибка удаления");
      }
    });
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={save}
        className="space-y-5 border border-line bg-ink p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl text-bone">
            {editing ? "Изменить обзор" : "Добавить обзор"}
          </h2>
          {editing ? (
            <Button type="button" variant="ghost" onClick={startCreate}>
              Отмена
            </Button>
          ) : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Название товара *">
            <input
              className={inputClass}
              value={values.title}
              onChange={(event) => setField("title", event.target.value)}
              maxLength={120}
              required
            />
          </Field>
          <Field label="Ссылка на товар *">
            <input
              type="url"
              className={inputClass}
              value={values.productUrl}
              onChange={(event) => setField("productUrl", event.target.value)}
              required
            />
          </Field>
          <Field label="Описание RU *">
            <textarea
              className={`${inputClass} min-h-28`}
              value={values.descriptionRu}
              onChange={(event) => setField("descriptionRu", event.target.value)}
              maxLength={2000}
              required
            />
          </Field>
          <Field label="Описание EN">
            <textarea
              className={`${inputClass} min-h-28`}
              value={values.descriptionEn}
              onChange={(event) => setField("descriptionEn", event.target.value)}
              maxLength={2000}
            />
          </Field>
          <Field label="Порядок отображения">
            <input
              type="number"
              className={inputClass}
              value={values.order}
              onChange={(event) => setField("order", event.target.value)}
              step={1}
            />
          </Field>
          <Field label="Фото товара *">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={uploading || values.images.length >= 20}
              className="block w-full font-sans text-sm text-ash file:mr-3 file:cursor-pointer file:border-0 file:bg-gold file:px-3 file:py-2 file:font-sans file:text-xs file:text-ink hover:file:bg-gold-light disabled:opacity-50"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                const remaining = 20 - values.images.length;
                if (files.length > remaining) {
                  toast.error(`Можно добавить не более 20 фото`);
                }
                if (files.length > 0) void uploadFiles(files.slice(0, remaining));
                event.currentTarget.value = "";
              }}
            />
            <span className="text-xs text-ash">
              JPEG, PNG или WebP, до 5 МБ каждое. До 20 фото.
            </span>
            {values.images.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-3">
                {values.images.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative h-24 w-24 overflow-hidden border border-line bg-white"
                  >
                    <Image
                      src={image}
                      alt={`Фото товара ${index + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setValues((current) => ({
                          ...current,
                          images: current.images.filter((_, i) => i !== index),
                        }))
                      }
                      className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center bg-ink text-bone transition-colors hover:bg-copper"
                      aria-label={`Удалить фото ${index + 1}`}
                    >
                      <X size={15} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 flex h-24 w-32 items-center justify-center border border-dashed border-line text-ash">
                <ImagePlus size={22} aria-hidden="true" />
              </div>
            )}
            {uploading ? (
              <span className="inline-flex items-center gap-2 text-xs text-gold" role="status">
                <Upload size={14} aria-hidden="true" /> Загрузка изображения…
              </span>
            ) : null}
          </Field>
        </div>
        <Button type="submit" disabled={pending || uploading}>
          Сохранить обзор
        </Button>
      </form>

      {items.length === 0 ? (
        <EmptyState text="Пока нет обзоров товаров" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="border border-line bg-ink">
              <div className="relative aspect-[4/3] bg-white/5">
                {item.images[0] || item.image ? (
                  <Image
                    src={item.images[0] ?? item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <ImagePlus className="h-full w-full p-12 text-ash" aria-hidden="true" />
                )}
                {item.images.length > 1 ? (
                  <span className="absolute bottom-2 right-2 bg-ink/80 px-2 py-1 font-mono text-xs text-bone">
                    {item.images.length} фото
                  </span>
                ) : null}
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-xl text-bone">{item.title}</h3>
                  <span className="font-mono text-xs text-ash">
                    #{item.order}
                  </span>
                </div>
                <a
                  href={item.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-full items-center gap-1 text-xs text-ash hover:text-bone"
                >
                  <span className="truncate">{item.productUrl}</span>
                  <ExternalLink size={12} className="shrink-0" aria-hidden="true" />
                </a>
                <p className="line-clamp-3 text-sm text-ash">
                  {item.descriptionRu}
                </p>
                <div className="flex gap-2 border-t border-line pt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => startEdit(item)}
                    disabled={pending}
                    className="inline-flex items-center gap-2"
                  >
                    <Pencil size={14} aria-hidden="true" />
                    Изменить
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setDeleting(item)}
                    disabled={pending}
                    className="inline-flex items-center gap-2 hover:border-copper hover:text-copper"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                    Удалить
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={!!deleting}
        title="Удалить обзор?"
        description={`«${deleting?.title ?? ""}» будет удалён.`}
        confirmLabel="Удалить"
        tone="danger"
        loading={pending}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
        {label}
      </span>
      {children}
    </label>
  );
}
