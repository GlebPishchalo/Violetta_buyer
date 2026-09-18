"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  login: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
});

type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { login: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    const result = await signIn("credentials", {
      login: values.login,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Неверный логин или пароль");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm space-y-8 border border-line bg-ink-soft p-8">
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
            DXB·MOW
          </p>
          <h1 className="font-serif text-3xl text-bone">Вход</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <label className="block space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
              Логин
            </span>
            <input
              className={inputClass}
              autoComplete="username"
              {...register("login")}
            />
            {errors.login ? (
              <span className="block text-xs text-copper" role="alert">
                {errors.login.message}
              </span>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
              Пароль
            </span>
            <input
              type="password"
              className={inputClass}
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password ? (
              <span className="block text-xs text-copper" role="alert">
                {errors.password.message}
              </span>
            ) : null}
          </label>

          {error ? (
            <p className="font-sans text-sm text-copper" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Вход…" : "Войти"}
          </Button>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full border border-line bg-ink px-3 py-2.5 font-sans text-sm text-bone focus:border-gold";
