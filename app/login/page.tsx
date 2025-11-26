"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginInput } from "@/lib/schemas";
import { loginAction } from "@/app/actions/auth";
import { Loader2, AlertCircle } from "lucide-react";
import { Container } from "@/components/ui/container";

export default function LoginPage() {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginInput) => {
    setError("");
    startTransition(async () => {
      const data = await loginAction(values);
      if (data?.error) {
        setError(data.error);
      }
    });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-neutral-50 py-12">
      <Container className="max-w-md">
        <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl font-bold text-neutral-900">
              Bon retour
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Connectez-vous pour accéder à votre espace.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-neutral-700"
              >
                Email
              </label>
              <input
                {...form.register("email")}
                id="email"
                type="email"
                disabled={isPending}
                placeholder="email@example.com"
                className="w-full rounded-md border border-neutral-200 px-4 py-2.5 outline-none transition-all focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 disabled:opacity-50"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-neutral-700"
                >
                  Mot de passe
                </label>
                <Link
                  href="#"
                  className="text-xs text-neutral-500 hover:underline"
                >
                  Oublié ?
                </Link>
              </div>
              <input
                {...form.register("password")}
                id="password"
                type="password"
                disabled={isPending}
                placeholder="••••••••"
                className="w-full rounded-md border border-neutral-200 px-4 py-2.5 outline-none transition-all focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 disabled:opacity-50"
              />
              {form.formState.errors.password && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-500">
                <AlertCircle size={16} />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-neutral-900 py-2.5 font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-70"
            >
              {isPending && <Loader2 className="animate-spin" size={16} />}
              Se connecter
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-500">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="font-medium text-neutral-900 hover:underline"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
