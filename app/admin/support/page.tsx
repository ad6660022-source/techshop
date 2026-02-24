export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { AdminSupportClient } from "@/components/admin/AdminSupportClient";

export default async function AdminSupportPage() {
  const chats = await prisma.supportChat.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Поддержка</h1>
        <p className="text-gray-500 text-sm mt-1">{chats.length} обращений</p>
      </div>
      <AdminSupportClient initialChats={chats as any} />
    </div>
  );
}
