import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";

interface OrderSuccessPageProps {
  searchParams: { orderId?: string; orderNumber?: string };
}

export default function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const { orderNumber } = searchParams;

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Заказ оформлен!
      </h1>
      {orderNumber && (
        <p className="text-gray-500 mb-2">
          Номер вашего заказа:{" "}
          <span className="font-semibold text-gray-900">#{orderNumber}</span>
        </p>
      )}
      <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
        Мы отправим подтверждение на вашу электронную почту. Наш менеджер свяжется с вами для уточнения деталей доставки.
      </p>

      <div className="bg-blue-50 rounded-2xl p-6 mb-8 text-left">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          Что дальше?
        </h3>
        <div className="space-y-3">
          {[
            "Менеджер проверит наличие и свяжется с вами",
            "После подтверждения заказ будет передан в доставку",
            "Курьер доставит заказ по указанному адресу",
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </div>
              <span className="text-sm text-gray-700">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/catalog"
          className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Продолжить покупки
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/account/orders"
          className="inline-flex items-center justify-center gap-2 h-12 px-6 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Мои заказы
        </Link>
      </div>
    </div>
  );
}
