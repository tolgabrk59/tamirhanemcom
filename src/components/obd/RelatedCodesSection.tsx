'use client';

import Link from 'next/link';
import { Link2, ArrowRight, AlertCircle } from 'lucide-react';

interface RelatedCodesSectionProps {
  currentCode: string;
  relatedCodes?: string[];
  category?: string;
}

// Kategori bazlı ilişkili kodlar (fallback)
const categoryRelatedCodes: Record<string, string[]> = {
  'Motor': ['P0300', 'P0301', 'P0302', 'P0171', 'P0174', 'P0420'],
  'Yakıt Sistemi': ['P0171', 'P0172', 'P0174', 'P0175', 'P0300'],
  'Emisyon': ['P0420', 'P0430', 'P0440', 'P0442', 'P0455'],
  'Ateşleme': ['P0300', 'P0301', 'P0302', 'P0303', 'P0304'],
  'Sensörler': ['P0100', 'P0101', 'P0110', 'P0115', 'P0120'],
};

// Bazı popüler kodlar ve kısa açıklamaları
const codeDescriptions: Record<string, string> = {
  'P0300': 'Rastgele/Çoklu Silindir Ateşleme Hatası',
  'P0301': '1. Silindir Ateşleme Hatası',
  'P0302': '2. Silindir Ateşleme Hatası',
  'P0303': '3. Silindir Ateşleme Hatası',
  'P0304': '4. Silindir Ateşleme Hatası',
  'P0171': 'Sistem Çok Fakir (Bank 1)',
  'P0172': 'Sistem Çok Zengin (Bank 1)',
  'P0174': 'Sistem Çok Fakir (Bank 2)',
  'P0175': 'Sistem Çok Zengin (Bank 2)',
  'P0420': 'Katalitik Konvertör Verimliliği (Bank 1)',
  'P0430': 'Katalitik Konvertör Verimliliği (Bank 2)',
  'P0440': 'EVAP Sistemi Arızası',
  'P0442': 'EVAP Sistemi Küçük Sızıntı',
  'P0455': 'EVAP Sistemi Büyük Sızıntı',
  'P0100': 'MAF Sensör Devresi',
  'P0101': 'MAF Sensör Aralık/Performans',
  'P0110': 'IAT Sensör Devresi',
  'P0115': 'Motor Sıcaklık Sensörü Devresi',
  'P0120': 'Gaz Kelebeği Pozisyon Sensörü',
  'P0500': 'Hız Sensörü Arızası',
  'P0505': 'Rölanti Kontrol Sistemi',
};

export default function RelatedCodesSection({
  currentCode,
  relatedCodes,
  category,
}: RelatedCodesSectionProps) {
  // İlişkili kodları belirle
  let codes = relatedCodes || [];

  // Eğer ilişkili kod yoksa, kategoriye göre bul
  if (codes.length === 0 && category) {
    codes = categoryRelatedCodes[category] || [];
  }

  // Mevcut kodu listeden çıkar
  codes = codes.filter((code) => code.toUpperCase() !== currentCode.toUpperCase());

  // En fazla 6 kod göster
  codes = codes.slice(0, 6);

  if (codes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
      <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
        <Link2 className="w-6 h-6 text-indigo-500" />
        İlişkili Arıza Kodları
      </h2>
      <p className="text-secondary-500 mb-6">
        Bu arıza koduyla birlikte sıkça görülen veya ilişkili olabilecek diğer kodlar:
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {codes.map((code) => {
          const description = codeDescriptions[code.toUpperCase()];

          return (
            <Link
              key={code}
              href={`/obd/${code.toLowerCase()}`}
              className="group p-4 rounded-xl border-2 border-secondary-100 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                  <span className="text-sm font-bold text-indigo-600">{code.slice(0, 2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono font-bold text-indigo-600 group-hover:text-indigo-700">
                    {code.toUpperCase()}
                  </p>
                  {description && (
                    <p className="text-sm text-secondary-600 mt-1 line-clamp-2">
                      {description}
                    </p>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-secondary-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-indigo-700">
            Birden fazla arıza kodu görüyorsanız, genellikle ortak bir kök neden olabilir.
            Profesyonel bir teşhis için servisinize başvurmanızı öneririz.
          </p>
        </div>
      </div>
    </div>
  );
}
