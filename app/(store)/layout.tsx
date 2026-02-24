import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { SupportChat } from "@/components/store/SupportChat";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <SupportChat />
    </div>
  );
}
