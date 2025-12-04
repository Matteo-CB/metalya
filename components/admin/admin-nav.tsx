"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Mail,
  FileText,
  PlusCircle,
} from "lucide-react";
import { UserRole } from "@prisma/client";

interface AdminNavProps {
  role: UserRole;
}

export function AdminNav({ role }: AdminNavProps) {
  const pathname = usePathname();
  const isSuperAdmin = role === UserRole.SUPER_ADMIN;

  const links = [
    {
      href: "/admin/posts",
      label: "Articles",
      icon: FileText,
    },
    {
      href: "/admin/create",
      label: "Nouveau",
      icon: PlusCircle,
    },
    {
      href: "/admin/newsletter",
      label: "Newsletter",
      icon: Mail,
    },
  ];

  if (isSuperAdmin) {
    links.splice(1, 0, {
      href: "/admin/users",
      label: "Utilisateurs",
      icon: Users,
    });
  }

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-neutral-200 bg-white px-4 py-2 lg:px-6">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <link.icon size={16} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
