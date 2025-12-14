import type { Review } from '@/types';

export const reviewsData: Review[] = [
  {
    id: 1,
    name: 'Ahmet Y.',
    rating: 5,
    comment: 'BMW 320d aracımda P0420 katalitik konvertör hatası vardı. TamirHanem sayesinde sorunu hızlıca teşhis ettim ve uygun fiyatlı bir servis buldum. Önce oksijen sensörü değişimi denendi ve sorun çözüldü. Bana binlerce lira kazandırdılar!',
    date: '2024-11-15',
    vehicleBrand: 'BMW',
    vehicleModel: '320d',
    service: 'Motor Arıza Teşhis'
  },
  {
    id: 2,
    name: 'Zeynep K.',
    rating: 5,
    comment: 'Mercedes C200\'ümün Airmatic süspansiyon sorunu için 4 farklı servisten teklif aldım. Fiyatlar arasında ciddi fark vardı. TamirHanem\'in karşılaştırma özelliği ile en kaliteli ve uygun servisi seçtim. Tam şeffaflık!',
    date: '2024-11-10',
    vehicleBrand: 'Mercedes',
    vehicleModel: 'C200',
    service: 'Süspansiyon Tamiri'
  },
  {
    id: 3,
    name: 'Mehmet A.',
    rating: 4,
    comment: 'Renault Megane\'ımda EDC şanzıman titremesi vardı. OBD kodlarını okutup TamirHanem\'de araştırdım. Hangi parçaların değişmesi gerektiğini öğrendim ve bilinçli şekilde servise gittim. Artık her bakımdan önce buraya danışıyorum.',
    date: '2024-10-28',
    vehicleBrand: 'Renault',
    vehicleModel: 'Megane',
    service: 'Şanzıman Bakımı'
  },
  {
    id: 4,
    name: 'Elif S.',
    rating: 5,
    comment: 'Aracımda Check Engine lambası yandı ve ne yapacağımı bilmiyordum. TamirHanem\'deki OBD kod açıklamaları sayesinde P0171 kodunun ne anlama geldiğini, olası nedenleri ve tahmini maliyeti öğrendim. Gerçekten çok faydalı bir platform.',
    date: '2024-10-15',
    vehicleBrand: 'Volkswagen',
    vehicleModel: 'Golf',
    service: 'Motor Arıza Teşhis'
  },
  {
    id: 5,
    name: 'Can B.',
    rating: 5,
    comment: 'Fiyat hesaplama aracı harika! Fren balatası değişimi için servise gitmeden önce yaklaşık maliyeti öğrendim. Servis de benzer fiyat verdi, sürpriz olmadı. Güven veriyor.',
    date: '2024-10-05',
    vehicleBrand: 'Audi',
    vehicleModel: 'A4',
    service: 'Fren Bakımı'
  }
];

export function getRecentReviews(count: number = 3): Review[] {
  return reviewsData
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export function getReviewsByBrand(brand: string): Review[] {
  return reviewsData.filter(
    (r) => r.vehicleBrand?.toLowerCase() === brand.toLowerCase()
  );
}
