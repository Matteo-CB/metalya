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
  ChevronDown,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { User } from "next-auth";
// Import de l'enum UserRole si possible, sinon on utilisera le string "ADMIN"
// import { UserRole } from "@prisma/client";

const NAV_LINKS = [
  { label: "Actualités", href: "/category/actualites" },
  { label: "Culture", href: "/category/culture" },
  { label: "Tech", href: "/category/tech" },
  { label: "Voyage", href: "/category/voyage" },
];

interface SiteHeaderProps {
  user?: User & { role?: string }; // Typage étendu pour inclure le rôle
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();

  // Gestion du scroll pour l'effet de verre
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloquer le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const isAdmin = user?.role === "ADMIN";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out border-b",
          isScrolled
            ? "border-neutral-200/50 bg-white/80 py-3 backdrop-blur-xl shadow-sm supports-backdrop-filter:bg-white/60"
            : "border-transparent bg-transparent py-4 md:py-6"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <nav
            className="flex items-center justify-between"
            aria-label="Navigation principale"
          >
            <Link
              href="/"
              className="relative z-50 font-serif text-2xl font-bold tracking-tight text-neutral-900 transition-opacity hover:opacity-80 md:text-3xl"
              aria-label="Retour à l'accueil Metalya"
            >
              Metalya<span className="text-neutral-300">.</span>
            </Link>

            <div className="hidden items-center gap-8 lg:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative py-2 text-sm font-medium transition-colors duration-300 hover:text-neutral-900",
                    pathname === link.href
                      ? "text-neutral-900"
                      : "text-neutral-500"
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-px left-0 h-px w-full bg-neutral-900"
                    />
                  )}
                  <span className="absolute -bottom-px left-0 h-px w-0 bg-neutral-300 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-4 lg:flex">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    className="group flex items-center gap-2 rounded-full border border-neutral-200 bg-white/50 py-1.5 pl-3 pr-2 transition-all hover:border-neutral-300 hover:bg-white hover:shadow-sm focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  >
                    <span className="max-w-[100px] truncate text-xs font-bold text-neutral-700">
                      {user.name?.split(" ")[0]}
                    </span>
                    <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-neutral-100 text-neutral-600 ring-1 ring-neutral-100 transition-transform group-hover:scale-105">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserIcon size={16} />
                      )}
                    </div>
                    <ChevronDown
                      size={14}
                      className={cn(
                        "text-neutral-400 transition-transform duration-200",
                        isUserMenuOpen ? "rotate-180" : ""
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-neutral-100 bg-white p-2 shadow-xl ring-1 ring-black/5"
                      >
                        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Mon compte
                        </div>

                        {isAdmin && (
                          <Link
                            href="/admin/create"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                          >
                            <LayoutDashboard
                              size={18}
                              className="text-neutral-500"
                            />
                            Administration
                          </Link>
                        )}

                        <div className="my-1 h-px bg-neutral-100" />
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut size={18} />
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
                    className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-neutral-900/20 transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              )}
            </div>

            <button
              className="relative z-50 -mr-2 rounded-full p-2 text-neutral-900 transition-colors active:bg-neutral-100 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={
                isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"
              }
              aria-expanded={isMobileMenuOpen}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white/95 pt-24 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-full flex-col justify-between overflow-y-auto px-6 pb-12">
              <div className="flex flex-col gap-8">
                <nav className="flex flex-col gap-6">
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "block font-serif text-4xl font-medium tracking-tight",
                          pathname === link.href
                            ? "text-neutral-900"
                            : "text-neutral-400"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="h-px w-full bg-neutral-100" />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-4"
                >
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm">
                            <UserIcon size={20} />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-neutral-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin/create"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3 font-medium text-neutral-900 shadow-sm ring-1 ring-neutral-100 active:bg-neutral-50"
                        >
                          <LayoutDashboard size={20} />
                          Administration
                        </Link>
                      )}

                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-red-600 active:bg-red-50"
                      >
                        <LogOut size={20} />
                        Se déconnecter
                      </button>
                    </>
                  ) : (
                    <div className="grid gap-3">
                      <Link
                        href="/login"
                        className="flex w-full justify-center rounded-xl border border-neutral-200 py-4 font-medium text-neutral-900 active:bg-neutral-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Connexion
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex w-full justify-center rounded-xl bg-neutral-900 py-4 font-bold text-white shadow-lg active:scale-95 transition-transform"
                      >
                        S&apos;inscrire
                      </Link>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
