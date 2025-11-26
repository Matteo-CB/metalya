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

const NAV_LINKS = [
  { label: "Actualités", href: "/category/actualites" },
  { label: "Culture", href: "/category/culture" },
  { label: "Tech", href: "/category/tech" },
  { label: "Voyage", href: "/category/voyage" },
];

interface SiteHeaderProps {
  user?: User;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500 ease-in-out",
          isScrolled
            ? "border-b border-neutral-200/80 bg-white/80 py-3 backdrop-blur-xl shadow-sm"
            : "border-transparent bg-transparent py-6"
        )}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="relative z-50 font-serif text-2xl font-bold tracking-tight text-neutral-900 transition-opacity hover:opacity-80"
            >
              Metalya.
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-10 md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors duration-300 hover:text-neutral-900",
                    pathname === link.href
                      ? "text-neutral-900 font-semibold"
                      : "text-neutral-500"
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-1 left-0 h-px w-full bg-neutral-900"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden items-center gap-4 md:flex">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="group flex items-center gap-2 rounded-full border border-neutral-200 bg-white/50 px-2 py-1.5 pl-3 transition-all hover:bg-white hover:shadow-md hover:border-neutral-300"
                  >
                    <span className="max-w-[100px] truncate text-xs font-bold text-neutral-700">
                      {user.name?.split(" ")[0]}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-transform group-hover:scale-105">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.image}
                          alt="Avatar"
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon size={16} />
                      )}
                    </div>
                    <ChevronDown size={14} className="mr-1 text-neutral-400" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-neutral-100 bg-white p-2 shadow-xl ring-1 ring-black/5"
                      >
                        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Mon compte
                        </div>
                        {/* @ts-expect-error - role check */}
                        {user.role === "ADMIN" && (
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
                    className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-neutral-900/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="relative z-50 -mr-2 p-2 text-neutral-900 md:hidden"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-2xl pt-28 md:hidden"
          >
            <div className="flex flex-col gap-8 px-8">
              <div className="flex flex-col gap-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="font-serif text-4xl font-medium text-neutral-900"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="h-px w-full bg-neutral-200/50" />

              <div className="flex flex-col gap-4">
                {user ? (
                  <>
                    {/* @ts-expect-error - role check */}
                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin/create"
                        className="flex items-center gap-3 text-lg font-medium text-neutral-900"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      >
                        <LayoutDashboard size={20} />
                        Administration
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-3 text-lg font-medium text-red-600"
                    >
                      <LogOut size={20} />
                      Se déconnecter
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/login"
                      className="flex w-full justify-center rounded-xl border border-neutral-200 py-4 font-medium text-neutral-900 active:bg-neutral-50"
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="flex w-full justify-center rounded-xl bg-neutral-900 py-4 font-bold text-white shadow-lg active:scale-95 transition-transform"
                    >
                      S&apos;inscrire
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
