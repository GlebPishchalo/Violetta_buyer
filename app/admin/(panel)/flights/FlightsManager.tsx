"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { createFlight, updateFlight, deleteFlight } from "./actions";

export type AdminFlight = {
  id: string;
  date: string;
  direction: string;
  noteRu: string | null;
  noteEn: string | null;
};

const flightFormSchema = z.object({
  date: z.string().min(1, "Укажите дату"),
  direction: z.enum(["DXB-MOW", "MOW-DXB"]),
  noteRu: z.string().max(300).optional().or(z.literal("")),
  noteEn: z.string().max(300).optional().or(z.literal("")),
});

type FlightFormValues = z.infer<typeof flightFormSchema>;

type FlightsManagerProps = {
  flights: AdminFlight[];
};

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function FlightsManager({ flights }: FlightsManagerProps) {
  const [items, setItems] = useState(flights);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminFlight | null>(null);
  const [deleting, setDeleting] = useState<AdminFlight | null>(null);
  const [pending, startTransition] = useTransition();

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(flight: AdminFlight) {
    setEditing(flight);
    setOpen(true);
  }

  function confirmDelete() {
    if (!deleting) return;
    const id = deleting.id;
    startTransition(async () => {
      setItems((prev) => prev.filter((f) => f.id !== id));
      setDeleting(null);
      try {
        await deleteFlight(id);
        toast.success("Вылет удалён");
      } catch {
        toast.error("Ошибка");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openCreate}>Добавить вылет</Button>
      </div>

      {items.length === 0 ? (
        <EmptyState text="Пока нет вылетов в расписании" />
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead className="border-b border-line bg-ink">
              <tr>
                <th className="px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
                  Дата
                </th>
                <th className="px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
                  Направление
                </th>
                <th className="px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
                  Заметка RU
                </th>
                <th className="px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
                  Заметка EN
                </th>
                <th className="px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((flight) => (
                <tr
                  key={flight.id}
                  className="border-b border-line transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-3 py-3 text-sm text-bone">
                    {new Date(flight.date).toLocaleString("ru-RU")}
                  </td>
                  <td className="px-3 py-3 font-mono text-xs text-gold">
                    {flight.direction === "DXB-MOW" ? "DXB→MOW" : "MOW→DXB"}
                  </td>
                  <td className="px-3 py-3 text-sm text-ash">
                    {flight.noteRu ?? "—"}
                  </td>
                  <td className="px-3 py-3 text-sm text-ash">
                    {flight.noteEn ?? "—"}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="text-xs text-gold hover:underline"
                        onClick={() => openEdit(flight)}
                        disabled={pending}
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        className="text-xs text-copper hover:underline"
                        onClick={() => setDeleting(flight)}
                        disabled={pending}
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

      <FlightFormModal
        open={open}
        flight={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSaved={(flight, mode) => {
          setOpen(false);
          setEditing(null);
          if (mode === "create") {
            setItems((prev) =>
              [...prev, flight].sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
            );
          } else {
            setItems((prev) =>
              prev
                .map((f) => (f.id === flight.id ? flight : f))
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
            );
          }
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Удалить вылет?"
        description="Запись будет удалена из расписания."
        confirmLabel="Удалить"
        tone="danger"
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function FlightFormModal({
  open,
  flight,
  onClose,
  onSaved,
}: {
  open: boolean;
  flight: AdminFlight | null;
  onClose: () => void;
  onSaved: (flight: AdminFlight, mode: "create" | "update") => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FlightFormValues>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: {
      date: flight ? toLocalInput(flight.date) : "",
      direction:
        flight?.direction === "MOW-DXB" ? "MOW-DXB" : "DXB-MOW",
      noteRu: flight?.noteRu ?? "",
      noteEn: flight?.noteEn ?? "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      date: flight ? toLocalInput(flight.date) : "",
      direction:
        flight?.direction === "MOW-DXB" ? "MOW-DXB" : "DXB-MOW",
      noteRu: flight?.noteRu ?? "",
      noteEn: flight?.noteEn ?? "",
    });
  }, [open, flight, reset]);

  async function onSubmit(values: FlightFormValues) {
    if (flight) {
      let result;
      try {
        result = await updateFlight(flight.id, values);
      } catch (error) {
        console.error("updateFlight failed", error);
        toast.error("Ошибка сервера при сохранении вылета");
        return;
      }
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      onSaved(
        {
          id: flight.id,
          date: new Date(values.date).toISOString(),
          direction: values.direction,
          noteRu: values.noteRu || null,
          noteEn: values.noteEn || null,
        },
        "update"
      );
      toast.success("Вылет обновлён");
    } else {
      const result = await createFlight(values);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      onSaved(
        {
          id: result.flight.id,
          date: new Date(result.flight.date).toISOString(),
          direction: result.flight.direction,
          noteRu: result.flight.noteRu,
          noteEn: result.flight.noteEn,
        },
        "create"
      );
      toast.success("Вылет добавлен");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Вылет">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="font-serif text-2xl text-bone">
          {flight ? "Изменить вылет" : "Добавить вылет"}
        </h2>
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
            Дата *
          </span>
          <input
            type="datetime-local"
            className={inputClass}
            {...register("date")}
          />
          {errors.date ? (
            <span className="text-xs text-copper">{errors.date.message}</span>
          ) : null}
        </label>
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
            Направление *
          </span>
          <select className={inputClass} {...register("direction")}>
            <option value="DXB-MOW">DXB → MOW</option>
            <option value="MOW-DXB">MOW → DXB</option>
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
            Заметка RU
          </span>
          <input className={inputClass} {...register("noteRu")} />
        </label>
        <label className="block space-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
            Заметка EN
          </span>
          <input className={inputClass} {...register("noteEn")} />
        </label>
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

const inputClass =
  "w-full border border-line bg-ink-soft px-3 py-2 font-sans text-sm text-bone focus:border-gold";
