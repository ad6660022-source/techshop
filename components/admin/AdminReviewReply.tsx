"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send } from "lucide-react";

interface AdminReviewReplyProps {
  reviewId: string;
  currentReply: string | null;
  isAutoReply: boolean;
}

export function AdminReviewReply({ reviewId, currentReply, isAutoReply }: AdminReviewReplyProps) {
  const [reply, setReply] = useState(currentReply || "");
  const [editing, setEditing] = useState(!currentReply);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminReply: reply }),
      });
      if (!res.ok) throw new Error();
      toast.success("Ответ сохранён");
      setEditing(false);
      router.refresh();
    } catch {
      toast.error("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  if (!editing && currentReply) {
    return (
      <div className="mt-3">
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-sm text-blue-800">
          <span className="text-xs font-semibold text-blue-500 block mb-1">
            Ваш ответ{isAutoReply ? " (авто)" : ""}
          </span>
          {currentReply}
        </div>
        <button
          onClick={() => setEditing(true)}
          className="mt-1 text-xs text-blue-600 hover:underline"
        >
          Изменить ответ
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Напишите ответ покупателю..."
        rows={2}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-blue-400"
      />
      <div className="flex gap-2 mt-1.5">
        <button
          type="submit"
          disabled={loading || !reply.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Send className="w-3 h-3" />
          {loading ? "Сохраняем..." : "Ответить"}
        </button>
        {currentReply && (
          <button
            type="button"
            onClick={() => { setReply(currentReply); setEditing(false); }}
            className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}
