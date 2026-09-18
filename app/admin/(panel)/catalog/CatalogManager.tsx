"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import {
  createShop,
  updateShop,
  deleteShop,
  reorderShops,
} from "./actions";

export type AdminShop = {
  id: string;
  name: string;
  url: string;
  category: string;
  descriptionRu: string | null;
  descriptionEn: string | null;
  image: string | null;
  order: number;
};

const shopFormSchema = z.object({
  name: z.string().min(1, "Укажите название"),
  url: z.string().url("Некорректный URL"),
  category: z.enum([
    "luxury",
    "marketplace",
    "shoes",
    "tech",
    "beauty",
    "other",
  ]),
  descriptionRu: z.string().max(500).optional().or(z.literal("")),
  descriptionEn: z.string().max(500).optional().or(z.literal("")),
  image: z.string().optional().or(z.literal("")),
});

type ShopFormValues = z.infer<typeof shopFormSchema>;

const categories = [
  "luxury",
  "marketplace",
  "shoes",
  "tech",
  "beauty",
  "other",
] as const;

type CatalogManagerProps = {
  shops: AdminShop[];
};

export function CatalogManager({ shops }: CatalogManagerProps) {
  const [items, setItems] = useState(shops);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminShop | null>(null);
  const [deleting, setDeleting] = useState<AdminShop | null>(null);
  const [pending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const ids = useMemo(() => items.map((s) => s.id), [items]);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((s) => s.id === active.id);
    const newIndex = items.findIndex((s) => s.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    startTransition(async () => {
      try {
        await reorderShops(next.map((s) => s.id));
        toast.success("Порядок сохранён");
      } catch {
        toast.error("Не удалось сохранить порядок");
      }
    });
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(shop: AdminShop) {
    setEditing(shop);
    setFormOpen(true);
  }

  function onSaved(shop: AdminShop, mode: "create" | "update") {
    setFormOpen(false);
    setEditing(null);
    if (mode === "create") {
      setItems((prev) => [...prev, shop]);
    } else {
      setItems((prev) => prev.map((s) => (s.id === shop.id ? shop : s)));
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    const id = deleting.id;
    startTransition(async () => {
      setItems((prev) => prev.filter((s) => s.id !== id));
      setDeleting(null);
      try {
        await deleteShop(id);
        toast.success("Магазин удалён");
      } catch {
        toast.error("Ошибка удаления");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openCreate}>Добавить магазин</Button>
      </div>

      {items.length === 0 ? (
        <EmptyState text="Пока нет магазинов в каталоге" />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={ids} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((shop) => (
                <SortableShopCard
                  key={shop.id}
                  shop={shop}
                  onEdit={() => openEdit(shop)}
                  onDelete={() => setDeleting(shop)}
                  disabled={pending}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <ShopFormModal
        open={formOpen}
        shop={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSaved={onSaved}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Удалить магазин?"
        description={`«${deleting?.name ?? ""}» будет удалён из каталога.`}
        confirmLabel="Удалить"
        tone="danger"
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function SortableShopCard({
  shop,
  onEdit,
  onDelete,
  disabled,
}: {
  shop: AdminShop;
  onEdit: () => void;
  onDelete: () => void;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: shop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className="border border-line bg-ink transition-colors hover:bg-white/[0.02]"
    >
      <div
        className="relative aspect-[4/3] cursor-grab bg-ink-soft active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        {shop.image ? (
          <Image
            src={shop.image}
            alt={shop.name}
            fill
            className="object-cover grayscale"
            sizes="300px"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-ash">
            нет фото
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
          {shop.category}
        </p>
        <h3 className="font-serif text-lg text-bone">{shop.name}</h3>
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            className="text-xs text-gold hover:underline"
            onClick={onEdit}
            disabled={disabled}
          >
            Изменить
          </button>
          <button
            type="button"
            className="text-xs text-copper hover:underline"
            onClick={onDelete}
            disabled={disabled}
          >
            Удалить
          </button>
        </div>
      </div>
    </article>
  );
}

function ShopFormModal({
  open,
  shop,
  onClose,
  onSaved,
}: {
  open: boolean;
  shop: AdminShop | null;
  onClose: () => void;
  onSaved: (shop: AdminShop, mode: "create" | "update") => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    values: {
      name: shop?.name ?? "",
      url: shop?.url ?? "",
      category: (categories.includes(shop?.category as (typeof categories)[number])
        ? shop?.category
        : "other") as ShopFormValues["category"],
      descriptionRu: shop?.descriptionRu ?? "",
      descriptionEn: shop?.descriptionEn ?? "",
      image: shop?.image ?? "",
    },
  });

  const image = watch("image");

  async function uploadFile(file: File) {
    const body = new FormData();
    body.append("file", file);
    let res: Response;
    try {
      res = await fetch("/api/upload", { method: "POST", body, credentials: "same-origin" });
    } catch (err) {
      // network error
      // eslint-disable-next-line no-console
      console.error("uploadFile: fetch failed", err);
      toast.error("Ошибка сети при загрузке");
      return;
    }

    let data: unknown;
    try {
      data = await res.json();
    } catch (err) {
      // non-json response
      // eslint-disable-next-line no-console
      console.error("uploadFile: invalid JSON response", err, await res.text());
      toast.error("Ошибка загрузки: неверный ответ сервера");
      return;
    }

    if (!res.ok) {
      const d = data as { error?: string };
      toast.error(d.error ?? "Ошибка загрузки");
      return;
    }

    const d = data as { url: string };
    setValue("image", d.url, { shouldValidate: true });
    toast.success("Изображение загружено");
  }

  async function onSubmit(values: ShopFormValues) {
    if (shop) {
      let result;
      try {
        result = await updateShop(shop.id, values);
      } catch (err) {
        // server action threw
        // eslint-disable-next-line no-console
        console.error("updateShop threw", err);
        toast.error("Ошибка сервера при сохранении");
        return;
      }

      if (!result?.ok) {
        toast.error(result?.error ?? "Не удалось сохранить");
        return;
      }
      onSaved(
        {
          ...shop,
          ...values,
          descriptionRu: values.descriptionRu || null,
          descriptionEn: values.descriptionEn || null,
          image: values.image || null,
        },
        "update"
      );
      toast.success("Магазин обновлён");
    } else {
      let result;
      try {
        result = await createShop(values);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("createShop threw", err);
        toast.error("Ошибка сервера при создании");
        return;
      }

      if (!result?.ok) {
        toast.error(result?.error ?? "Не удалось создать");
        return;
      }
      onSaved(
        {
          id: result.shop.id,
          order: result.shop.order,
          name: result.shop.name,
          url: result.shop.url,
          category: result.shop.category,
          descriptionRu: result.shop.descriptionRu,
          descriptionEn: result.shop.descriptionEn,
          image: result.shop.image,
        },
        "create"
      );
      toast.success("Магазин добавлен");
      reset();
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={shop ? "Изменить" : "Добавить"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="font-serif text-2xl text-bone">
          {shop ? "Изменить магазин" : "Добавить магазин"}
        </h2>
        <Field label="Название *" error={errors.name?.message}>
          <input className={inputClass} {...register("name")} />
        </Field>
        <Field label="URL *" error={errors.url?.message}>
          <input className={inputClass} {...register("url")} />
        </Field>
        <Field label="Категория *" error={errors.category?.message}>
          <select className={inputClass} {...register("category")}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Описание RU" error={errors.descriptionRu?.message}>
          <textarea
            className={`${inputClass} min-h-20`}
            {...register("descriptionRu")}
          />
        </Field>
        <Field label="Описание EN" error={errors.descriptionEn?.message}>
          <textarea
            className={`${inputClass} min-h-20`}
            {...register("descriptionEn")}
          />
        </Field>
        <Field label="Изображение" error={errors.image?.message}>
          <input type="hidden" {...register("image")} />
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="font-sans text-sm text-ash"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadFile(file);
            }}
          />
          {image ? (
            <div className="relative mt-2 h-28 w-full overflow-hidden border border-line">
              <Image src={image} alt="" fill className="object-cover" />
            </div>
          ) : null}
        </Field>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Сохранить
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
        {label}
      </span>
      {children}
      {error ? (
        <span className="block text-xs text-copper" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

const inputClass =
  "w-full border border-line bg-ink-soft px-3 py-2 font-sans text-sm text-bone focus:border-gold";
