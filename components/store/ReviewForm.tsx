"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { StarRating } from "./StarRating";

const RATING_LABELS = ["", "Ужасно", "Плохо", "Нормально", "Хорошо", "Отлично"];

interface ReviewFormProps {
  productId: string;
  hasOrdered: boolean;
  alreadyReviewed: boolean;
}

export function ReviewForm({ productId, hasOrdered, alreadyReviewed }: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!session) {
    return (
      <div className="bg-gray-50 rounded-xl p-5 text-center">
        <p className="text-sm text-gray-500 mb-2">Войдите в аккаунт, чтобы оставить отзыв</p>
        <a href="/login" className="inline-block text-sm font-medium text-blue-600 hover:underline">
          Войти
        </a>
      </div>
    );
  }

  if (alreadyReviewed) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
        <p className="text-sm text-green-700 font-medium">Вы уже оставляли отзыв на этот товар</p>
      </div>
    );
  }

  if (!hasOrdered) {
    return (
      <div className="bg-gray-50 rounded-xl p-5 text-center">
        <p className="text-sm text-gray-500">
          Оставить отзыв могут только покупатели этого товара
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { toast.error("Выберите оценку"); return; }
    if (!comment.trim()) { toast.error("Напишите комментарий"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Ошибка"); return; }
      toast.success("Отзыв опубликован!");
      setRating(0);
      setComment("");
      router.refresh();
    } catch {
      toast.error("Ошибка отправки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-5">
      <h4 className="text-sm font-semibold text-gray-900 mb-4">Оставить отзыв</h4>

      {/* Star picker */}
      <div className="flex items-center gap-2 mb-4">
        <StarRating
          rating={rating}
          hovered={hovered}
          size="lg"
          interactive
          onChange={setRating}
          onHover={setHovered}
        />
        {(hovered || rating) > 0 && (
          <span className="text-sm text-gray-500 font-medium">
            {RATING_LABELS[hovered || rating]}
          </span>
        )}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Расскажите о товаре — что понравилось, а что нет..."
        rows={3}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-blue-400 bg-white"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-3 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Отправляем..." : "Опубликовать отзыв"}
      </button>
    </form>
  );
}
