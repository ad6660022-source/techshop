import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { CustomCursor } from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: {
    default: "TechShop — магазин техники и электроники",
    template: "%s | TechShop",
  },
  description:
    "Современный интернет-магазин техники и электроники. Смартфоны, ноутбуки, наушники и аксессуары с доставкой.",
  keywords: ["интернет-магазин", "техника", "электроника", "смартфоны", "ноутбуки"],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "TechShop",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="antialiased bg-white text-gray-900 min-h-screen">
        <CustomCursor />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
