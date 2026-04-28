"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  FolderOpen,
  LogOut,
  Zap,
  ExternalLink,
  MessageCircle,
  PackageX,
  Star,
  MessagesSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Товары", icon: Package },
  { href: "/admin/orders", label: "Заказы", icon: ShoppingBag },
  { href: "/admin/returns", label: "Возвраты", icon: PackageX },
  { href: "/admin/categories", label: "Категории", icon: FolderOpen },
  { href: "/admin/promo", label: "Промокоды", icon: Tag },
  { href: "/admin/reviews", label: "Отзывы", icon: Star },
  { href: "/admin/messengers", label: "Менеджеры", icon: MessagesSquare },
  { href: "/admin/support", label: "Поддержка", icon: MessageCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#09090f] border-r border-white/5 text-white flex flex-col z-40">
      {/* Logo */}
      <div className="p-4 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 bg-gradient-to-br from-violet-500 to-violet-700 rounded-lg flex items-center justify-center shadow-lg shadow-violet-900/50">
            <Zap className="w-4 h-4 text-white" fill="currentColor" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent" />
          </div>
          <div>
            <p className="text-sm font-black tracking-tight">ИС<span className="text-violet-400">КРА</span></p>
            <p className="text-xs text-[#3d3d52]">Панель управления</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              isActive(item.href, item.exact)
                ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                : "text-[#7c7c99] hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#7c7c99] hover:bg-white/5 hover:text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Сайт магазина
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#7c7c99] hover:bg-red-900/30 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </button>
      </div>
    </aside>
  );
}
