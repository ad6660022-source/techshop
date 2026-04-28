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
        className={`sticky top-0 z-50 transition-all duration-300 border-b border-[#d8cbb4] ${
          scrolled ? "bg-[#faf9f5]/97 backdrop-blur-md shadow-[0_2px_16px_rgba(80,56,20,0.09)]" : "bg-[#faf9f5]"
        }`}
      >
        {/* Announcement bar */}
        <div style={{ background: "#4a3820" }} className="text-white text-xs">
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center">
            <span style={{ color: "#d8c8a0" }}>Доставка по всей России · Гарантия качества</span>
            <div className="hidden sm:flex items-center gap-4">
              <span style={{ color: "#b8a478" }}>Пн–Пт: 9:00 — 21:00</span>
              <a href="tel:+78001234567" className="text-white font-semibold hover:opacity-80 transition-opacity">
                8 (800) 123-45-67
              </a>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-[66px] flex items-center gap-6">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-[0_2px_8px_rgba(140,101,48,0.28)] transition-all group-hover:shadow-[0_4px_14px_rgba(140,101,48,0.38)]" style={{ background: "#8c6530" }}>
                <Zap className="w-5 h-5 text-[#fef0c0]" fill="currentColor" />
              </div>
              <span className="text-[21px] font-black tracking-tight leading-none" style={{ color: "#221c10" }}>
                ИС<span style={{ color: "#c4882a" }}>КРА</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3.5 py-2 text-[13.5px] font-medium rounded-lg transition-all duration-150 group"
                  style={{ color: "#4e3e20" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#221c10"; (e.currentTarget as HTMLElement).style.background = "#ede7d8"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#4e3e20"; (e.currentTarget as HTMLElement).style.background = ""; }}
                >
                  {link.label}
                  <span className="absolute bottom-1 left-3.5 right-3.5 h-[2px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" style={{ background: "#c4882a" }} />
                </Link>
              ))}
            </nav>

            {/* Search */}
            <div className="hidden md:block flex-1 max-w-[280px]">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#b09870" }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск товаров..."
                  className="w-full h-10 pl-10 pr-4 text-[13.5px] rounded-xl transition-all"
                  style={{
                    background: "#f4f0e6",
                    border: "1.5px solid #d8cbb4",
                    color: "#221c10",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#c4882a"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(196,136,42,0.12)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#d8cbb4"; e.currentTarget.style.background = "#f4f0e6"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5 ml-auto lg:ml-0">
              <button
                onClick={() => setSearchOpen(true)}
                className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ color: "#4e3e20" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#ede7d8"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors" style={{ color: "#4e3e20" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#ede7d8"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}>
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center" style={{ background: "#943828" }}>
                    {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors" style={{ color: "#4e3e20" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#ede7d8"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}>
                <ShoppingCart className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center" style={{ background: "#c4882a" }}>
                    {totalCartItems > 9 ? "9+" : totalCartItems}
                  </span>
                )}
              </Link>

              {/* User */}
              {session ? (
                <div className="relative group">
                  <button className="flex items-center gap-1.5 h-10 px-3 rounded-xl transition-colors text-sm font-medium" style={{ color: "#4e3e20" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#ede7d8"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}>
                    <User className="w-4 h-4" />
                    <span className="hidden sm:block max-w-[80px] truncate text-[13px]">
                      {session.user?.name?.split(" ")[0] || "Кабинет"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                  </button>
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-[0_8px_28px_rgba(80,56,20,0.15)] border border-[#e8e0cc] py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    {(session.user as any)?.role === "ADMIN" && (
                      <>
                        <Link href="/admin" className="block px-4 py-2.5 text-[13px] font-semibold hover:bg-[#f4f0e6] transition-colors" style={{ color: "#8c6530" }}>
                          Панель управления
                        </Link>
                        <div className="mx-3 my-1 h-px bg-[#e8e0cc]" />
                      </>
                    )}
                    <Link href="/account" className="block px-4 py-2.5 text-[13px] hover:bg-[#f4f0e6] transition-colors" style={{ color: "#221c10" }}>Мой кабинет</Link>
                    <Link href="/account/orders" className="block px-4 py-2.5 text-[13px] hover:bg-[#f4f0e6] transition-colors" style={{ color: "#221c10" }}>Мои заказы</Link>
                    <div className="mx-3 my-1 h-px bg-[#e8e0cc]" />
                    <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#fdecea] transition-colors" style={{ color: "#943828" }}>Выйти</button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="hidden md:flex items-center gap-1.5 h-10 px-4 text-[13.5px] font-semibold text-white rounded-xl transition-all shadow-[0_2px_8px_rgba(140,101,48,0.25)] hover:shadow-[0_4px_14px_rgba(140,101,48,0.35)]" style={{ background: "#8c6530" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#745228"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#8c6530"}>
                  <User className="w-4 h-4" />
                  Войти
                </Link>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors" style={{ color: "#4e3e20" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#ede7d8"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}>
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#e8e0cc] px-4 py-3 space-y-0.5" style={{ background: "#faf9f5" }}>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-[14px] font-medium rounded-lg transition-colors"
                style={{ color: "#4e3e20" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#ede7d8"; (e.currentTarget as HTMLElement).style.color = "#221c10"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.color = "#4e3e20"; }}>
                {link.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-[#e8e0cc] space-y-0.5">
              {session ? (
                <>
                  <Link href="/account" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-[14px] rounded-lg transition-colors" style={{ color: "#4e3e20" }}>Личный кабинет</Link>
                  {(session.user as any)?.role === "ADMIN" && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-[14px] font-semibold rounded-lg transition-colors" style={{ color: "#8c6530" }}>Панель управления</Link>
                  )}
                  <button onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }} className="block w-full text-left px-3 py-2.5 text-[14px] rounded-lg transition-colors" style={{ color: "#943828" }}>Выйти</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-[14px] font-semibold rounded-lg transition-colors" style={{ color: "#8c6530" }}>Войти / Зарегистрироваться</Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col md:hidden" style={{ background: "rgba(250,249,245,0.97)", backdropFilter: "blur(8px)" }}>
          <form onSubmit={handleSearch} className="flex items-center gap-3 px-4 py-4 border-b border-[#d8cbb4]">
            <Search className="w-5 h-5 flex-shrink-0" style={{ color: "#7e6840" }} />
            <input ref={searchRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск товаров..." className="flex-1 text-[16px] outline-none bg-transparent" style={{ color: "#221c10" }} />
            <button type="button" onClick={() => setSearchOpen(false)} style={{ color: "#7e6840" }}>
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
