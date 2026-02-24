"use client";

import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, Loader2, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Chat {
  id: string;
  status: string;
  updatedAt: string;
  user: { id: string; name: string | null; email: string };
  messages: Message[];
}

export function AdminSupportClient({ initialChats }: { initialChats: Chat[] }) {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [selectedId, setSelectedId] = useState<string | null>(chats[0]?.id || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const selectedChat = chats.find((c) => c.id === selectedId);

  const loadMessages = async (chatId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/support/${chatId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedId) loadMessages(selectedId);
  }, [selectedId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages every 5s
  useEffect(() => {
    if (!selectedId) return;
    const interval = setInterval(() => loadMessages(selectedId), 5000);
    return () => clearInterval(interval);
  }, [selectedId]);

  const sendReply = async () => {
    if (!text.trim() || !selectedId || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/support/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: selectedId, content: text.trim() }),
      });
      if (res.ok) {
        setText("");
        await loadMessages(selectedId);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex" style={{ height: "600px" }}>
      {/* Chat list */}
      <div className="w-72 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-sm text-gray-700">Обращения</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Обращений нет
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedId(chat.id)}
                className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  selectedId === chat.id ? "bg-blue-50 border-l-2 border-l-blue-600" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {chat.user.name || chat.user.email}
                  </span>
                </div>
                {chat.messages[0] && (
                  <p className="text-xs text-gray-500 truncate ml-9">
                    {chat.messages[0].isAdmin ? "Вы: " : ""}{chat.messages[0].content}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">{selectedChat.user.name || "Пользователь"}</p>
              <p className="text-xs text-gray-500">{selectedChat.user.email}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">Нет сообщений</div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                    msg.isAdmin
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-gray-100 bg-white flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendReply())}
              placeholder="Ответ пользователю..."
              className="flex-1 h-10 px-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={sendReply}
              disabled={sending || !text.trim()}
              className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Выберите обращение</p>
          </div>
        </div>
      )}
    </div>
  );
}
