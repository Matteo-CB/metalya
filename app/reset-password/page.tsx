"use client";

import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, ResetPasswordInput } from "@/lib/schemas";
import { resetPasswordAction } from "@/app/actions/reset-password";
import { Container } from "@/components/ui/container";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (values: ResetPasswordInput) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const data = await resetPasswordAction(values, token);
      setError(data.error);
      setSuccess(data.success);
      if (data.success) {
        setTimeout(() => router.push("/login"), 2000);
      }
    });
  };

  if (!token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-red-500">
        Token manquant.
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-neutral-50 py-12">
      <Container className="max-w-md">
        <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-2xl font-bold text-neutral-900">
              Nouveau mot de passe
            </h1>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Nouveau mot de passe
              </label>
              <input
                {...form.register("password")}
                type="password"
                disabled={isPending}
                className="w-full rounded-md border border-neutral-200 px-4 py-2.5 outline-none transition-all focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              />
              {form.formState.errors.password && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Confirmer le mot de passe
              </label>
              <input
                {...form.register("confirmPassword")}
                type="password"
                disabled={isPending}
                className="w-full rounded-md border border-neutral-200 px-4 py-2.5 outline-none transition-all focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.confirmPassword.message}
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
              Changer le mot de passe
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}
