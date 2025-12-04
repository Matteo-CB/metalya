"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema, ForgotPasswordInput } from "@/lib/schemas";
import { forgotPasswordAction } from "@/app/actions/reset-password";
import { Container } from "@/components/ui/container";
import { Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordInput) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const data = await forgotPasswordAction(values);
      setError(data.error);
      setSuccess(data.success);
    });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-neutral-50 py-12">
      <Container className="max-w-md">
        <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-2xl font-bold text-neutral-900">
              Mot de passe oublié ?
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Entrez votre email pour recevoir un lien de réinitialisation.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                {...form.register("email")}
                type="email"
                disabled={isPending}
                className="w-full rounded-md border border-neutral-200 px-4 py-2.5 outline-none transition-all focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-500">
                <AlertCircle size={16} />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-600">
                <CheckCircle2 size={16} />
                <p>{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-neutral-900 py-2.5 font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-70"
            >
              {isPending && <Loader2 className="animate-spin" size={16} />}
              Envoyer le lien
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-neutral-500 hover:text-neutral-900"
            >
              <ArrowLeft size={14} />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
