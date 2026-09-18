"use client";

import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import { Rating } from "@/components/ui/Rating";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { Modal } from "@/components/ui/Modal";
import {
  approveReview,
  rejectReview,
  deleteReview,
  updateReview,
  bulkApprove,
  bulkReject,
  bulkDelete,
} from "./actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export type AdminReview = {
  id: string;
  name: string;
  city: string | null;
  telegram: string | null;
  text: string;
  rating: number;
  status: string;
  locale: string;
  createdAt: string;
};

type StatusFilter = "all" | "pending" | "approved" | "rejected";
type LocaleFilter = "all" | "ru" | "en";

type ReviewsManagerProps = {
  reviews: AdminReview[];
};

const editSchema = z.object({
  name: z.string().min(2).max(50),
  city: z.string().max(50).optional().or(z.literal("")),
  telegram: z.string().max(50).optional().or(z.literal("")),
  text: z.string().min(20).max(2000),
  rating: z.coerce.number().int().min(1).max(5),
  status: z.enum(["pending", "approved", "rejected"]),
  locale: z.enum(["ru", "en"]),
});

type EditValues = z.infer<typeof editSchema>;

export function ReviewsManager({ reviews }: ReviewsManagerProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [localeFilter, setLocaleFilter] = useState<LocaleFilter>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<AdminReview | null>(null);
  const [deleting, setDeleting] = useState<AdminReview | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [optimistic, setOptimistic] = useOptimistic(
    reviews,
    (
      state: AdminReview[],
      action:
        | { type: "status"; id: string; status: string }
        | { type: "remove"; id: string }
        | { type: "bulkStatus"; ids: string[]; status: string }
        | { type: "bulkRemove"; ids: string[] }
    ) => {
      switch (action.type) {
        case "status":
          return state.map((r) =>
            r.id === action.id ? { ...r, status: action.status } : r
          );
        case "remove":
          return state.filter((r) => r.id !== action.id);
        case "bulkStatus":
          return state.map((r) =>
            action.ids.includes(r.id) ? { ...r, status: action.status } : r
          );
        case "bulkRemove":
          return state.filter((r) => !action.ids.includes(r.id));
        default:
          return state;
      }
    }
  );

  const counts = {
    all: optimistic.length,
    pending: optimistic.filter((r) => r.status === "pending").length,
    approved: optimistic.filter((r) => r.status === "approved").length,
    rejected: optimistic.filter((r) => r.status === "rejected").length,
  };

  const filtered = optimistic.filter((r) => {
    const byStatus =
      statusFilter === "all" ? true : r.status === statusFilter;
    const byLocale =
      localeFilter === "all" ? true : r.locale === localeFilter;
    return byStatus && byLocale;
  });

  function toggleAll(checked: boolean) {
    setSelected(checked ? filtered.map((r) => r.id) : []);
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  }

  function runApprove(id: string) {
    startTransition(async () => {
      setOptimistic({ type: "status", id, status: "approved" });
      try {
        await approveReview(id);
        toast.success("Отзыв одобрен");
      } catch {
        toast.error("Ошибка");
      }
    });
  }

  function runReject(id: string) {
    startTransition(async () => {
      setOptimistic({ type: "status", id, status: "rejected" });
      try {
        await rejectReview(id);
        toast.success("Отзыв отклонён");
      } catch {
        toast.error("Ошибка");
      }
    });
  }

  function runDelete() {
    if (!deleting) return;
    const id = deleting.id;
    startTransition(async () => {
      setOptimistic({ type: "remove", id });
      setDeleting(null);
      try {
        await deleteReview(id);
        toast.success("Отзыв удалён");
      } catch {
        toast.error("Ошибка");
      }
    });
  }

  function runBulk(status: "approved" | "rejected") {
    const ids = [...selected];
    startTransition(async () => {
      setOptimistic({ type: "bulkStatus", ids, status });
      setSelected([]);
      try {
        if (status === "approved") await bulkApprove(ids);
        else await bulkReject(ids);
        toast.success(
          status === "approved"
            ? "Выбранные одобрены"
            : "Выбранные отклонены"
        );
      } catch {
        toast.error("Ошибка");
      }
    });
  }

  function runBulkDelete() {
    const ids = [...selected];
    startTransition(async () => {
      setOptimistic({ type: "bulkRemove", ids });
      setSelected([]);
      setBulkDeleteOpen(false);
      try {
        await bulkDelete(ids);
        toast.success("Выбранные удалены");
      } catch {
        toast.error("Ошибка");
      }
    });
  }

  const tabs: { key: StatusFilter; label: string }[] = [
    { key: "all", label: `Все (${counts.all})` },
    { key: "pending", label: `На модерации (${counts.pending})` },
    { key: "approved", label: `Одобренные (${counts.approved})` },
    { key: "rejected", label: `Отклонённые (${counts.rejected})` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                statusFilter === tab.key
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-line text-ash hover:text-bone"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(["all", "ru", "en"] as const).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setLocaleFilter(loc)}
              className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                localeFilter === loc
                  ? "border-gold text-gold"
                  : "border-line text-ash"
              }`}
            >
              {loc === "all" ? "Все языки" : loc}
            </button>
          ))}
        </div>
      </div>

      {selected.length > 0 ? (
        <div className="flex flex-wrap items-center gap-3 border border-gold/30 bg-gold/5 px-4 py-3">
          <span className="font-mono text-xs text-gold">
            Выбрано: {selected.length}
          </span>
          <Button variant="ghost" onClick={() => runBulk("approved")}>
            Одобрить выбранные
          </Button>
          <Button variant="ghost" onClick={() => runBulk("rejected")}>
            Отклонить выбранные
          </Button>
          <Button variant="ghost" onClick={() => setBulkDeleteOpen(true)}>
            Удалить выбранные
          </Button>
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState text="Пока нет отзывов по выбранным фильтрам" />
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[56rem] border-collapse text-left">
            <thead className="border-b border-line bg-ink">
              <tr>
                <th className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={
                      filtered.length > 0 &&
                      filtered.every((r) => selected.includes(r.id))
                    }
                    onChange={(e) => toggleAll(e.target.checked)}
                    aria-label="Выбрать все"
                  />
                </th>
                <Th>Дата</Th>
                <Th>Имя</Th>
                <Th>Город</Th>
                <Th>Рейтинг</Th>
                <Th>Текст</Th>
                <Th>Статус</Th>
                <Th>Действия</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((review) => (
                <tr
                  key={review.id}
                  className="border-b border-line transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(review.id)}
                      onChange={(e) =>
                        toggleOne(review.id, e.target.checked)
                      }
                      aria-label={`Выбрать ${review.name}`}
                    />
                  </td>
                  <td className="px-3 py-3 font-mono text-xs text-ash">
                    {new Date(review.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-3 py-3 text-sm text-bone">{review.name}</td>
                  <td className="px-3 py-3 text-sm text-ash">
                    {review.city ?? "—"}
                  </td>
                  <td className="px-3 py-3">
                    <Rating value={review.rating} size={14} />
                  </td>
                  <td className="max-w-xs px-3 py-3 text-sm text-ash">
                    {review.text.slice(0, 80)}
                    {review.text.length > 80 ? "…" : ""}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={review.status} />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      {review.status !== "approved" ? (
                        <button
                          type="button"
                          className="text-xs text-gold hover:underline"
                          onClick={() => runApprove(review.id)}
                          disabled={pending}
                        >
                          Одобрить
                        </button>
                      ) : null}
                      {review.status !== "rejected" ? (
                        <button
                          type="button"
                          className="text-xs text-ash hover:text-bone"
                          onClick={() => runReject(review.id)}
                          disabled={pending}
                        >
                          Отклонить
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="text-xs text-ash hover:text-bone"
                        onClick={() => setEditing(review)}
                      >
                        Редактировать
                      </button>
                      <button
                        type="button"
                        className="text-xs text-copper hover:underline"
                        onClick={() => setDeleting(review)}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing ? (
        <EditReviewModal
          review={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            toast.success("Отзыв обновлён");
          }}
        />
      ) : null}

      <ConfirmDialog
        open={!!deleting}
        title="Удалить отзыв?"
        description="Действие необратимо. Отзыв будет удалён из базы."
        confirmLabel="Удалить"
        tone="danger"
        onCancel={() => setDeleting(null)}
        onConfirm={runDelete}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        title="Удалить выбранные?"
        description={`Будет удалено отзывов: ${selected.length}`}
        confirmLabel="Удалить"
        tone="danger"
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={runBulkDelete}
      />
    </div>
  );
}

function EditReviewModal({
  review,
  onClose,
  onSaved,
}: {
  review: AdminReview;
  onClose: () => void;
  onSaved: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: review.name,
      city: review.city ?? "",
      telegram: review.telegram ?? "",
      text: review.text,
      rating: review.rating,
      status: review.status as EditValues["status"],
      locale: (review.locale === "en" ? "en" : "ru") as "ru" | "en",
    },
  });

  const rating = watch("rating");

  async function onSubmit(values: EditValues) {
    const result = await updateReview(review.id, values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    onSaved();
  }

  return (
    <Modal open onClose={onClose} title="Редактировать отзыв">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="font-serif text-2xl text-bone">Редактировать отзыв</h2>
        <Field label="Имя" error={errors.name?.message}>
          <input className={inputClass} {...register("name")} />
        </Field>
        <Field label="Город" error={errors.city?.message}>
          <input className={inputClass} {...register("city")} />
        </Field>
        <Field label="Telegram" error={errors.telegram?.message}>
          <input className={inputClass} {...register("telegram")} />
        </Field>
        <Field label="Рейтинг" error={errors.rating?.message}>
          <Rating
            value={rating}
            interactive
            onChange={(v) => setValue("rating", v, { shouldValidate: true })}
          />
        </Field>
        <Field label="Текст" error={errors.text?.message}>
          <textarea className={`${inputClass} min-h-28`} {...register("text")} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Статус" error={errors.status?.message}>
            <select className={inputClass} {...register("status")}>
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
            </select>
          </Field>
          <Field label="Locale" error={errors.locale?.message}>
            <select className={inputClass} {...register("locale")}>
              <option value="ru">ru</option>
              <option value="en">en</option>
            </select>
          </Field>
        </div>
        <div className="flex justify-end gap-3 pt-2">
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

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") {
    return (
      <span className="inline-block bg-gold px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink">
        approved
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-block border border-ash px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ash">
        rejected
      </span>
    );
  }
  return (
    <span className="inline-block border border-gold px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold">
      pending
    </span>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
      {children}
    </th>
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
  "w-full border border-line bg-ink px-3 py-2 font-sans text-sm text-bone focus:border-gold";
