export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { AddPromoForm } from "@/components/admin/AddPromoForm";
import { DeletePromoButton } from "@/components/admin/DeletePromoButton";
import { Tag, CheckCircle, XCircle } from "lucide-react";

export default async function AdminPromoPage() {
  const promos = await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Промокоды</h1>
          <p className="text-gray-500 text-sm mt-1">{promos.length} промокодов</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Promo list */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-800">Все промокоды</h2>
          {promos.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
              Промокодов нет
            </div>
          )}
          {promos.map((promo) => {
            const isExpired = promo.expiresAt && new Date() > promo.expiresAt;
            const isUsedUp = promo.maxUses && promo.usedCount >= promo.maxUses;
            const active = promo.isActive && !isExpired && !isUsedUp;

            return (
              <div
                key={promo.id}
                className="bg-white rounded-2xl border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-gray-900 text-lg">{promo.code}</span>
                      {active ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          <CheckCircle className="w-3 h-3" /> Активен
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">
                          <XCircle className="w-3 h-3" />
                          {isExpired ? "Истёк" : isUsedUp ? "Лимит" : "Отключён"}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                      <span>
                        Скидка:{" "}
                        <strong>
                          {promo.type === "PERCENTAGE"
                            ? `${promo.value}%`
                            : `${promo.value} ₽`}
                        </strong>
                      </span>
                      <span>
                        Использований:{" "}
                        <strong>
                          {promo.usedCount}
                          {promo.maxUses ? ` / ${promo.maxUses}` : ""}
                        </strong>
                      </span>
                      {promo.minOrder > 0 && (
                        <span>
                          Мин. сумма: <strong>{promo.minOrder} ₽</strong>
                        </span>
                      )}
                      {promo.expiresAt && (
                        <span>
                          Действует до: <strong>{formatDate(promo.expiresAt)}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Tag className="w-5 h-5 text-gray-300" />
                    <DeletePromoButton id={promo.id} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add promo form */}
        <div>
          <h2 className="font-semibold text-gray-800 mb-4">Создать промокод</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <AddPromoForm />
          </div>
        </div>
      </div>
    </div>
  );
}
