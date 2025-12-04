"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema, ProfileInput } from "@/lib/schemas";
import { updateProfile } from "@/app/actions/user";
import { uploadImage } from "@/app/actions/media";
import { useSession } from "next-auth/react";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import {
  Loader2,
  User as UserIcon,
  Camera,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isUploading, startUpload] = useTransition();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const form = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      bio: "",
      image: session?.user?.image || "",
    },
    values: {
      name: session?.user?.name || "",
      bio: "",
      image: session?.user?.image || "",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    startUpload(async () => {
      const formData = new FormData();
      formData.append("file", file);
      const url = await uploadImage(formData);
      form.setValue("image", url);
      setPreviewImage(url);
    });
  };

  const onSubmit = (values: ProfileInput) => {
    setSuccess("");
    setError("");
    startTransition(async () => {
      const res = await updateProfile(values);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(res.success!);
        await update();
      }
    });
  };

  if (!session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-32 pb-24">
      <Container className="max-w-2xl">
        <FadeIn>
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-neutral-200 md:p-12">
            <div className="mb-10 text-center">
              <h1 className="font-serif text-3xl font-bold text-neutral-900">
                Mon Profil
              </h1>
              <p className="mt-2 text-neutral-500">
                Gérez vos informations publiques.
              </p>
              {session.user.id && (
                <Link
                  href={`/author/${session.user.id}`}
                  className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 hover:underline"
                >
                  Voir mon profil public
                </Link>
              )}
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex justify-center">
                <div className="relative group cursor-pointer">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-neutral-50 bg-neutral-100 shadow-inner">
                    {previewImage || form.watch("image") ? (
                      <Image
                        src={previewImage || form.watch("image") || ""}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-400">
                        <UserIcon size={48} />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-transform hover:scale-110 hover:bg-neutral-800">
                    {isUploading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Camera size={16} />
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Nom d'affichage
                  </label>
                  <input
                    {...form.register("name")}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 outline-none focus:border-neutral-900 focus:bg-white focus:ring-0"
                    placeholder="Votre nom"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Biographie
                  </label>
                  <textarea
                    {...form.register("bio")}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 outline-none focus:border-neutral-900 focus:bg-white focus:ring-0"
                    placeholder="Dites-nous en plus sur vous..."
                  />
                  {form.formState.errors.bio && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.bio.message}
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-600">
                  <CheckCircle2 size={18} />
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending || isUploading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-4 font-bold text-white transition-all hover:bg-neutral-800 hover:shadow-lg disabled:opacity-70"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                Enregistrer les modifications
              </button>
            </form>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
