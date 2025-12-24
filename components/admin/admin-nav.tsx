"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  MessageSquare,
  Image as ImageIcon, // Nouvelle icône
} from "lucide-react";

const navItems = [
  {
    title: "Vue d'ensemble",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Articles",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    title: "Médiathèque", // NOUVEAU LIEN
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    title: "Utilisateurs",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
  },
  {
    title: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item, index) => {
        const Icon = item.icon;

        // Gestion de l'état actif (exact ou sous-route)
        const isActive =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(item.href));

        return (
          <Link key={index} href={item.href}>
            <span
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              <Icon
                className={cn(
                  "mr-2 h-4 w-4",
                  isActive ? "text-white" : "text-neutral-500"
                )}
              />
              <span>{item.title}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
