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
    { href: "/catalog", label: "Доставка и оплата" },
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
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="text-xl font-bold text-white">
                Tech<span className="text-blue-400">Shop</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Современный интернет-магазин техники и электроники. Только оригинальные товары с официальной гарантией.
            </p>
            <div className="space-y-2">
              <a href="tel:+78001234567" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-blue-400" />
                8 (800) 123-45-67 (бесплатно)
              </a>
              <a href="mailto:info@techshop.ru" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-blue-400" />
                info@techshop.ru
              </a>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-blue-400" />
                Москва, Россия
              </div>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h4 className="text-white font-semibold mb-4">Каталог</h4>
            <ul className="space-y-2">
              {LINKS.catalog.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Информация</h4>
            <ul className="space-y-2">
              {LINKS.info.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4">Кабинет</h4>
            <ul className="space-y-2">
              {LINKS.account.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} TechShop. Все права защищены.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-gray-300">Политика конфиденциальности</Link>
            <Link href="/" className="hover:text-gray-300">Пользовательское соглашение</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
