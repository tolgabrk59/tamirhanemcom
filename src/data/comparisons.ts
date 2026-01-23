export interface CarSpecs {
    brand: string;
    model: string;
    year: number;
    price: string;
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    fuel: string;
    fuel_consumption: string;
    luggage: string; // Bagaj Hacmi
    image: string;
}

export interface Comparison {
    id: string;
    slug: string;
    title: string;
    segment: string;
    car1: CarSpecs;
    car2: CarSpecs;
    winner: 'car1' | 'car2' | 'tie';
    verdict: string;
    pros1: string[];
    pros2: string[];
}

export const comparisons: Comparison[] = [
    {
        id: '1',
        slug: 'fiat-egea-vs-renault-megane',
        title: 'Fiat Egea Sedan vs Renault Megane Sedan',
        segment: 'C-Sedan',
        car1: {
            brand: 'Fiat',
            model: 'Egea',
            year: 2024,
            price: '969.900 ₺',
            engine: '1.4 Fire',
            power: '95 HP',
            torque: '127 Nm',
            transmission: 'Manuel',
            fuel: 'Benzin',
            fuel_consumption: '6.4 L/100km',
            luggage: '520 L',
            image: 'https://images.pexels.com/photos/11099464/pexels-photo-11099464.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        car2: {
            brand: 'Renault',
            model: 'Megane',
            year: 2024,
            price: '1.182.000 ₺',
            engine: '1.3 TCe',
            power: '140 HP',
            torque: '240 Nm',
            transmission: 'EDC Otomatik',
            fuel: 'Benzin',
            fuel_consumption: '5.2 L/100km',
            luggage: '550 L',
            image: 'https://images.pexels.com/photos/10394779/pexels-photo-10394779.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        winner: 'car2',
        verdict: 'Renault Megane, daha güçlü turbo motoru, modern şanzımanı ve daha geniş bagaj hacmiyle teknik açıdan önde. Ancak Fiat Egea, fiyat/performans şampiyonu olarak bütçe dostu en iyi seçenek.',
        pros1: ['Çok daha uygun fiyat', 'Düşük bakım maliyetleri', 'Yaygın servis ağı'],
        pros2: ['Güçlü turbo motor', 'Daha kaliteli iç mekan', 'Gelişmiş güvenlik donanımları']
    },
    {
        id: '2',
        slug: 'renault-clio-vs-hyundai-i20',
        title: 'Renault Clio vs Hyundai i20',
        segment: 'B-Hatchback',
        car1: {
            brand: 'Renault',
            model: 'Clio',
            year: 2024,
            price: '870.000 ₺',
            engine: '1.0 TCe',
            power: '90 HP',
            torque: '160 Nm',
            transmission: 'X-Tronic',
            fuel: 'Benzin',
            fuel_consumption: '5.0 L/100km',
            luggage: '391 L',
            image: 'https://images.pexels.com/photos/15674066/pexels-photo-15674066/free-photo-of-araba-otomobil-tasit-arac.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        car2: {
            brand: 'Hyundai',
            model: 'i20',
            year: 2024,
            price: '920.000 ₺',
            engine: '1.4 MPI',
            power: '100 HP',
            torque: '134 Nm',
            transmission: '6 İleri Otomatik',
            fuel: 'Benzin',
            fuel_consumption: '6.2 L/100km',
            luggage: '352 L',
            image: 'https://images.pexels.com/photos/20861611/pexels-photo-20861611/free-photo-of-sokak-araba-tasit-arac.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        winner: 'car1',
        verdict: 'Renault Clio, sınıfının en büyük bagaj hacmi ve daha ekonomik turbo motoruyla bu karşılaştırmanın galibi oluyor. Hyundai i20 ise daha geniş arka yaşam alanı sunuyor.',
        pros1: ['Geniş bagaj hacmi', 'Düşük yakıt tüketimi', 'Modern tasarım'],
        pros2: ['Geniş arka diz mesafesi', 'Tam otomatik şanzıman konforu', 'Zengin donanım']
    },
    {
        id: '3',
        slug: 'toyota-corolla-vs-honda-civic',
        title: 'Toyota Corolla vs Honda Civic',
        segment: 'C-Sedan',
        car1: {
            brand: 'Toyota',
            model: 'Corolla',
            year: 2024,
            price: '1.350.000 ₺',
            engine: '1.5 Vision',
            power: '125 HP',
            torque: '153 Nm',
            transmission: 'Multidrive S',
            fuel: 'Benzin',
            fuel_consumption: '5.8 L/100km',
            luggage: '471 L',
            image: 'https://images.pexels.com/photos/10351025/pexels-photo-10351025.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        car2: {
            brand: 'Honda',
            model: 'Civic',
            year: 2024,
            price: '1.715.000 ₺',
            engine: '1.5 VTEC Turbo',
            power: '182 HP',
            torque: '240 Nm',
            transmission: 'CVT',
            fuel: 'Benzin',
            fuel_consumption: '6.7 L/100km',
            luggage: '512 L',
            image: 'https://images.pexels.com/photos/14872016/pexels-photo-14872016.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        winner: 'car2',
        verdict: 'Honda Civic, performansı ve sürüş dinamikleriyle Corolla\'dan çok daha üstün bir sürüş zevki sunuyor. Ancak Toyota Corolla, fiyat avantajı ve sorunsuzluğu ile mantık evliliği seçeneği.',
        pros1: ['Uygun fiyat', 'Sorunsuz motor/şanzıman', 'İkinci el değeri'],
        pros2: ['Yüksek performans', 'Sportif sürüş', 'Geniş iç hacim']
    },
    {
        id: '4',
        slug: 'peugeot-3008-vs-nissan-qashqai',
        title: 'Peugeot 3008 vs Nissan Qashqai',
        segment: 'C-SUV',
        car1: {
            brand: 'Peugeot',
            model: '3008',
            year: 2024,
            price: '1.920.000 ₺',
            engine: '1.2 PureTech',
            power: '130 HP',
            torque: '230 Nm',
            transmission: 'EAT8',
            fuel: 'Benzin',
            fuel_consumption: '6.5 L/100km',
            luggage: '520 L',
            image: 'https://images.pexels.com/photos/9783307/pexels-photo-9783307.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        car2: {
            brand: 'Nissan',
            model: 'Qashqai',
            year: 2024,
            price: '1.850.000 ₺',
            engine: '1.3 DIG-T',
            power: '158 HP',
            torque: '270 Nm',
            transmission: 'X-Tronic',
            fuel: 'Benzin',
            fuel_consumption: '6.4 L/100km',
            luggage: '504 L',
            image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        winner: 'car1',
        verdict: 'Peugeot 3008, i-Cockpit tasarımı ve premium hissiyle öne çıkıyor. Nissan Qashqai ise hafif hibrit motoru ve konfor odaklı yapısıyla güçlü bir rakip, ancak 3008\'in tasarımı hala çok çekici.',
        pros1: ['Fütüristik iç tasarım', 'EAT8 şanzıman', 'Geniş bagaj'],
        pros2: ['Yumuşak hibrit teknolojisi', 'Konforlu süspansiyon', 'Güvenlik donanımları']
    },
    {
        id: '5',
        slug: 'volkswagen-golf-vs-opel-astra',
        title: 'Volkswagen Golf vs Opel Astra',
        segment: 'C-Hatchback',
        car1: {
            brand: 'Volkswagen',
            model: 'Golf',
            year: 2024,
            price: '1.650.000 ₺',
            engine: '1.0 eTSI',
            power: '110 HP',
            torque: '200 Nm',
            transmission: 'DSG',
            fuel: 'Benzin (Hibrit)',
            fuel_consumption: '4.5 L/100km',
            luggage: '381 L',
            image: 'https://images.pexels.com/photos/9743516/pexels-photo-9743516.jpeg?auto=compress&cs=tinysrgb&w=600'

        },
        car2: {
            brand: 'Opel',
            model: 'Astra',
            year: 2024,
            price: '1.550.000 ₺',
            engine: '1.2 PureTech',
            power: '130 HP',
            torque: '230 Nm',
            transmission: 'AT8',
            fuel: 'Benzin',
            fuel_consumption: '5.6 L/100km',
            luggage: '422 L',
            image: 'https://images.pexels.com/photos/15758801/pexels-photo-15758801/free-photo-of-araba-tasit-arac-tampon.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        winner: 'car2',
        verdict: 'Yeni Opel Astra, keskin tasarımı, daha güçlü motoru ve daha geniş bagajı ile Golf\'ün tahtını sallıyor. Fiyat avantajı da eklendiğinde Astra bu duellonun galibi.',
        pros1: ['Kusursuz ergonomi', 'Yüksek ikinci el değeri', 'Kaliteli malzemeler'],
        pros2: ['Cesur tasarim', 'Daha büyük bagaj', 'Güçlü motor']
    },
    {
        id: '6',
        slug: 'dacia-duster-vs-fiat-egea-cross',
        title: 'Dacia Duster vs Fiat Egea Cross',
        segment: 'C-Crossover',
        car1: {
            brand: 'Dacia',
            model: 'Duster',
            year: 2024,
            price: '1.150.000 ₺',
            engine: '1.3 TCe',
            power: '150 HP',
            torque: '250 Nm',
            transmission: 'EDC',
            fuel: 'Benzin',
            fuel_consumption: '6.4 L/100km',
            luggage: '478 L',
            image: 'https://images.pexels.com/photos/16382173/pexels-photo-16382173/free-photo-of-araba-tasit-arac-spor-araba.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        car2: {
            brand: 'Fiat',
            model: 'Egea Cross',
            year: 2024,
            price: '1.050.000 ₺',
            engine: '1.6 MultiJet',
            power: '130 HP',
            torque: '320 Nm',
            transmission: 'DCT',
            fuel: 'Dizel',
            fuel_consumption: '4.8 L/100km',
            luggage: '440 L',
            image: 'https://images.pexels.com/photos/12571131/pexels-photo-12571131.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        winner: 'car1',
        verdict: 'Eğer gerçek bir SUV hissi ve hafif arazi performansı istiyorsanız Duster. Ancak şehir içi ekonomi ve binek otomobil konforu arıyorsanız Egea Cross.',
        pros1: ['Gerçek SUV karakteri', 'Güçlü motor', 'Geniş iç hacim'],
        pros2: ['Dizel ekonomi', 'Şehir içi kıvraklık', 'Uygun parça fiyatları']
    },
    {
        id: '7',
        slug: 'mercedes-c200-vs-bmw-320i',
        title: 'Mercedes C200 vs BMW 320i',
        segment: 'D-Premium',
        car1: {
            brand: 'Mercedes',
            model: 'C200',
            year: 2024,
            price: '3.600.000 ₺',
            engine: '1.5 Turbo',
            power: '204 HP',
            torque: '300 Nm',
            transmission: '9G-Tronic',
            fuel: 'Benzin',
            fuel_consumption: '6.6 L/100km',
            luggage: '455 L',
            image: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        car2: {
            brand: 'BMW',
            model: '320i',
            year: 2024,
            price: '3.450.000 ₺',
            engine: '1.6 Turbo',
            power: '170 HP',
            torque: '250 Nm',
            transmission: 'ZF 8 İleri',
            fuel: 'Benzin',
            fuel_consumption: '7.3 L/100km',
            luggage: '480 L',
            image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        winner: 'car1',
        verdict: 'Mercedes C-Serisi, "Baby S-Class" lakabını hak eden konforu ve teknolojisiyle bir adım önde. BMW 320i sürüş dinamiklerinde hala lider olsa da, C200 genel pakette daha lüks hissettiriyor.',
        pros1: ['Muazzam iç tasarım', 'Konfor', 'Prestij'],
        pros2: ['Sürüş zevki', 'ZF şanzıman kalitesi', 'Geniş bagaj']
    },
    {
        id: '8',
        slug: 'vw-passat-vs-skoda-superb',
        title: 'Volkswagen Passat vs Skoda Superb',
        segment: 'D-Sedan',
        car1: {
            brand: 'Volkswagen',
            model: 'Passat',
            year: 2023,
            price: '2.100.000 ₺',
            engine: '1.5 TSI',
            power: '150 HP',
            torque: '250 Nm',
            transmission: 'DSG',
            fuel: 'Benzin',
            fuel_consumption: '5.4 L/100km',
            luggage: '586 L',
            image: 'https://images.pexels.com/photos/14022067/pexels-photo-14022067.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        car2: {
            brand: 'Skoda',
            model: 'Superb',
            year: 2024,
            price: '2.350.000 ₺',
            engine: '1.5 TSI',
            power: '150 HP',
            torque: '250 Nm',
            transmission: 'DSG',
            fuel: 'Benzin',
            fuel_consumption: '5.5 L/100km',
            luggage: '625 L',
            image: 'https://images.pexels.com/photos/11921319/pexels-photo-11921319.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        winner: 'car2',
        verdict: 'Passat üretimi dursa da hala ikonik. Ancak Superb, aynı altyapıyı kullanarak daha fazla özellik, daha geniş iç hacim ve devasa bir bagaj sunuyor. "Akılcı seçim" Superb.',
        pros1: ['Marka imajı', 'İkinci el likiditesi', 'Dengeli tasarım'],
        pros2: ['Devasa arka diz mesafesi', 'Liftback bagaj kapağı', 'Konfor']
    },
    {
        id: '9',
        slug: 'hyundai-tucson-vs-kia-sportage',
        title: 'Hyundai Tucson vs Kia Sportage',
        segment: 'C-SUV',
        car1: {
            brand: 'Hyundai',
            model: 'Tucson',
            year: 2024,
            price: '1.950.000 ₺',
            engine: '1.6 T-GDI',
            power: '180 HP',
            torque: '265 Nm',
            transmission: 'DCT',
            fuel: 'Benzin',
            fuel_consumption: '7.3 L/100km',
            luggage: '620 L',
            image: 'https://images.pexels.com/photos/12395669/pexels-photo-12395669.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        car2: {
            brand: 'Kia',
            model: 'Sportage',
            year: 2024,
            price: '2.050.000 ₺',
            engine: '1.6 T-GDI',
            power: '150 HP',
            torque: '250 Nm',
            transmission: 'DCT',
            fuel: 'Benzin (MHEV)',
            fuel_consumption: '6.9 L/100km',
            luggage: '591 L',
            image: 'https://images.pexels.com/photos/14583908/pexels-photo-14583908.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        winner: 'car1',
        verdict: 'Kardeş rekabetinde Tucson, fütüristik ön tasarımı ve kullanıcı dostu iç mekanıyla bir adım önde. Sportage ise daha etkileyici bir kavisli ekran sunuyor ancak dış tasarımı daha kutuplaştırıcı.',
        pros1: ['Etkileyici LED farlar', 'Geniş bagaj', 'Fiyat avantajı'],
        pros2: ['Kavisli ekran teknolojisi', 'Yüksek malzeme kalitesi', 'Modern arka tasarım']
    },
    {
        id: '10',
        slug: 'ford-focus-vs-toyota-corolla-hatchback',
        title: 'Ford Focus vs Toyota Corolla HB',
        segment: 'C-Hatchback',
        car1: {
            brand: 'Ford',
            model: 'Focus',
            year: 2024,
            price: '1.500.000 ₺',
            engine: '1.0 EcoBoost Hybrid',
            power: '155 HP',
            torque: '240 Nm',
            transmission: 'Powershift',
            fuel: 'Benzin',
            fuel_consumption: '5.5 L/100km',
            luggage: '375 L',
            image: 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        car2: {
            brand: 'Toyota',
            model: 'Corolla HB',
            year: 2024,
            price: '1.480.000 ₺',
            engine: '1.8 Hybrid',
            power: '140 HP',
            torque: '185 Nm',
            transmission: 'e-CVT',
            fuel: 'Hibrit',
            fuel_consumption: '4.5 L/100km',
            luggage: '361 L',
            image: 'https://images.pexels.com/photos/16847844/pexels-photo-16847844/free-photo-of-araba-tasit-arac-tampon.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        winner: 'car2',
        verdict: 'Eğer sürüş keyfi arıyorsanız Focus rakipsizdir. Ancak yakıt ekonomisi ve sorunsuzluk önceliğinizse, tam hibrit teknolojisiyle Corolla Hatchback şehiriçinde mucizeler yaratıyor.',
        pros1: ['Sınıfının en iyi yol tutuşu', 'Güçlü ve verimli motor', 'SYNC 4 ekran'],
        pros2: ['İnanılmaz yakıt ekonomisi', 'Sessiz sürüş', 'Toyota sağlamlığı']
    },
    {
        id: '11',
        slug: 'opel-corsa-vs-peugeot-208',
        title: 'Opel Corsa vs Peugeot 208',
        segment: 'B-Hatchback',
        car1: {
            brand: 'Opel',
            model: 'Corsa',
            year: 2024,
            price: '1.050.000 ₺',
            engine: '1.2 Turbo',
            power: '100 HP',
            torque: '205 Nm',
            transmission: 'AT8',
            fuel: 'Benzin',
            fuel_consumption: '5.4 L/100km',
            luggage: '309 L',
            image: 'https://images.pexels.com/photos/10214695/pexels-photo-10214695.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        car2: {
            brand: 'Peugeot',
            model: '208',
            year: 2024,
            price: '1.100.000 ₺',
            engine: '1.2 PureTech',
            power: '100 HP',
            torque: '205 Nm',
            transmission: 'EAT8',
            fuel: 'Benzin',
            fuel_consumption: '5.4 L/100km',
            luggage: '311 L',
            image: 'https://images.pexels.com/photos/15164472/pexels-photo-15164472/free-photo-of-peugeot-208-allure.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        winner: 'car1',
        verdict: 'Aynı altyapıyı (Stellantis) paylaşan iki kardeş. 208 tasarımıyla büyülüyor ancak Corsa, daha kullanışlı kokpiti ve Almanya kökenli sade yaklaşımıyla fiyat avantajını birleştiriyor.',
        pros1: ['Fiyat avantajı', 'Kullanışlı kokpit', 'Matrix LED far seçeneği'],
        pros2: ['Etkileyici dış tasarım', 'i-Cockpit', 'Genç ruh']
    },
    {
        id: '12',
        slug: 'citroen-c4-vs-peugeot-2008',
        title: 'Citroen C4 vs Peugeot 2008',
        segment: 'B-Crossover',
        car1: {
            brand: 'Citroen',
            model: 'C4',
            year: 2024,
            price: '1.300.000 ₺',
            engine: '1.2 PureTech',
            power: '130 HP',
            torque: '230 Nm',
            transmission: 'EAT8',
            fuel: 'Benzin',
            fuel_consumption: '5.9 L/100km',
            luggage: '380 L',
            image: 'https://images.pexels.com/photos/16601449/pexels-photo-16601449/free-photo-of-yol-peyzaj-araba-tasit.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        car2: {
            brand: 'Peugeot',
            model: '2008',
            year: 2024,
            price: '1.450.000 ₺',
            engine: '1.2 PureTech',
            power: '130 HP',
            torque: '230 Nm',
            transmission: 'EAT8',
            fuel: 'Benzin',
            fuel_consumption: '6.0 L/100km',
            luggage: '434 L',
            image: 'https://images.pexels.com/photos/18369299/pexels-photo-18369299/free-photo-of-siyah-ve-beyaz-sokak-araba-tasit.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        winner: 'car1',
        verdict: 'Citroen C4, "Uçan Halı" süspansiyonlarıyla sınıfının en konforlu aracı. 2008 ise daha premium hissettiriyor ama C4\'ün sunduğu konfor ve fiyat avantajı, onu aileler için bir adım öne geçiriyor.',
        pros1: ['Rakipsiz süspansiyon konforu', 'Yumuşak koltuklar', 'Sıradışı tasarım'],
        pros2: ['Premium iç mekan', 'Daha büyük bagaj', 'SUV duruşu']
    },
    {
        id: '13',
        slug: 'honda-city-vs-renault-taliant',
        title: 'Honda City vs Renault Taliant',
        segment: 'B-Sedan',
        car1: {
            brand: 'Honda',
            model: 'City',
            year: 2024,
            price: '1.150.000 ₺',
            engine: '1.5 i-VTEC',
            power: '121 HP',
            torque: '145 Nm',
            transmission: 'CVT',
            fuel: 'Benzin',
            fuel_consumption: '6.2 L/100km',
            luggage: '519 L',
            image: 'https://images.pexels.com/photos/13622438/pexels-photo-13622438.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        car2: {
            brand: 'Renault',
            model: 'Taliant',
            year: 2024,
            price: '950.000 ₺',
            engine: '1.0 Turbo X-Tronic',
            power: '90 HP',
            torque: '142 Nm',
            transmission: 'CVT',
            fuel: 'Benzin',
            fuel_consumption: '6.1 L/100km',
            luggage: '628 L',
            image: 'https://images.pexels.com/photos/18873059/pexels-photo-18873059/free-photo-of-kent-sehir-yol-sokak.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        winner: 'car1',
        verdict: 'Taliant fiyatıyla cazip olsa da, Honda City sunduğu motor performansı, malzeme kalitesi ve güvenlik donanımlarıyla daha "otomobil" hissi veriyor. Uzun vadede City daha memnun edecektir.',
        pros1: ['Güçlü atmosferik motor', 'Geniş arka yaşam alanı', 'Honda kalitesi'],
        pros2: ['Çok uygun fiyat', 'Devasa bagaj', 'Düşük yakıt tüketimi']
    },
    {
        id: '14',
        slug: 'vw-polo-vs-seat-ibiza',
        title: 'Volkswagen Polo vs Seat Ibiza',
        segment: 'B-Hatchback',
        car1: {
            brand: 'Volkswagen',
            model: 'Polo',
            year: 2024,
            price: '1.200.000 ₺',
            engine: '1.0 TSI',
            power: '95 HP',
            torque: '175 Nm',
            transmission: 'DSG',
            fuel: 'Benzin',
            fuel_consumption: '5.2 L/100km',
            luggage: '351 L',
            image: 'https://images.pexels.com/photos/14183783/pexels-photo-14183783.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        car2: {
            brand: 'Seat',
            model: 'Ibiza',
            year: 2024,
            price: '1.100.000 ₺',
            engine: '1.0 EcoTSI',
            power: '110 HP',
            torque: '200 Nm',
            transmission: 'DSG',
            fuel: 'Benzin',
            fuel_consumption: '5.0 L/100km',
            luggage: '355 L',
            image: 'https://images.pexels.com/photos/10029767/pexels-photo-10029767.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        winner: 'car2',
        verdict: 'Aynı motor, aynı şanzıman, aynı altyapı. Ancak Seat Ibiza, hem daha güçlü (110HP vs 95HP) hem de daha ucuz. Polo marka imajı satarken, Ibiza değer satıyor.',
        pros1: ['Daha yüksek kalite algısı', 'İkinci el değeri', 'Tok sürüş'],
        pros2: ['Fiyat/Performans', 'Daha güçlü motor', 'Genç tasarım']
    },
    {
        id: '15',
        slug: 'audi-a3-vs-bmw-118i',
        title: 'Audi A3 Sportback vs BMW 118i',
        segment: 'C-Premium',
        car1: {
            brand: 'Audi',
            model: 'A3',
            year: 2024,
            price: '2.400.000 ₺',
            engine: '35 TFSI (1.5)',
            power: '150 HP',
            torque: '250 Nm',
            transmission: 'S tronic',
            fuel: 'Benzin',
            fuel_consumption: '5.9 L/100km',
            luggage: '380 L',
            image: 'https://images.pexels.com/photos/14084661/pexels-photo-14084661.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        car2: {
            brand: 'BMW',
            model: '118i',
            year: 2024,
            price: '2.300.000 ₺',
            engine: '1.5 Turbo',
            power: '140 HP',
            torque: '220 Nm',
            transmission: 'DCT',
            fuel: 'Benzin',
            fuel_consumption: '6.1 L/100km',
            luggage: '380 L',
            image: 'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        winner: 'car1',
        verdict: 'Audi A3, keskin hatları ve yüksek teknolojik iç mekanıyla daha taze hissettiriyor. BMW 1 serisi önden çekişe geçtikten sonra sürüş karakterini biraz kaybetti. A3 genel toplamda daha iyi bir paket.',
        pros1: ['Modern iç mekan', 'Dengeli sürüş', 'Yüksek kalite'],
        pros2: ['Sportif direksiyon hissi', 'Marka prestiji', 'Multimedya sistemi']
    }
];
