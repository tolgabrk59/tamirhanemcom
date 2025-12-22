import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aracim Ne Kadar? - Arac Deger Hesaplama | TamirHanem',
  description:
    'Aracinizin tahmini piyasa degerini hesaplayin. Marka, model, yil ve kilometre bilgilerini girerek 2. el arac fiyatinizi ogrenin.',
  keywords: [
    'arac degeri hesaplama',
    'arabam kac para',
    'arac fiyat hesaplama',
    '2. el arac degeri',
    'ikinci el araba fiyati',
    'arac degerleme',
    'oto fiyat',
  ],
  openGraph: {
    title: 'Aracim Ne Kadar? - Arac Deger Hesaplama | TamirHanem',
    description: 'Aracinizin tahmini piyasa degerini hesaplayin.',
    url: 'https://tamirhanem.com/arac-degeri',
  },
};

export default function AracDegeriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
