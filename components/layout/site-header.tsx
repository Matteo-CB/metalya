"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { User } from "next-auth"; // Type
import { signOut } from "@/auth";

const NAV_LINKS = [
  { label: "Actualités", href: "/category/actualites" },
  { label: "Culture", href: "/category/culture" },
  { label: "Tech", href: "/category/tech" },
  { label: "Voyage", href: "/category/voyage" }, // Ajout
];

interface SiteHeaderProps {
  user?: User; // On passe l'user en props depuis un Server Component parent
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();

  // Détection du scroll pour l'effet "Glass"
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "border-b border-neutral-200/50 bg-white/80 py-4 backdrop-blur-xl"
            : "border-transparent bg-transparent py-6"
        )}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="relative z-50 font-serif text-2xl font-bold tracking-tight text-neutral-900"
            >
              Metalya.
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-neutral-900",
                    pathname === link.href
                      ? "text-neutral-900"
                      : "text-neutral-500"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions (Login / User Menu) */}
            <div className="hidden items-center gap-4 md:flex">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2 py-1.5 pl-3 transition-colors hover:border-neutral-300"
                  >
                    <span className="text-xs font-medium text-neutral-700 max-w-[100px] truncate">
                      {user.name?.split(" ")[0]}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                      <UserIcon size={16} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white p-2 shadow-lg ring-1 ring-black/5"
                      >
                        <div className="px-2 py-1.5 text-xs font-semibold text-neutral-500">
                          Mon compte
                        </div>
                        {/* @ts-expect-error - role est bien là grâce à notre typage */}
                        {user.role === "ADMIN" && (
                          <Link
                            href="/admin/create"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          >
                            <LayoutDashboard size={16} />
                            Administration
                          </Link>
                        )}
                        <button
                          onClick={() => signOut()}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut size={16} />
                          Se déconnecter
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 hover:bg-neutral-800"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="relative z-50 p-2 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white pt-24 md:hidden"
          >
            <div className="flex flex-col gap-8 px-6">
              <div className="flex flex-col gap-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-serif font-medium text-neutral-900"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="h-px w-full bg-neutral-100" />
              <div className="flex flex-col gap-4">
                {user ? (
                  <>
                    {/* @ts-expect-error - role check */}
                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin/create"
                        className="flex items-center gap-2 text-lg font-medium text-neutral-900"
                      >
                        <LayoutDashboard size={20} />
                        Administration
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 text-lg font-medium text-red-600"
                    >
                      <LogOut size={20} />
                      Se déconnecter
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex w-full justify-center rounded-lg border border-neutral-200 py-3 font-medium text-neutral-900"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/register"
                      className="flex w-full justify-center rounded-lg bg-neutral-900 py-3 font-medium text-white"
                    >
                      S'inscrire
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
