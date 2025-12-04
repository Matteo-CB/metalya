"use client";

import { UserRole } from "@prisma/client";
import { updateUserRole } from "@/app/actions/user";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserRoleSelectorProps {
  userId: string;
  currentRole: UserRole;
}

export function UserRoleSelector({
  userId,
  currentRole,
}: UserRoleSelectorProps) {
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState(currentRole);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    setRole(newRole);
    startTransition(async () => {
      await updateUserRole(userId, newRole);
    });
  };

  return (
    <div className="relative">
      <select
        value={role}
        onChange={handleChange}
        disabled={isPending}
        className={cn(
          "h-8 rounded-md border bg-white pl-3 pr-8 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50",
          role === "SUPER_ADMIN" &&
            "border-purple-200 text-purple-700 bg-purple-50",
          role === "ADMIN" && "border-indigo-200 text-indigo-700 bg-indigo-50",
          role === "REDACTEUR" && "border-blue-200 text-blue-700 bg-blue-50",
          role === "USER" && "border-neutral-200 text-neutral-600"
        )}
      >
        <option value="USER">Utilisateur</option>
        <option value="REDACTEUR">Rédacteur</option>
        <option value="ADMIN">Admin</option>
        <option value="SUPER_ADMIN">Super Admin</option>
      </select>
      {isPending && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Loader2 size={12} className="animate-spin text-neutral-400" />
        </div>
      )}
    </div>
  );
}
