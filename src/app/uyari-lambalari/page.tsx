import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Araç Uyarı Lambaları - Gösterge Paneli İşaretleri',
  description: 'Araçınızdaki tüm uyarı lambalarının anlamlarını öğrenin. Motor, fren, ABS, airbag ve daha fazlası için rehber.',
};

const warningLights = [
  { name: 'Motor Kontrol Lambası', color: 'yellow', desc: 'Motor sisteminde sorun olabilir', slug: 'check-engine' },
  { name: 'Fren Uyarı Lambası', color: 'red', desc: 'Fren sisteminde sorun veya el freni çekili', slug: 'fren' },
  { name: 'ABS Lambası', color: 'yellow', desc: 'ABS sisteminde arıza', slug: 'abs' },
  { name: 'Hava Yastığı Lambası', color: 'red', desc: 'Airbag sisteminde sorun', slug: 'airbag' },
  { name: 'Akü Lambası', color: 'red', desc: 'Şarj sisteminde sorun', slug: 'aku' },
  { name: 'Yağ Basıncı Lambası', color: 'red', desc: 'Motor yağı basıncı düşük', slug: 'yag-basinci' },
  { name: 'Soğutma Suyu Lambası', color: 'red', desc: 'Motor aşırı ısınmış', slug: 'sogutma' },
  { name: 'Lastik Basıncı Lambası', color: 'yellow', desc: 'Lastik basıncı düşük', slug: 'lastik-basinci' },
  { name: 'ESP/TCS Lambası', color: 'yellow', desc: 'Stabilite kontrol sisteminde sorun', slug: 'esp' },
  { name: 'Direksiyon Lambası', color: 'yellow', desc: 'Servo direksiyon sorunu', slug: 'direksiyon' },
  { name: 'Yakıt Lambası', color: 'yellow', desc: 'Yakıt azaldı', slug: 'yakit' },
  { name: 'Emisyon Lambası', color: 'yellow', desc: 'Egzoz emisyon sorunu', slug: 'emisyon' },
];

export default function UyariLambalariPage() {
  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Araç Uyarı Lambaları
          </h1>
          <p className="text-lg text-secondary-600">
            Gösterge panelinizdeki işaretlerin anlamlarını öğrenin
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {warningLights.map((light, idx) => (
            <Link
              key={idx}
              href={`/ariza-rehberi/${light.slug}-lambasi`}
              className="group bg-white p-6 rounded-xl shadow-sm border border-secondary-100 hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${light.color === 'red' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                <div className={`w-6 h-6 rounded-full ${light.color === 'red' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
              </div>
              <h3 className="text-lg font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
                {light.name}
              </h3>
              <p className="text-secondary-600 text-sm mt-1">{light.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">⚠️ Önemli Uyarı</h2>
          <p className="text-red-700">
            Kırmızı uyarı lambaları ciddi sorunları gösterir. Aracı güvenli bir yere çekin ve profesyonel yardım alın.
          </p>
        </div>
      </div>
    </div>
  );
}
