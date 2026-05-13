'use client';

import { useState, useEffect, useRef } from 'react';
import { usePolling } from '@/hooks/usePolling';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Clock, CheckCircle2 } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  sender_type: 'user' | 'support';
  createdAt: string;
  is_read: boolean;
}

interface Conversation {
  id: number;
  subject: string;
  status: string;
  category: string;
  messages?: Message[];
}

export default function DestekDetayPage() {
  const { id } = useParams();
  const router = useRouter();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const jwt = typeof window !== 'undefined' ? localStorage.getItem('tamirhanem_jwt') : null;

  useEffect(() => {
    if (!jwt) { router.push('/giris'); return; }
    markAsRead();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const fetchConversation = async () => {
    try {
      const res = await fetch(`/api/support-conversations/${id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      if (data.success && data.data) setConversation(data.data);
    } finally {
      setLoading(false);
    }
  };

  usePolling(jwt ? fetchConversation : null, 3000);

  const markAsRead = async () => {
    try {
      await fetch(`/api/support-conversations/${id}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}` },
      });
    } catch {}
  };

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/support-conversations/${id}/message`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });
      if (res.ok) {
        setMessage('');
        fetchConversation();
      }
    } finally {
      setSending(false);
    }
  };

  const statusLabel = (s: string) => ({
    open: 'Açık', pending: 'Beklemede', resolved: 'Çözüldü', closed: 'Kapatıldı', in_progress: 'İşlemde',
  }[s] || s);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Konuşma bulunamadı.</p>
        <Link href="/destek" className="text-orange-400 hover:underline">Desteğe Dön</Link>
      </div>
    );
  }

  const isClosed = ['resolved', 'closed'].includes(conversation.status);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center gap-3">
        <Link href="/destek" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate">{conversation.subject}</p>
          <p className="text-gray-400 text-xs">{statusLabel(conversation.status)}</p>
        </div>
        {isClosed && <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />}
      </div>

      {/* Mesajlar */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {(conversation.messages || []).map((msg) => {
          const isUser = msg.sender_type === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs sm:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  isUser
                    ? 'bg-orange-500 text-white rounded-br-sm'
                    : 'bg-gray-800 text-gray-100 rounded-bl-sm'
                }`}
              >
                <p>{msg.content}</p>
                <div className={`flex items-center gap-1 mt-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <Clock size={10} className={isUser ? 'text-orange-200' : 'text-gray-500'} />
                  <span className={`text-xs ${isUser ? 'text-orange-200' : 'text-gray-500'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!isClosed ? (
        <div className="bg-gray-900 border-t border-gray-800 px-4 py-3 flex items-end gap-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            rows={1}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-sm resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="w-10 h-10 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Send size={16} className={sending ? 'text-gray-500' : 'text-white'} />
          </button>
        </div>
      ) : (
        <div className="bg-gray-900 border-t border-gray-800 px-4 py-3 text-center text-sm text-gray-500">
          Bu destek talebi kapatılmıştır.{' '}
          <Link href="/destek" className="text-orange-400 hover:underline">Yeni talep oluştur</Link>
        </div>
      )}
    </div>
  );
}
