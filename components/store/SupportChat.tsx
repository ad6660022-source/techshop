"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Chat {
  id: string;
  messages: Message[];
}

export function SupportChat() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Only show for authenticated non-admin users
  if (!session || (session.user as any)?.role === "ADMIN") return null;

  const loadChat = async () => {
    try {
      const res = await fetch("/api/support");
      if (res.ok) {
        const data = await res.json();
        setChat(data);
      }
    } catch {}
  };

  useEffect(() => {
    if (open && !chat) {
      setLoading(true);
      loadChat().finally(() => setLoading(false));
    }
    if (open) {
      pollRef.current = setInterval(loadChat, 5000);
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  const sendMessage = async () => {
    if (!text.trim() || !chat || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: chat.id, content: text.trim() }),
      });
      if (res.ok) {
        setText("");
        await loadChat();
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center"
        title="Поддержка"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && chat && chat.messages.filter(m => m.isAdmin).length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ height: "420px" }}>
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-3">
            <MessageCircle className="w-5 h-5" />
            <div>
              <p className="font-semibold text-sm">Поддержка TechShop</p>
              <p className="text-xs text-blue-200">Обычно отвечаем в течение часа</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : chat?.messages.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">
                <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                Напишите нам — мы поможем!
              </div>
            ) : (
              chat?.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isAdmin ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    msg.isAdmin
                      ? "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
                      : "bg-blue-600 text-white rounded-tr-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder="Ваш вопрос..."
              className="flex-1 h-9 px-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !text.trim()}
              className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
