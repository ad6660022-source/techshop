"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { ShoppingCart, Heart, User, Search, Menu, X, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog?category=smartphones", label: "Смартфоны" },
  { href: "/catalog?category=laptops", label: "Ноутбуки" },
  { href: "/catalog?category=headphones", label: "Наушники" },
  { href: "/catalog?category=accessories", label: "Аксессуары" },
];

export function Header() {
  const { data: session } = useSession();
  const cartItems = useCartStore((s) => s.items);
  const wishlistItems = useWishlistStore((s) => s.items);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const totalCartItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#09090f]/95 backdrop-blur-xl shadow-lg shadow-black/40 border-b border-white/5"
            : "bg-[#09090f]/80 backdrop-blur-md border-b border-white/5"
        }`}
      >
        {/* Top bar */}
        <div className="hidden md:block border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center text-xs text-[#7c7c99]">
            <span>Доставка по всей России</span>
            <div className="flex items-center gap-4">
              <span>Пн-Пт: 9:00 — 21:00</span>
              <a href="tel:+78001234567" className="text-violet-400 font-medium hover:text-violet-300 transition-colors">
                8 (800) 123-45-67
              </a>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="relative w-9 h-9 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/50 group-hover:shadow-violet-700/60 transition-shadow">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              ИС<span className="text-violet-400">КРА</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 ml-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-[#7c7c99] hover:text-white hover:bg-white/5 rounded-lg transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-xs">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск товаров..."
                className="w-full h-9 pl-9 pr-4 text-sm border border-white/8 rounded-lg bg-white/5 text-[#f0f0fa] placeholder-[#3d3d52] focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3d3d52]" />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 ml-auto md:ml-0">
            {/* Mobile search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-lg text-[#7c7c99] hover:text-white hover:bg-white/5 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="p-2 rounded-lg text-[#7c7c99] hover:text-white hover:bg-white/5 relative transition-colors">
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-violet-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="p-2 rounded-lg text-[#7c7c99] hover:text-white hover:bg-white/5 relative transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalCartItems > 9 ? "9+" : totalCartItems}
                </span>
              )}
            </Link>

            {/* User */}
            {session ? (
              <div className="relative group">
                <button className="p-2 rounded-lg text-[#7c7c99] hover:text-white hover:bg-white/5 transition-colors">
                  <User className="w-5 h-5" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#1c1c28] rounded-xl shadow-2xl shadow-black/60 border border-white/10 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                  {(session.user as any)?.role === "ADMIN" && (
                    <Link href="/admin" className="block px-4 py-2.5 text-sm text-violet-400 font-medium hover:bg-violet-500/10 transition-colors">
                      Панель управления
                    </Link>
                  )}
                  <Link href="/account" className="block px-4 py-2.5 text-sm text-[#f0f0fa] hover:bg-white/5 transition-colors">
                    Мой кабинет
                  </Link>
                  <Link href="/account/orders" className="block px-4 py-2.5 text-sm text-[#f0f0fa] hover:bg-white/5 transition-colors">
                    Мои заказы
                  </Link>
                  <hr className="my-1 border-white/8" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Выйти
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-1.5 h-9 px-3 text-sm font-medium text-[#7c7c99] border border-white/8 rounded-lg hover:border-violet-500/40 hover:text-white hover:bg-violet-500/5 transition-all"
              >
                <User className="w-4 h-4" />
                Войти
              </Link>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-[#7c7c99] hover:text-white hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#111119] px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm text-[#7c7c99] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/account" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-[#7c7c99] hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  Личный кабинет
                </Link>
                {(session.user as any)?.role === "ADMIN" && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-violet-400 font-medium hover:bg-violet-500/10 rounded-lg transition-colors">
                    Панель управления
                  </Link>
                )}
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors">
                Войти / Зарегистрироваться
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-[#09090f]/95 backdrop-blur-lg md:hidden">
          <form onSubmit={handleSearch} className="flex items-center gap-3 p-4 border-b border-white/8">
            <Search className="w-5 h-5 text-[#3d3d52] flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск товаров..."
              className="flex-1 text-base outline-none bg-transparent text-[#f0f0fa] placeholder-[#3d3d52]"
            />
            <button type="button" onClick={() => setSearchOpen(false)} className="text-[#7c7c99] hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
