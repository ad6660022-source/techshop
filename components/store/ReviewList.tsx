import { StarRating } from "./StarRating";
import { formatDate } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

interface ReviewUser {
  name: string | null;
  image: string | null;
}

interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  adminReply: string | null;
  isAutoReply: boolean;
  createdAt: Date | string;
  user: ReviewUser;
}

interface ReviewListProps {
  reviews: ReviewData[];
  avgRating: number;
  reviewCount: number;
}

export function ReviewList({ reviews, avgRating, reviewCount }: ReviewListProps) {
  if (reviewCount === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">Отзывов пока нет. Будьте первым!</p>
      </div>
    );
  }

  // Star distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
          <StarRating rating={Math.round(avgRating)} size="sm" />
          <p className="text-xs text-gray-500 mt-1">{reviewCount} отзывов</p>
        </div>
        <div className="flex-1 space-y-1">
          {distribution.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-3">{star}</span>
              <svg className="w-3 h-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-yellow-400 h-1.5 rounded-full transition-all"
                  style={{ width: reviewCount > 0 ? `${(count / reviewCount) * 100}%` : "0%" }}
                />
              </div>
              <span className="text-xs text-gray-500 w-4 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border border-gray-100 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                  {review.user.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {review.user.name || "Покупатель"}
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(new Date(review.createdAt))}</p>
                </div>
              </div>
              <StarRating rating={review.rating} size="sm" />
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>

            {/* Admin reply */}
            {review.adminReply && (
              <div className="mt-3 pl-3 border-l-2 border-blue-200 bg-blue-50/50 rounded-r-lg py-2 pr-3">
                <p className="text-xs font-semibold text-blue-700 mb-1">
                  Ответ магазина
                  {review.isAutoReply && (
                    <span className="ml-1 text-blue-400 font-normal">(авто)</span>
                  )}
                </p>
                <p className="text-sm text-blue-800">{review.adminReply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
