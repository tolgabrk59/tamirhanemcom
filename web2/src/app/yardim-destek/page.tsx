'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Phone, MessageCircle, Mail, Ticket } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: 'Nasıl randevu alabilirim?',
    answer: 'Ana sayfadan "Randevu Al" butonuna tıklayın, ardından şehir, servis türü ve uygun bir zaman dilimi seçin. Onay mesajı SMS veya e-posta ile iletilir.',
  },
  {
    question: 'Randevumu nasıl iptal edebilirim?',
    answer: 'Randevularım sayfasından aktif randevunuzu seçin ve "İptal Et" seçeneğine tıklayın. İptal işlemi randevu saatinden en az 2 saat önce yapılmalıdır.',
  },
  {
    question: 'Ödeme güvenli mi?',
    answer: 'Tüm ödemeler 256-bit SSL şifreli bağlantı üzerinden işlenmektedir. Kart bilgileriniz sistemimizde saklanmaz; PCI-DSS uyumlu ödeme altyapısı kullanılmaktadır.',
  },
  {
    question: 'Servis puanı nasıl hesaplanır?',
    answer: 'Servis puanı, gerçek müşterilerin randevu sonrası bıraktığı yorumların ağırlıklı ortalamasından oluşur. Tamamlanmış randevular için 7 gün içinde yorum yapılabilir.',
  },
  {
    question: 'Araç bilgilerimi nasıl güncellerim?',
    answer: 'Profil → Araçlarım bölümünden mevcut aracınızı seçip düzenleyebilir ya da yeni araç ekleyebilirsiniz. Değişiklikler anında kayıt edilir.',
  },
];

interface SupportChannel {
  icon: React.ReactNode;
  title: string;
  value: string;
  href: string;
  external: boolean;
}

const supportChannels: SupportChannel[] = [
  {
    icon: <Phone className="w-5 h-5" />,
    title: 'Telefon',
    value: '0850 xxx xx xx',
    href: 'tel:0850xxxxxxx',
    external: false,
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: 'WhatsApp',
    value: 'WhatsApp ile yaz',
    href: 'https://wa.me/90850xxxxxxx',
    external: true,
  },
  {
    icon: <Mail className="w-5 h-5" />,
    title: 'E-posta',
    value: 'destek@tamirhanem.com',
    href: 'mailto:destek@tamirhanem.com',
    external: false,
  },
];

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {items.map((item, idx) => (
        <div key={idx} className={idx < items.length - 1 ? 'border-b border-gray-800' : ''}>
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-800/50 transition-colors"
          >
            <span className="text-white text-sm font-medium pr-4">{item.question}</span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openIndex === idx ? 'rotate-180' : ''}`}
            />
          </button>
          {openIndex === idx && (
            <div className="px-5 pb-4">
              <p className="text-gray-400 text-sm leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function YardimDestekPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8 pt-20 lg:pt-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Yardım & Destek</h1>
          <p className="text-gray-400 text-sm">Size nasıl yardımcı olabiliriz?</p>
        </div>

        <div className="mb-6">
          <h2 className="text-white font-semibold text-lg mb-4">Sıkça Sorulan Sorular</h2>
          <FaqAccordion items={faqItems} />
        </div>

        <div className="mb-6">
          <h2 className="text-white font-semibold text-lg mb-4">Destek Kanalları</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {supportChannels.map((ch) => (
              <a
                key={ch.title}
                href={ch.href}
                target={ch.external ? '_blank' : undefined}
                rel={ch.external ? 'noopener noreferrer' : undefined}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-orange-500/50 hover:bg-gray-800 transition-colors group text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500/20 transition-colors">
                  {ch.icon}
                </div>
                <p className="text-white text-sm font-medium">{ch.title}</p>
                <p className="text-gray-400 text-xs">{ch.value}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <Ticket className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Destek Talebi Oluştur</p>
              <p className="text-gray-400 text-xs mt-0.5">Sorununuzu detaylı açıklayın, ekibimiz 24 saat içinde yanıtlasın.</p>
            </div>
            <Link
              href="/destek-talebi"
              className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              Oluştur
            </Link>
          </div>
        </div>

        <div className="text-center pb-4">
          <p className="text-gray-600 text-xs">tamirhanem.com v1.0</p>
          <p className="text-gray-700 text-xs mt-0.5">© 2026 TamirHanem</p>
        </div>
      </div>
    </div>
  );
}
