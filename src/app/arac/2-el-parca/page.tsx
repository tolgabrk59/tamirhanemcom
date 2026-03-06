import { Metadata } from 'next';
import CikmaParcaListClient from './CikmaParcaListClient';

export const metadata: Metadata = {
  title: '2.El Parça Pazaryeri | TamirHanem',
  description: 'Uygun fiyatlı 2.el oto yedek parçaları. Güvenilir satıcılardan motor, fren, süspansiyon ve daha fazla parça bulun.',
  keywords: '2.el parça, oto yedek parça, ikinci el parça, araç parçası, motor parçası, fren parçası',
  openGraph: {
    title: '2.El Parça Pazaryeri | TamirHanem',
    description: 'Uygun fiyatlı 2.el oto yedek parçaları. Güvenilir satıcılardan parça bulun.',
    url: 'https://tamirhanem.com/arac/2-el-parca',
    type: 'website',
  },
};

export default function CikmaParcaPage() {
  return <CikmaParcaListClient />;
}
