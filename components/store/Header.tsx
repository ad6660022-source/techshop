"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { ShoppingCart, Heart, User, Search, Menu, X, Zap, ChevronDown } from "lucide-react";
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
    const handleScroll = () => setScrolled(window.scrollY > 8);
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
            ? "bg-[#faf8f3]/98 backdrop-blur-md shadow-[0_2px_20px_rgba(100,72,32,0.10)]"
            : "bg-[#faf8f3]"
        } border-b border-[#d4c4a4]`}
      >
        {/* Announcement bar */}
        <div className="bg-[#6b4c2a] text-white text-xs">
          <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
            <span className="text-[#e8d4b4]">Доставка по всей России · Гарантия качества</span>
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-[#c4a87a]">Пн–Пт: 9:00 — 21:00</span>
              <a href="tel:+78001234567" className="text-white font-semibold hover:text-[#f0d898] transition-colors">
                8 (800) 123-45-67
              </a>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-[68px] flex items-center gap-6">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-9 h-9 bg-[#6b4c2a] rounded-xl flex items-center justify-center shadow-[0_2px_8px_rgba(107,76,42,0.30)] group-hover:bg-[#573d22] transition-colors">
                <Zap className="w-5 h-5 text-[#f0d898]" fill="currentColor" />
              </div>
              <div>
                <span className="text-[22px] font-black tracking-tight text-[#241a0c] leading-none">
                  ИС<span className="text-[#b8721e]">КРА</span>
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3.5 py-2 text-[13.5px] font-medium text-[#5a3e1e] hover:text-[#241a0c] rounded-lg hover:bg-[#ede5d2] transition-all duration-150 group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-3.5 right-3.5 h-[2px] bg-[#b8721e] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full origin-left" />
                </Link>
              ))}
            </nav>

            {/* Search bar (desktop) */}
            <div className="hidden md:block flex-1 max-w-[280px]">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b8a07a] pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск товаров..."
                  className="w-full h-10 pl-10 pr-4 text-[13.5px] bg-[#f3ede0] border border-[#d4c4a4] rounded-xl text-[#241a0c] placeholder-[#b8a07a] focus:outline-none focus:border-[#b8721e] focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,114,30,0.10)] transition-all"
                />
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto lg:ml-0">
              {/* Mobile search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[#5a3e1e] hover:bg-[#ede5d2] transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[#5a3e1e] hover:bg-[#ede5d2] transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#9b3a2a] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[#5a3e1e] hover:bg-[#ede5d2] transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#b8721e] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalCartItems > 9 ? "9+" : totalCartItems}
                  </span>
                )}
              </Link>

              {/* User */}
              {session ? (
                <div className="relative group">
                  <button className="flex items-center gap-1.5 h-10 px-3 rounded-xl text-[#5a3e1e] hover:bg-[#ede5d2] transition-colors text-sm font-medium">
                    <User className="w-4.5 h-4.5" />
                    <span className="hidden sm:block max-w-[80px] truncate text-[13px]">
                      {session.user?.name?.split(" ")[0] || "Кабинет"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-[0_8px_28px_rgba(100,72,32,0.16)] border border-[#e4d9c4] py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    {(session.user as any)?.role === "ADMIN" && (
                      <>
                        <Link href="/admin" className="block px-4 py-2.5 text-[13px] text-[#6b4c2a] font-semibold hover:bg-[#f3ede0] transition-colors">
                          Панель управления
                        </Link>
                        <div className="mx-3 my-1 h-px bg-[#e4d9c4]" />
                      </>
                    )}
                    <Link href="/account" className="block px-4 py-2.5 text-[13px] text-[#241a0c] hover:bg-[#f3ede0] transition-colors">
                      Мой кабинет
                    </Link>
                    <Link href="/account/orders" className="block px-4 py-2.5 text-[13px] text-[#241a0c] hover:bg-[#f3ede0] transition-colors">
                      Мои заказы
                    </Link>
                    <div className="mx-3 my-1 h-px bg-[#e4d9c4]" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-4 py-2.5 text-[13px] text-[#9b3a2a] hover:bg-[#fdf0ec] transition-colors"
                    >
                      Выйти
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-1.5 h-10 px-4 text-[13.5px] font-semibold text-white bg-[#6b4c2a] rounded-xl hover:bg-[#573d22] transition-all shadow-[0_2px_8px_rgba(107,76,42,0.25)] hover:shadow-[0_4px_14px_rgba(107,76,42,0.35)]"
                >
                  <User className="w-4 h-4" />
                  Войти
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[#5a3e1e] hover:bg-[#ede5d2] transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#e4d9c4] bg-[#faf8f3] px-4 py-3 space-y-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-[14px] text-[#5a3e1e] hover:text-[#241a0c] hover:bg-[#ede5d2] rounded-lg font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-[#e4d9c4] space-y-0.5">
              {session ? (
                <>
                  <Link href="/account" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-[14px] text-[#5a3e1e] hover:bg-[#ede5d2] rounded-lg transition-colors">
                    Личный кабинет
                  </Link>
                  {(session.user as any)?.role === "ADMIN" && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-[14px] text-[#6b4c2a] font-semibold hover:bg-[#ede5d2] rounded-lg transition-colors">
                      Панель управления
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                    className="block w-full text-left px-3 py-2.5 text-[14px] text-[#9b3a2a] hover:bg-[#fdf0ec] rounded-lg transition-colors"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-[14px] font-semibold text-[#6b4c2a] hover:bg-[#ede5d2] rounded-lg transition-colors">
                  Войти / Зарегистрироваться
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-[#faf8f3]/98 backdrop-blur-sm md:hidden flex flex-col">
          <form onSubmit={handleSearch} className="flex items-center gap-3 px-4 py-4 border-b border-[#d4c4a4]">
            <Search className="w-5 h-5 text-[#8a6e48] flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск товаров..."
              className="flex-1 text-[16px] outline-none bg-transparent text-[#241a0c] placeholder-[#b8a07a]"
            />
            <button type="button" onClick={() => setSearchOpen(false)} className="text-[#8a6e48] hover:text-[#241a0c] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
