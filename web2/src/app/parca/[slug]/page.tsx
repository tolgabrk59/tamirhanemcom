import { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const partsData: Record<string, { name: string; symptoms: string[]; causes: string[]; solutions: string[] }> = {
  'alternator': {
    name: 'Alternatör',
    symptoms: ['Akü sürekli bitiyor', 'Farlar sönük yanıyor', 'Elektrik aksamları çalışmıyor', 'Motor çalışırken vızıltı sesi'],
    causes: ['Diyot arızası', 'Rulman yıpranması', 'Regülatör bozukluğu', 'Kayış gevşekliği'],
    solutions: ['Alternatör değişimi', 'Diyot değişimi', 'Regülatör onarımı', 'Kayış sıkıştırma'],
  },
  'mars-motoru': {
    name: 'Marş Motoru',
    symptoms: ['Araç çalışmıyor', 'Tıkırtı sesi geliyor', 'Marş yavaş dönüyor', 'Marş dönmüyor'],
    causes: ['Fırça aşınması', 'Selenoid arızası', 'Rulman bozulması', 'Elektrik bağlantısı sorunu'],
    solutions: ['Marş motoru değişimi', 'Fırça değişimi', 'Selenoid değişimi', 'Bağlantı tamiri'],
  },
  'buji': {
    name: 'Buji',
    symptoms: ['Motor tekleme yapıyor', 'Performans düşüklüğü', 'Yakıt tüketimi arttı', 'Çalışma zorluğu'],
    causes: ['Buji aşınması', 'Elektrot kirlenmesi', 'Yanlış buji tipi', 'Aşırı ısınma'],
    solutions: ['Buji değişimi', 'Buji temizliği', 'Doğru buji seçimi', 'Soğutma sistemi kontrolü'],
  },
  'katalitik-konvertor': {
    name: 'Katalitik Konvertör',
    symptoms: ['Çürük yumurta kokusu', 'Motor gücü düştü', 'Rölanti düzensiz', 'Check engine ışığı'],
    causes: ['İç yapı tıkanıklığı', 'Isı hasarı', 'Kurum birikimi', 'Fiziksel hasar'],
    solutions: ['Katalitik konvertör temizliği', 'Katalitik konvertör değişimi', 'Motor ayarı', 'Yakıt sistemi temizliği'],
  },
  'yakit-pompasi': {
    name: 'Yakıt Pompası',
    symptoms: ['Araç çalışmıyor', 'Tekleme yapıyor', 'Ani stop etme', 'Performans kaybı'],
    causes: ['Pompa motoru arızası', 'Filtre tıkanıklığı', 'Elektrik sorunu', 'Basınç regülatörü arızası'],
    solutions: ['Yakıt pompası değişimi', 'Filtre değişimi', 'Elektrik bağlantısı onarımı', 'Basınç testi'],
  },
  'egr-valfi': {
    name: 'EGR Valfi',
    symptoms: ['Rölanti düzensizliği', 'Motor arıza lambası', 'Performans düşüklüğü', 'Yakıt tüketimi artışı'],
    causes: ['Kurum birikimi', 'Valf sıkışması', 'Elektrik arızası', 'Contalı kaçak'],
    solutions: ['EGR temizliği', 'EGR valfi değişimi', 'Elektrik onarımı', 'Conta değişimi'],
  },
  'pcv-valfi': {
    name: 'PCV Valfi',
    symptoms: ['Yağ sızıntısı', 'Düşük performans', 'Aşırı yağ tüketimi', 'Motor titreşimi'],
    causes: ['Valf tıkanıklığı', 'Contalı arıza', 'Kırık valf', 'Yanlış montaj'],
    solutions: ['PCV valfi temizliği', 'PCV valfi değişimi', 'Conta değişimi', 'Doğru montaj'],
  },
  'rot-basi': {
    name: 'Rot Başı',
    symptoms: ['Direksiyon titremesi', 'Lastik düzensiz aşınması', 'Gürültü', 'Yol tutuş sorunu'],
    causes: ['Aşınma', 'Darbe hasarı', 'Yağ kaçağı', 'Korozyon'],
    solutions: ['Rot başı değişimi', 'Rotil ayarı', 'Yağlama', 'Kontrol ve bakım'],
  },
  'teker-rulmani': {
    name: 'Teker Rulmanı',
    symptoms: ['Uğultu sesi', 'Titreme', 'Direksiyon oynaması', 'Lastik aşınması'],
    causes: ['Aşınma', 'Su sızıntısı', 'Darbe', 'Yağ eksikliği'],
    solutions: ['Rulman değişimi', 'Yağlama', 'Contalı değişimi', 'Tekerlek ayarı'],
  },
  'distributor': {
    name: 'Distribütör',
    symptoms: ['Araç çalışmıyor', 'Tekleme', 'Ani stop', 'Performans kaybı'],
    causes: ['Puan aşınması', 'Kondansatör arızası', 'Rotor hasarı', 'Kurum birikimi'],
    solutions: ['Puan ayarı', 'Kondansatör değişimi', 'Rotor değişimi', 'Temizlik'],
  },
  'gaz-kelebegi': {
    name: 'Gaz Kelebeği',
    symptoms: ['Gaz tepkisizliği', 'Rölanti sorunu', 'Çekiş kaybı', 'Motor arıza lambası'],
    causes: ['Kurum birikimi', 'Sensör arızası', 'Elektrik sorunu', 'Mekanik hasar'],
    solutions: ['Gaz kelebeği temizliği', 'Sensör değişimi', 'Elektrik onarımı', 'Adaptasyon'],
  },
  'yakit-basinc-regulatoru': {
    name: 'Yakıt Basınç Regülatörü',
    symptoms: ['Zengin karışım', 'Yakıt kokusu', 'Çalışma zorluğu', 'Performans kaybı'],
    causes: ['Diyafram yırtılması', 'Yay zayıflaması', 'Tıkanıklık', 'Contalı kaçak'],
    solutions: ['Regülatör değişimi', 'Sistem temizliği', 'Contalı değişimi', 'Basınç testi'],
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const part = partsData[resolvedParams.slug];
  
  if (!part) {
    return { title: 'Parça Bulunamadı' };
  }

  return {
    title: `${part.name} Arızası - Belirtiler ve Çözümler`,
    description: `${part.name} arızasının belirtileri, nedenleri ve çözüm yolları. Detaylı teşhis rehberi.`,
  };
}

export default async function ParcaPage({ params }: PageProps) {
  const resolvedParams = await params;
  const part = partsData[resolvedParams.slug];

  if (!part) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">Parça Bulunamadı</h1>
          <Link href="/oto-parca-belirtileri" className="text-primary-600 hover:text-primary-700">
            Tüm parçaları gör
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/oto-parca-belirtileri" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Tüm Parçalar
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-8 mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-6">{part.name} Arızası</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-secondary-900 mb-3">Belirtiler</h2>
              <ul className="space-y-2">
                {part.symptoms.map((s, i) => (
                  <li key={i} className="flex items-center gap-2 text-secondary-600">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-secondary-900 mb-3">Olası Nedenler</h2>
              <ul className="space-y-2">
                {part.causes.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 text-secondary-600">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-primary-800 mb-3">Çözüm Önerileri</h2>
          <ul className="space-y-2">
            {part.solutions.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-primary-700">
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4">
          <Link href="/servisler" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
            Servis Bul
          </Link>
          <Link href="/ai/sohbet" className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors">
            AI Asistana Sor
          </Link>
        </div>
      </div>
    </div>
  );
}
