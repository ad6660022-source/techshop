"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Phone, MessageCircle, Send } from "lucide-react";

interface Messenger {
  id: string;
  type: string;
  name: string;
  link: string;
}

interface MessengerModalProps {
  open: boolean;
  onClose: () => void;
  productName?: string;
}

const MESSENGER_CONFIG: Record<string, { label: string; icon: React.ReactNode; textColor: string; bg: string; border: string }> = {
  TELEGRAM: {
    label: "Telegram",
    icon: <Send className="w-5 h-5" />,
    textColor: "text-[#1a7abf]",
    bg: "bg-[#e8f4fc] hover:bg-[#d4ebf7]",
    border: "border-[#a8d4ee] hover:border-[#1a7abf]",
  },
  VK: {
    label: "ВКонтакте",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.677-1.253.677-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.779.677.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .373.17.508.271.508.22 0 .407-.135.813-.542 1.27-1.422 2.168-3.608 2.168-3.608.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .779.186.254.796.779 1.202 1.253.745.847 1.32 1.558 1.473 2.05.17.491-.085.745-.576.745z" />
      </svg>
    ),
    textColor: "text-[#0055cc]",
    bg: "bg-[#e8eef8] hover:bg-[#d4dff2]",
    border: "border-[#a8bcee] hover:border-[#0055cc]",
  },
  MAX: {
    label: "Max",
    icon: <MessageCircle className="w-5 h-5" />,
    textColor: "text-[#cc5500]",
    bg: "bg-[#faeee6] hover:bg-[#f5dfd2]",
    border: "border-[#e8b89a] hover:border-[#cc5500]",
  },
  WHATSAPP: {
    label: "WhatsApp",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    textColor: "text-[#1a7a3a]",
    bg: "bg-[#e8f5ec] hover:bg-[#d4edda]",
    border: "border-[#9ecfab] hover:border-[#1a7a3a]",
  },
  PHONE: {
    label: "Позвонить",
    icon: <Phone className="w-5 h-5" />,
    textColor: "text-[#6b4c2a]",
    bg: "bg-[#f3ede0] hover:bg-[#ede5d2]",
    border: "border-[#d4c4a4] hover:border-[#6b4c2a]",
  },
};

export function MessengerModal({ open, onClose, productName }: MessengerModalProps) {
  const [messengers, setMessengers] = useState<Messenger[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessengers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messengers");
      if (res.ok) setMessengers(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchMessengers();
  }, [open, fetchMessengers]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#241a0c]/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white border border-[#d4c4a4] rounded-2xl p-6 w-full max-w-sm shadow-[0_24px_64px_rgba(100,72,32,0.25)]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#f3ede0] hover:bg-[#ede5d2] flex items-center justify-center text-[#8a6e48] hover:text-[#241a0c] transition-colors border border-[#e4d9c4]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="w-11 h-11 bg-[#f3ede0] border border-[#e4d9c4] rounded-xl flex items-center justify-center mb-4">
            <MessageCircle className="w-5 h-5 text-[#6b4c2a]" />
          </div>
          <h2 className="text-[17px] font-bold text-[#241a0c]">Связаться с менеджером</h2>
          {productName && (
            <p className="text-[13px] text-[#8a6e48] mt-1 line-clamp-1">по товару: {productName}</p>
          )}
          <p className="text-[13px] text-[#b8a07a] mt-1.5">Выберите удобный способ связи</p>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#e4d9c4] mb-4" />

        {/* Messenger list */}
        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-[#f3ede0] animate-pulse border border-[#e4d9c4]" />
            ))}
          </div>
        ) : messengers.length === 0 ? (
          <p className="text-[#8a6e48] text-[13.5px] text-center py-6">
            Контакты менеджеров не настроены
          </p>
        ) : (
          <div className="space-y-2">
            {messengers.map((m) => {
              const config = MESSENGER_CONFIG[m.type] || MESSENGER_CONFIG.PHONE;
              const href = m.type === "PHONE" ? `tel:${m.link}` : m.link;
              return (
                <a
                  key={m.id}
                  href={href}
                  target={m.type !== "PHONE" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3.5 w-full h-14 px-4 rounded-xl border transition-all duration-150 ${config.bg} ${config.border}`}
                >
                  <span className={`flex-shrink-0 ${config.textColor}`}>{config.icon}</span>
                  <div className="text-left">
                    <p className={`text-[13.5px] font-semibold ${config.textColor}`}>{config.label}</p>
                    <p className="text-[12px] text-[#8a6e48]">{m.name}</p>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        <p className="text-[12px] text-[#c4b090] text-center mt-4">
          Менеджер ответит в рабочее время (Пн–Пт 9:00–21:00)
        </p>
      </div>
    </div>
  );
}
