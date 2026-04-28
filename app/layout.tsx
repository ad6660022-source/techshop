import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { CustomCursor } from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: {
    default: "ИСКРА — магазин техники и электроники",
    template: "%s | ИСКРА",
  },
  description:
    "ИСКРА — интернет-магазин техники и электроники. Смартфоны, ноутбуки, наушники и аксессуары. Заказ через мессенджеры.",
  keywords: ["интернет-магазин", "техника", "электроника", "смартфоны", "ноутбуки", "ИСКРА"],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "ИСКРА",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="antialiased min-h-screen" style={{ background: "#faf9f5", color: "#221c10" }}>
        <CustomCursor />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
