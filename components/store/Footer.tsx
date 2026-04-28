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
    <footer className="bg-[#241a0c] mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 w-fit group">
              <div className="w-9 h-9 bg-[#b8721e] rounded-xl flex items-center justify-center shadow-[0_2px_8px_rgba(184,114,30,0.40)] group-hover:bg-[#9e6118] transition-colors">
                <Zap className="w-5 h-5 text-[#fef3d6]" fill="currentColor" />
              </div>
              <span className="text-[22px] font-black tracking-tight text-white leading-none">
                ИС<span className="text-[#d4904a]">КРА</span>
              </span>
            </Link>
            <p className="text-[13.5px] text-[#8a6e48] mb-6 leading-relaxed max-w-xs">
              Современный магазин техники и электроники. Только оригинальные товары с официальной гарантией.
            </p>
            <div className="space-y-3">
              <a href="tel:+78001234567" className="flex items-center gap-2.5 text-[13px] text-[#8a6e48] hover:text-[#d4904a] transition-colors">
                <Phone className="w-4 h-4 text-[#b8721e]" />
                8 (800) 123-45-67 (бесплатно)
              </a>
              <a href="mailto:info@iskra.ru" className="flex items-center gap-2.5 text-[13px] text-[#8a6e48] hover:text-[#d4904a] transition-colors">
                <Mail className="w-4 h-4 text-[#b8721e]" />
                info@iskra.ru
              </a>
              <div className="flex items-center gap-2.5 text-[13px] text-[#8a6e48]">
                <MapPin className="w-4 h-4 text-[#b8721e]" />
                Москва, Россия
              </div>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h4 className="text-[11px] font-bold text-[#b8a07a] uppercase tracking-[0.12em] mb-4">Каталог</h4>
            <ul className="space-y-2.5">
              {LINKS.catalog.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-[13.5px] text-[#8a6e48] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-[11px] font-bold text-[#b8a07a] uppercase tracking-[0.12em] mb-4">Информация</h4>
            <ul className="space-y-2.5">
              {LINKS.info.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[13.5px] text-[#8a6e48] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-[11px] font-bold text-[#b8a07a] uppercase tracking-[0.12em] mb-4">Кабинет</h4>
            <ul className="space-y-2.5">
              {LINKS.account.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[13.5px] text-[#8a6e48] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#3d2e18] flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-[#5a4428]">
          <p>© {new Date().getFullYear()} ИСКРА. Все права защищены.</p>
          <div className="flex gap-5">
            <Link href="/" className="hover:text-[#8a6e48] transition-colors">Политика конфиденциальности</Link>
            <Link href="/" className="hover:text-[#8a6e48] transition-colors">Пользовательское соглашение</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
