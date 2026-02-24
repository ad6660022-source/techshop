export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { AdminReviewReply } from "@/components/admin/AdminReviewReply";
import { Star } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ stars?: string }>;
}

export default async function AdminReviewsPage({ searchParams: spPromise }: PageProps) {
  const sp = await spPromise;
  const activeStars = sp.stars ? parseInt(sp.stars) : null;

  const allReviews = await prisma.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Count per star rating
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: allReviews.filter((r) => r.rating === star).length,
  }));

  const filtered = activeStars
    ? allReviews.filter((r) => r.rating === activeStars)
    : allReviews;

  const needsReply = filtered.filter((r) => !r.adminReply).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Отзывы</h1>
        <p className="text-gray-500 text-sm mt-1">
          Управление отзывами покупателей · всего {allReviews.length}
          {needsReply > 0 && (
            <span className="ml-2 text-orange-600 font-medium">· {needsReply} без ответа</span>
          )}
        </p>
      </div>

      {/* Star filter tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <a
          href="/admin/reviews"
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            !activeStars
              ? "bg-gray-900 text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Все ({allReviews.length})
        </a>
        {counts.map(({ star, count }) => (
          <a
            key={star}
            href={`/admin/reviews?stars=${star}`}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeStars === star
                ? "bg-yellow-400 text-gray-900"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-yellow-50"
            }`}
          >
            {star}
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs opacity-75">({count})</span>
          </a>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Отзывов с такой оценкой нет</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-2xl border p-5 ${
                !review.adminReply ? "border-orange-200 bg-orange-50/10" : "border-gray-100"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                {/* Left: review info */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                    {!review.adminReply && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                        Нет ответа
                      </span>
                    )}
                    {review.isAutoReply && review.adminReply && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        Авто-ответ
                      </span>
                    )}
                  </div>

                  {/* User + product */}
                  <p className="text-xs text-gray-500 mb-1">
                    <span className="font-medium text-gray-700">{review.user.name || review.user.email}</span>
                    {" · "}
                    <a
                      href={`/product/${review.product.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {review.product.name}
                    </a>
                  </p>

                  {/* Comment */}
                  <p className="text-sm text-gray-800 leading-relaxed">{review.comment}</p>

                  {/* Reply form */}
                  <AdminReviewReply
                    reviewId={review.id}
                    currentReply={review.adminReply}
                    isAutoReply={review.isAutoReply}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
