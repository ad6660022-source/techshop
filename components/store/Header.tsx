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
        className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
          scrolled ? "shadow-md" : "shadow-sm"
        } border-b border-gray-100`}
      >
        {/* Top bar */}
        <div className="hidden md:block bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center text-xs text-gray-500">
            <span>Доставка по всей России</span>
            <div className="flex items-center gap-4">
              <span>Пн-Пт: 9:00 - 21:00</span>
              <a href="tel:+78001234567" className="text-blue-600 font-medium hover:underline">
                8 (800) 123-45-67
              </a>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Tech<span className="text-blue-600">Shop</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 ml-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-sm">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск товаров..."
                className="w-full h-9 pl-9 pr-4 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">
            {/* Mobile search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative">
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative">
              <ShoppingCart className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalCartItems > 9 ? "9+" : totalCartItems}
                </span>
              )}
            </Link>

            {/* User */}
            {session ? (
              <div className="relative group">
                <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                  <User className="w-5 h-5" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                  {(session.user as any)?.role === "ADMIN" && (
                    <Link href="/admin" className="block px-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50">
                      Панель управления
                    </Link>
                  )}
                  <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Мой кабинет
                  </Link>
                  <Link href="/account/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Мои заказы
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Выйти
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-1.5 h-9 px-3 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" />
                Войти
              </Link>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/account" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                  Личный кабинет
                </Link>
                {(session.user as any)?.role === "ADMIN" && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg">
                    Панель управления
                  </Link>
                )}
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">
                Войти / Зарегистрироваться
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <form onSubmit={handleSearch} className="flex items-center gap-3 p-4 border-b">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск товаров..."
              className="flex-1 text-base outline-none"
            />
            <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
