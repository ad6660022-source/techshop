import Link from "next/link";
import { Zap, Mail, Phone, MapPin } from "lucide-react";

const LINKS = {
  catalog: [
    { href: "/catalog?category=smartphones", label: "Смартфоны" },
    { href: "/catalog?category=laptops", label: "Ноутбуки" },
    { href: "/catalog?category=headphones", label: "Наушники" },
    { href: "/catalog?category=accessories", label: "Аксессуары" },
  ],
  info: [
    { href: "/catalog", label: "О магазине" },
    { href: "/catalog", label: "Доставка" },
    { href: "/catalog", label: "Возврат товара" },
    { href: "/catalog", label: "Контакты" },
  ],
  account: [
    { href: "/login", label: "Войти в аккаунт" },
    { href: "/register", label: "Регистрация" },
    { href: "/account/orders", label: "Мои заказы" },
    { href: "/wishlist", label: "Избранное" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#09090f] border-t border-white/5 mt-16">
      {/* Glow divider */}
      <div className="glow-divider" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="relative w-9 h-9 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/50">
                <Zap className="w-5 h-5 text-white" fill="currentColor" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                ИС<span className="text-violet-400">КРА</span>
              </span>
            </Link>
            <p className="text-sm text-[#7c7c99] mb-6 leading-relaxed max-w-xs">
              Современный магазин техники и электроники. Только оригинальные товары с официальной гарантией.
            </p>
            <div className="space-y-2.5">
              <a href="tel:+78001234567" className="flex items-center gap-2 text-sm text-[#7c7c99] hover:text-violet-400 transition-colors">
                <Phone className="w-4 h-4 text-violet-500/60" />
                8 (800) 123-45-67 (бесплатно)
              </a>
              <a href="mailto:info@iskra.ru" className="flex items-center gap-2 text-sm text-[#7c7c99] hover:text-violet-400 transition-colors">
                <Mail className="w-4 h-4 text-violet-500/60" />
                info@iskra.ru
              </a>
              <div className="flex items-center gap-2 text-sm text-[#7c7c99]">
                <MapPin className="w-4 h-4 text-violet-500/60" />
                Москва, Россия
              </div>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest opacity-60">Каталог</h4>
            <ul className="space-y-2.5">
              {LINKS.catalog.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-sm text-[#7c7c99] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest opacity-60">Информация</h4>
            <ul className="space-y-2.5">
              {LINKS.info.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[#7c7c99] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest opacity-60">Кабинет</h4>
            <ul className="space-y-2.5">
              {LINKS.account.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[#7c7c99] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#3d3d52]">
          <p>© {new Date().getFullYear()} ИСКРА. Все права защищены.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-[#7c7c99] transition-colors">Политика конфиденциальности</Link>
            <Link href="/" className="hover:text-[#7c7c99] transition-colors">Пользовательское соглашение</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
