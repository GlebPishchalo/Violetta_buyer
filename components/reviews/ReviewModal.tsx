"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { Rating } from "@/components/ui/Rating";
import { Button } from "@/components/ui/Button";

type ReviewModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  name: string;
  city: string;
  telegram: string;
  text: string;
  rating: number;
  _gotcha: string;
};

export function ReviewModal({ open, onClose }: ReviewModalProps) {
  const t = useTranslations("reviewForm");
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const schema = z.object({
    name: z
      .string()
      .min(1, t("errors.nameRequired"))
      .min(2, t("errors.nameMin"))
      .max(50, t("errors.nameMax")),
    city: z.string().max(80).optional().or(z.literal("")),
    telegram: z.string().max(80).optional().or(z.literal("")),
    text: z
      .string()
      .min(1, t("errors.textRequired"))
      .min(20, t("errors.textMin"))
      .max(2000, t("errors.textMax")),
    rating: z
      .number()
      .min(1, t("errors.ratingRequired"))
      .max(5, t("errors.ratingRequired")),
    _gotcha: z.string().optional().or(z.literal("")),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      city: "",
      telegram: "",
      text: "",
      rating: 0,
      _gotcha: "",
    },
  });

  const rating = watch("rating");

  function handleClose() {
    onClose();
    setTimeout(() => {
      setSuccess(false);
      setApiError(null);
      reset();
    }, 200);
  }

  async function onSubmit(values: FormValues) {
    setApiError(null);

    if (values._gotcha) {
      setSuccess(true);
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          city: values.city || undefined,
          telegram: values.telegram || undefined,
          text: values.text,
          rating: values.rating,
          locale: locale === "en" ? "en" : "ru",
          _gotcha: values._gotcha,
        }),
      });

      if (!response.ok) {
        setApiError(t("apiUnavailable"));
        return;
      }

      setSuccess(true);
    } catch {
      setApiError(t("apiUnavailable"));
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t("title")}
      labelledBy="review-modal-title"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <h2
          id="review-modal-title"
          className="font-serif text-2xl text-bone"
        >
          {t("title")}
        </h2>
        <button
          type="button"
          onClick={handleClose}
          className="font-mono text-sm text-ash transition-colors hover:text-bone"
          aria-label={t("close")}
        >
          ✕
        </button>
      </div>

      {success ? (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <motion.svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{ opacity: 1 }}
            aria-hidden
          >
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="#C9A227"
              strokeWidth="1.25"
            />
            <motion.path
              d="M14 24.5l6.5 6.5L34 17"
              fill="none"
              stroke="#C9A227"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduceMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.45, delay: 0.1 }}
            />
          </motion.svg>
          <p className="font-sans text-sm text-bone">{t("success")}</p>
          <Button variant="ghost" onClick={handleClose}>
            {t("close")}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
            {...register("_gotcha")}
          />

          <Field
            label={t("name")}
            error={errors.name?.message}
            required
          >
            <input
              className={inputClass}
              {...register("name")}
              autoComplete="name"
            />
          </Field>

          <Field label={t("city")} error={errors.city?.message}>
            <input
              className={inputClass}
              {...register("city")}
              autoComplete="address-level2"
            />
          </Field>

          <Field
            label={
              <>
                {t("telegram")}{" "}
                <span className="text-ash">({t("telegramHint")})</span>
              </>
            }
            error={errors.telegram?.message}
          >
            <input className={inputClass} {...register("telegram")} />
          </Field>

          <Field label={t("rating")} error={errors.rating?.message} required>
            <Rating
              value={rating}
              interactive
              label={t("rating")}
              size={22}
              onChange={(value) =>
                setValue("rating", value, { shouldValidate: true })
              }
            />
          </Field>

          <Field label={t("text")} error={errors.text?.message} required>
            <textarea
              rows={5}
              className={`${inputClass} resize-y`}
              {...register("text")}
            />
          </Field>

          {apiError ? (
            <p className="font-sans text-sm text-copper" role="alert">
              {apiError}
            </p>
          ) : null}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? t("submitting") : t("submit")}
          </Button>
        </form>
      )}
    </Modal>
  );
}

const inputClass =
  "w-full border border-line bg-ink px-3 py-2.5 font-sans text-sm text-bone placeholder:text-ash/60 transition-colors focus:border-gold";

function Field({
  label,
  error,
  required,
  children,
}: {
  label: ReactNode;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </span>
      {children}
      {error ? (
        <span className="block font-sans text-xs text-copper" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}
