import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Oto Parça Belirtileri - Arızalı Parça Teşhisi',
  description: 'Arızalı oto parçalarının belirtilerini öğrenin. Alternatör, marş motoru, buji, katalitik konvertör ve daha fazlası.',
};

const parts = [
  { name: 'Alternatör', slug: 'alternator', symptoms: ['Akü bitmesi', 'Farlar sönük', 'Elektrik arızaları'] },
  { name: 'Marş Motoru', slug: 'mars-motoru', symptoms: ['Araç çalışmıyor', 'Tıkırtı sesi', 'Yavaş dönme'] },
  { name: 'Buji', slug: 'buji', symptoms: ['Tekleme', 'Performans düşüklüğü', 'Yakıt tüketimi artışı'] },
  { name: 'Katalitik Konvertör', slug: 'katalitik-konvertor', symptoms: ['Koku', 'Güç kaybı', 'Rölanti sorunu'] },
  { name: 'Yakıt Pompası', slug: 'yakit-pompasi', symptoms: ['Çalışmama', 'Tekleme', 'Stop etme'] },
  { name: 'EGR Valfi', slug: 'egr-valfi', symptoms: ['Rölanti düzensizliği', 'Motor arıza ışığı', 'Performans kaybı'] },
  { name: 'PCV Valfi', slug: 'pcv-valfi', symptoms: ['Yağ sızıntısı', 'Düşük performans', 'Asiri yağ tüketimi'] },
  { name: 'Rot Başı', slug: 'rot-basi', symptoms: ['Titreme', 'Lastik aşınması', 'Ses'] },
  { name: 'Teker Rulmanı', slug: 'teker-rulmani', symptoms: ['Gürültü', 'Titreme', 'Oynama'] },
  { name: 'Distribütör', slug: 'distributor', symptoms: ['Çalışmama', 'Tekleme', 'Stop etme'] },
  { name: 'Gaz Kelebeği', slug: 'gaz-kelebegi', symptoms: ['Gaz tepkisizliği', 'Rölanti sorunu', 'Araç çekmiyor'] },
  { name: 'Yakıt Basınç Regülatörü', slug: 'yakit-basinc-regulatoru', symptoms: ['Zengin karışım', 'Yakıt kokusu', 'Çalışma zorluğu'] },
];

export default function OtoParcaBelirtileriPage() {
  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Oto Parça Belirtileri
          </h1>
          <p className="text-lg text-secondary-600">
            Arızalı parçaların belirtilerini tanıyın ve zamanında müdahale edin
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {parts.map((part, idx) => (
            <Link
              key={idx}
              href={`/parca/${part.slug}`}
              className="group bg-white p-6 rounded-xl shadow-sm border border-secondary-100 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-bold text-secondary-900 group-hover:text-primary-600 transition-colors mb-3">
                {part.name}
              </h3>
              <ul className="text-sm text-secondary-600 space-y-1">
                {part.symptoms.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                    {s}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
