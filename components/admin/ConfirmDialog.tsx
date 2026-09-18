"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  tone?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Подтвердить",
  cancelLabel = "Отмена",
  loading = false,
  tone = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="font-serif text-2xl text-bone">{title}</h2>
          <p className="font-sans text-sm leading-relaxed text-ash">
            {description}
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={loading}
            className={
              tone === "danger"
                ? "bg-copper hover:bg-copper/90"
                : undefined
            }
          >
            {loading ? "…" : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
