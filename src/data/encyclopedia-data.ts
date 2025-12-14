export interface EncyclopediaComponent {
    id: string;
    name: string;
    slug: string;
    description: string;
    function: string;
    symptoms: string[];
    repairAdvice: string[];
    estimatedCost?: { min: number; max: number };
    laborTime?: string;
    relatedComponents?: string[];
}

export interface EncyclopediaSubsystem {
    id: string;
    name: string;
    slug: string;
    description: string;
    components: EncyclopediaComponent[];
}

export interface EncyclopediaSystem {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
    subsystems?: EncyclopediaSubsystem[];
    components: EncyclopediaComponent[];
}

export const encyclopediaSystems: EncyclopediaSystem[] = [
    {
        id: 'motor',
        name: 'Motor Sistemi',
        slug: 'motor-sistemi',
        description: 'Aracınızın kalbi olan motor sistemi, yakıtı güce dönüştürerek aracınızı hareket ettirir.',
        icon: 'engine',
        color: 'red',
        subsystems: [
            {
                id: 'zamanlama',
                name: 'Zamanlama Sistemi',
                slug: 'zamanlama-sistemi',
                description: 'Motor zamanlamasını kontrol eden kritik bileşenler.',
                components: [
                    {
                        id: 'triger-kayisi',
                        name: 'Triger Kayışı (Timing Belt)',
                        slug: 'triger-kayisi',
                        description: 'Motor zamanlamasını sağlayan kritik kayış.',
                        function: 'Krank mili ile kam milini senkronize ederek supapların doğru zamanda açılıp kapanmasını sağlar.',
                        symptoms: ['Motordan tıkırtı sesi', 'Motor çalışırken titreme', 'Motor performans kaybı', 'Motor çalışmıyor'],
                        repairAdvice: ['60.000-100.000 km\'de değiştirilmeli', 'Su pompası ile birlikte değiştirilmeli', 'Gergi ve rulmanlarda kontrol edilmeli'],
                        estimatedCost: { min: 2000, max: 5000 },
                        laborTime: '3-5 saat'
                    },
                    {
                        id: 'triger-zinciri',
                        name: 'Triger Zinciri (Timing Chain)',
                        slug: 'triger-zinciri',
                        description: 'Metal zincir ile zamanlama sağlar.',
                        function: 'Kayış yerine zincir kullanarak daha uzun ömürlü zamanlama sağlar.',
                        symptoms: ['Motordan zincir sesi', 'Soğuk çalıştırmada gürültü', 'Motor performans kaybı'],
                        repairAdvice: ['150.000+ km ömürlü', 'Gergi kontrol edilmeli', 'Yağ değişimi düzenli yapılmalı'],
                        estimatedCost: { min: 3000, max: 8000 },
                        laborTime: '4-6 saat'
                    },
                    {
                        id: 'triger-gergi',
                        name: 'Triger Gergisi (Timing Belt Tensioner)',
                        slug: 'triger-gergi',
                        description: 'Triger kayışının gerginliğini sağlar.',
                        function: 'Kayışın doğru gerginlikte kalmasını sağlayarak kayma ve kopma riskini önler.',
                        symptoms: ['Kayıştan cırlama sesi', 'Motor zamanlaması bozuk', 'Kayış atlaması'],
                        repairAdvice: ['Kayış ile birlikte değiştirilmeli', 'Rulman kontrol edilmeli'],
                        estimatedCost: { min: 500, max: 1500 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'kam-mili',
                        name: 'Kam Mili (Camshaft)',
                        slug: 'kam-mili',
                        description: 'Supapları açıp kapatan mil.',
                        function: 'Dönerek supapları belirli sırada açıp kapatır.',
                        symptoms: ['Motor performans kaybı', 'Yakıt tüketimi artışı', 'Motor çalışmıyor'],
                        repairAdvice: ['Aşınma varsa değiştirilmeli', 'Yağlama kritik', 'Kam sensörü kontrol edilmeli'],
                        estimatedCost: { min: 3000, max: 10000 },
                        laborTime: '6-10 saat'
                    },
                    {
                        id: 'kam-sensoru',
                        name: 'Kam Sensörü (Camshaft Position Sensor)',
                        slug: 'kam-sensoru',
                        description: 'Kam mili pozisyonunu algılar.',
                        function: 'Kam milinin pozisyonunu ECU\'ya bildirir.',
                        symptoms: ['Check engine lambası', 'Motor çalışmıyor', 'Performans kaybı'],
                        repairAdvice: ['Arızalı sensör değiştirilmeli', 'Elektrik bağlantıları kontrol edilmeli'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'kam-keceleri',
                        name: 'Kam Keçeleri (Camshaft Seal)',
                        slug: 'kam-keceleri',
                        description: 'Kam milinden yağ sızıntısını önler.',
                        function: 'Kam mili çıkışlarında sızdırmazlık sağlar.',
                        symptoms: ['Yağ sızıntısı', 'Yağ seviyesi düşüyor', 'Motor bölgesinde yağ'],
                        repairAdvice: ['Sızıntı varsa değiştirilmeli', 'Triger değişiminde kontrol edilmeli'],
                        estimatedCost: { min: 500, max: 1500 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'timing-cover',
                        name: 'Zamanlama Kapağı (Timing Cover)',
                        slug: 'timing-cover',
                        description: 'Zamanlama mekanizmasını korur.',
                        function: 'Triger kayışı/zincirini dış etkenlerden korur.',
                        symptoms: ['Yağ sızıntısı', 'Kapaktan gürültü'],
                        repairAdvice: ['Conta ile birlikte değiştirilmeli', 'Vidalar doğru torkta sıkılmalı'],
                        estimatedCost: { min: 800, max: 2500 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'balance-shaft',
                        name: 'Denge Mili (Balance Shaft)',
                        slug: 'balance-shaft',
                        description: 'Motor titreşimini azaltır.',
                        function: 'Motor dengesizliğini gidererek titreşimi azaltır.',
                        symptoms: ['Aşırı titreşim', 'Gürültü'],
                        repairAdvice: ['Rulman kontrol edilmeli', 'Yağlama önemli'],
                        estimatedCost: { min: 2000, max: 5000 },
                        laborTime: '4-6 saat'
                    },
                    {
                        id: 'triger-rulman',
                        name: 'Triger Rulmanı (Timing Belt Idler)',
                        slug: 'triger-rulman',
                        description: 'Triger kayışını yönlendirir.',
                        function: 'Kayışın doğru yolda gitmesini sağlar.',
                        symptoms: ['Gürültü', 'Kayış aşınması'],
                        repairAdvice: ['Triger değişiminde yenilenmeli'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '3-5 saat (triger ile birlikte)'
                    },
                    {
                        id: 'zincir-gergisi',
                        name: 'Zincir Gergisi (Timing Chain Tensioner)',
                        slug: 'zincir-gergisi',
                        description: 'Triger zincirinin gerginliğini sağlar.',
                        function: 'Zincirin doğru gerginlikte kalmasını sağlar.',
                        symptoms: ['Zincir sesi', 'Motor zamanlaması bozuk'],
                        repairAdvice: ['Zincir değişiminde yenilenmeli'],
                        estimatedCost: { min: 800, max: 2500 },
                        laborTime: '4-6 saat'
                    }
                ]
            },
            {
                id: 'atesleme',
                name: 'Ateşleme Sistemi',
                slug: 'atesleme-sistemi',
                description: 'Yakıt-hava karışımını ateşleyen sistem.',
                components: [
                    {
                        id: 'buji',
                        name: 'Buji (Spark Plug)',
                        slug: 'buji',
                        description: 'Yakıt karışımını ateşleyen parça.',
                        function: 'Yüksek voltajla kıvılcım oluşturarak yakıt-hava karışımını yakar.',
                        symptoms: ['Motor titremesi', 'Zor çalışma', 'Yakıt tüketimi artışı', 'Güç kaybı'],
                        repairAdvice: ['20.000-40.000 km\'de değiştirilmeli', 'Tüm bujiler birlikte değişmeli', 'Doğru tip buji kullanılmalı'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'atesleme-bobini',
                        name: 'Ateşleme Bobini (Ignition Coil)',
                        slug: 'atesleme-bobini',
                        description: 'Bujilere yüksek voltaj sağlar.',
                        function: '12V\'u 20.000-40.000V\'a yükselterek bujilere iletir.',
                        symptoms: ['Motor titremesi', 'Güç kaybı', 'Check engine lambası', 'Zor çalışma'],
                        repairAdvice: ['Arızalı bobin değiştirilmeli', 'Elektrik bağlantıları kontrol edilmeli', 'Nem hasara yol açar'],
                        estimatedCost: { min: 800, max: 2500 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'atesleme-kablolari',
                        name: 'Ateşleme Kabloları (Spark Plug Wires)',
                        slug: 'atesleme-kablolari',
                        description: 'Bobinden bujilere voltaj iletir.',
                        function: 'Yüksek voltajı bobinden bujilere güvenli şekilde iletir.',
                        symptoms: ['Motor titremesi', 'Performans kaybı', 'Yakıt tüketimi artışı'],
                        repairAdvice: ['Çatlak veya yıpranmış kablolar değiştirilmeli', 'Nem ve ısıdan korunmalı'],
                        estimatedCost: { min: 300, max: 1000 },
                        laborTime: '30 dakika'
                    },
                    {
                        id: 'distributor',
                        name: 'Distribütör (Distributor)',
                        slug: 'distributor',
                        description: 'Ateşleme zamanlamasını dağıtır.',
                        function: 'Ateşleme sinyalini doğru silindire doğru zamanda gönderir.',
                        symptoms: ['Motor çalışmıyor', 'Ateşleme zamanlaması bozuk', 'Performans kaybı'],
                        repairAdvice: ['Eski motorlarda bulunur', 'Kapak ve rotor kontrol edilmeli'],
                        estimatedCost: { min: 1000, max: 3000 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'platinum-buji',
                        name: 'Platin/İridyum Buji (Platinum/Iridium Spark Plug)',
                        slug: 'platinum-buji',
                        description: 'Uzun ömürlü premium buji.',
                        function: 'Normal bujiden daha uzun ömürlü ve verimli.',
                        symptoms: ['Motor titremesi', 'Zor çalışma'],
                        repairAdvice: ['100.000+ km ömürlü', 'Daha pahalı ama uzun ömürlü'],
                        estimatedCost: { min: 800, max: 2000 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'enjeksiyon-enjektoru-kecesi',
                        name: 'Yakıt Enjektörü Keçeleri (Fuel Injector Seals)',
                        slug: 'enjeksiyon-enjektoru-kecesi',
                        description: 'Enjektör sızdırmazlık keçeleri.',
                        function: 'Enjektörlerin sızdırmazlığını sağlar.',
                        symptoms: ['Yakıt sızıntısı', 'Yakıt kokusu'],
                        repairAdvice: ['Enjektör değişiminde yenilenmeli'],
                        estimatedCost: { min: 200, max: 600 },
                        laborTime: '1-2 saat'
                    }
                ]
            },
            {
                id: 'motor-blok',
                name: 'Motor Blok ve Parçaları',
                slug: 'motor-blok',
                description: 'Motorun ana yapısal bileşenleri.',
                components: [
                    {
                        id: 'silindir-kapagi',
                        name: 'Silindir Kapağı (Cylinder Head)',
                        slug: 'silindir-kapagi',
                        description: 'Yanma odasını oluşturan üst kapak.',
                        function: 'Supapları, kam milini ve yanma odasını barındırır.',
                        symptoms: ['Aşırı ısınma', 'Güç kaybı', 'Beyaz duman', 'Yağ-su karışması'],
                        repairAdvice: ['Çatlak varsa tamir veya değişim', 'Conta değişimi kritik', 'Düzleştirme gerekebilir'],
                        estimatedCost: { min: 5000, max: 15000 },
                        laborTime: '8-12 saat'
                    },
                    {
                        id: 'motor-blogu',
                        name: 'Motor Bloğu (Engine Block)',
                        slug: 'motor-blogu',
                        description: 'Motorun ana gövdesi.',
                        function: 'Silindirler, krank mili ve pistonları barındırır.',
                        symptoms: ['Çatlak', 'Aşırı ısınma', 'Yağ sızıntısı'],
                        repairAdvice: ['Çatlak varsa tamir veya motor değişimi', 'Çok pahalı onarım'],
                        estimatedCost: { min: 15000, max: 50000 },
                        laborTime: '20-40 saat'
                    },
                    {
                        id: 'pistonlar',
                        name: 'Pistonlar (Pistons)',
                        slug: 'pistonlar',
                        description: 'Yanma gücünü harekete çevirir.',
                        function: 'Yanma basıncını krank miline iletir.',
                        symptoms: ['Motor vuruntu', 'Güç kaybı', 'Mavi duman', 'Yağ tüketimi'],
                        repairAdvice: ['Segmanlar ile birlikte değiştirilmeli', 'Silindir honlanmalı'],
                        estimatedCost: { min: 4000, max: 12000 },
                        laborTime: '10-15 saat'
                    },
                    {
                        id: 'krank-mili',
                        name: 'Krank Mili (Crankshaft)',
                        slug: 'krank-mili',
                        description: 'Pistonların hareketini dönme hareketine çevirir.',
                        function: 'Pistonların ileri-geri hareketini döner harekete dönüştürür.',
                        symptoms: ['Motor vuruntu', 'Titreşim', 'Yağ basıncı düşük'],
                        repairAdvice: ['Rulman kontrol edilmeli', 'Yağ değişimi kritik', 'Çok pahalı onarım'],
                        estimatedCost: { min: 8000, max: 25000 },
                        laborTime: '15-25 saat'
                    },
                    {
                        id: 'krank-sensoru',
                        name: 'Krank Sensörü (Crankshaft Position Sensor)',
                        slug: 'krank-sensoru',
                        description: 'Krank mili pozisyonunu algılar.',
                        function: 'Krank mili devir ve pozisyonunu ECU\'ya bildirir.',
                        symptoms: ['Motor çalışmıyor', 'Check engine lambası', 'Titreşim'],
                        repairAdvice: ['Arızalı sensör değiştirilmeli', 'Elektrik bağlantıları kontrol edilmeli'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'krank-kasnagi',
                        name: 'Krank Kasnağı (Crankshaft Pulley)',
                        slug: 'krank-kasnagi',
                        description: 'Aksesuar kayışını tahrik eder.',
                        function: 'Krank milinden gücü alarak aksesuar kayışını döndürür.',
                        symptoms: ['Titreşim', 'Kayıştan ses', 'Aksesuar arızaları'],
                        repairAdvice: ['Hasar varsa değiştirilmeli', 'Vida torku önemli'],
                        estimatedCost: { min: 800, max: 2000 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'supaplar',
                        name: 'Supaplar (Valves)',
                        slug: 'supaplar',
                        description: 'Hava girişini ve egzoz çıkışını kontrol eder.',
                        function: 'Emme ve egzoz supapları yanma odasına hava girişini ve egzoz çıkışını sağlar.',
                        symptoms: ['Güç kaybı', 'Tıkırtı sesi', 'Mavi duman', 'Yağ tüketimi'],
                        repairAdvice: ['Supap ayarı düzenli yapılmalı', 'Yanmış supaplar değiştirilmeli', 'Kılavuz kontrol edilmeli'],
                        estimatedCost: { min: 3000, max: 8000 },
                        laborTime: '6-10 saat'
                    },
                    {
                        id: 'supap-kapagi',
                        name: 'Supap Kapağı (Valve Cover)',
                        slug: 'supap-kapagi',
                        description: 'Kam milini ve supapları korur.',
                        function: 'Üst motor bölümünü korur ve yağ sızıntısını önler.',
                        symptoms: ['Yağ sızıntısı', 'Yanık yağ kokusu'],
                        repairAdvice: ['Conta düzenli değiştirilmeli', 'Vidalar doğru torkta sıkılmalı'],
                        estimatedCost: { min: 500, max: 1500 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'silindir',
                        name: 'Silindir (Engine Cylinder)',
                        slug: 'silindir',
                        description: 'Pistonun hareket ettiği bölüm.',
                        function: 'Pistonun yukarı aşağı hareket ettiği silindirik boşluk.',
                        symptoms: ['Kompresyon kaybı', 'Güç kaybı', 'Yağ tüketimi'],
                        repairAdvice: ['Honlama gerekebilir', 'Aşınma varsa tamir'],
                        estimatedCost: { min: 5000, max: 15000 },
                        laborTime: '10-20 saat'
                    },
                    {
                        id: 'connecting-rod',
                        name: 'Biyel Kolu (Connecting Rod)',
                        slug: 'connecting-rod',
                        description: 'Pistonu krank miline bağlar.',
                        function: 'Pistonun hareketini krank miline iletir.',
                        symptoms: ['Motor vuruntu', 'Metal sesi'],
                        repairAdvice: ['Rulman kontrol edilmeli', 'Hasar varsa değiştirilmeli'],
                        estimatedCost: { min: 3000, max: 10000 },
                        laborTime: '10-15 saat'
                    },
                    {
                        id: 'volanlar',
                        name: 'Volan (Flywheel)',
                        slug: 'volanlar',
                        description: 'Krank milinin dönüşünü dengeler.',
                        function: 'Motor dönüşünü düzgünleştirir ve debriyaj yüzeyi sağlar.',
                        symptoms: ['Titreşim', 'Debriyaj kayması', 'Vites geçiş sorunu'],
                        repairAdvice: ['Debriyaj değişiminde kontrol edilmeli'],
                        estimatedCost: { min: 2000, max: 5000 },
                        laborTime: '4-6 saat'
                    },
                    {
                        id: 'flex-plate',
                        name: 'Flex Plate',
                        slug: 'flex-plate',
                        description: 'Otomatik şanzımanlarda volan yerine kullanılır.',
                        function: 'Krank milini tork konvertöre bağlar.',
                        symptoms: ['Titreşim', 'Gürültü', 'Marş sorunu'],
                        repairAdvice: ['Çatlak varsa değiştirilmeli'],
                        estimatedCost: { min: 1500, max: 4000 },
                        laborTime: '4-6 saat'
                    },
                    {
                        id: 'piston-segmanlari',
                        name: 'Piston Segmanları (Piston Rings)',
                        slug: 'piston-segmanlari',
                        description: 'Pistonun silindir duvarına sızdırmazlık sağlar.',
                        function: 'Kompresyonu korur ve yağ tüketimini önler.',
                        symptoms: ['Mavi duman', 'Yağ tüketimi', 'Güç kaybı'],
                        repairAdvice: ['Pistonlarla birlikte değiştirilmeli'],
                        estimatedCost: { min: 3000, max: 8000 },
                        laborTime: '10-15 saat'
                    },
                    {
                        id: 'piston-pimi',
                        name: 'Piston Pimi (Piston Pin)',
                        slug: 'piston-pimi',
                        description: 'Pistonu biyel koluna bağlar.',
                        function: 'Pistonun yukarı aşağı hareketini biyele iletir.',
                        symptoms: ['Motor vuruntu', 'Metal sesi'],
                        repairAdvice: ['Pistonlarla birlikte değiştirilmeli'],
                        estimatedCost: { min: 2000, max: 5000 },
                        laborTime: '10-15 saat'
                    },
                    {
                        id: 'motor-takozu',
                        name: 'Motor Takozu (Engine Mount)',
                        slug: 'motor-takozu',
                        description: 'Motoru şasiye bağlar ve titreşimi azaltır.',
                        function: 'Motor titreşimini yolcu kabininden izole eder.',
                        symptoms: ['Aşırı titreşim', 'Motor hareketi', 'Gürültü'],
                        repairAdvice: ['Yıpranmış takozlar değiştirilmeli'],
                        estimatedCost: { min: 600, max: 2000 },
                        laborTime: '1-3 saat'
                    },
                    {
                        id: 'krank-karteri',
                        name: 'Krank Karteri (Crankcase)',
                        slug: 'krank-karteri',
                        description: 'Krank milini barındıran alt motor bölümü.',
                        function: 'Krank mili ve yağ sistemini barındırır.',
                        symptoms: ['Yağ sızıntısı', 'Çatlak'],
                        repairAdvice: ['Çok ciddi hasar, motor değişimi gerekebilir'],
                        estimatedCost: { min: 10000, max: 30000 },
                        laborTime: '20-40 saat'
                    },
                    {
                        id: 'kizdiriclar',
                        name: 'Kızdırıcılar (Glow Plugs)',
                        slug: 'kizdiriclar',
                        description: 'Dizel motorlarda soğuk çalıştırmayı sağlar.',
                        function: 'Yanma odasını ısıtarak dizel yakıtın tutuşmasını sağlar.',
                        symptoms: ['Soğukta zor çalışma', 'Beyaz duman', 'Motor titremesi'],
                        repairAdvice: ['Tümü birlikte değiştirilmeli', 'Dizel motorlarda'],
                        estimatedCost: { min: 600, max: 1800 },
                        laborTime: '1-2 saat'
                    }
                ]
            },
            {
                id: 'yaglama',
                name: 'Yağlama Sistemi',
                slug: 'yaglama-sistemi',
                description: 'Motor parçalarını yağlayan sistem.',
                components: [
                    {
                        id: 'yag-pompasi',
                        name: 'Yağ Pompası (Oil Pump)',
                        slug: 'yag-pompasi',
                        description: 'Motor yağını basınçla pompalayan parça.',
                        function: 'Motor yağını basınç altında tüm motor parçalarına dağıtır.',
                        symptoms: ['Düşük yağ basıncı', 'Yağ lambası yanıyor', 'Motor gürültüsü', 'Aşırı ısınma'],
                        repairAdvice: ['Yağ değişimi düzenli yapılmalı', 'Yağ filtresi kontrol edilmeli', 'Arızalı pompa değiştirilmeli'],
                        estimatedCost: { min: 1500, max: 4000 },
                        laborTime: '3-5 saat'
                    },
                    {
                        id: 'yag-filtresi',
                        name: 'Yağ Filtresi (Oil Filter)',
                        slug: 'yag-filtresi',
                        description: 'Motor yağını temizler.',
                        function: 'Motor yağındaki metal parçacıkları ve kirleri tutar.',
                        symptoms: ['Düşük yağ basıncı', 'Motor gürültüsü', 'Yağ lambası'],
                        repairAdvice: ['Her yağ değişiminde değiştirilmeli', 'Kaliteli filtre kullanılmalı'],
                        estimatedCost: { min: 100, max: 300 },
                        laborTime: '15-30 dakika'
                    },
                    {
                        id: 'karter',
                        name: 'Karter (Oil Pan/Crankcase)',
                        slug: 'karter',
                        description: 'Motor yağını tutan kap.',
                        function: 'Motor yağını depolar ve motor altını korur.',
                        symptoms: ['Yağ sızıntısı', 'Yağ seviyesi düşüyor', 'Hasar'],
                        repairAdvice: ['Conta düzenli değiştirilmeli', 'Hasar varsa tamir veya değişim'],
                        estimatedCost: { min: 800, max: 2500 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'yag-sogutucusu',
                        name: 'Yağ Soğutucu (Oil Cooler)',
                        slug: 'yag-sogutucusu',
                        description: 'Motor yağını soğutur.',
                        function: 'Yağ sıcaklığını düşürerek motor ömrünü uzatır.',
                        symptoms: ['Yağ sıcaklığı yüksek', 'Yağ sızıntısı', 'Performans kaybı'],
                        repairAdvice: ['Tıkanma varsa temizlenmeli', 'Sızıntı varsa tamir'],
                        estimatedCost: { min: 1500, max: 4000 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'motor-yagi',
                        name: 'Motor Yağı (Engine Oil)',
                        slug: 'motor-yagi',
                        description: 'Motor parçalarını yağlar.',
                        function: 'Sürtünmeyi azaltır, soğutma sağlar, temizler.',
                        symptoms: ['Yağ seviyesi düşük', 'Kirli yağ', 'Motor gürültüsü'],
                        repairAdvice: ['Düzenli değiştirilmeli (10.000-15.000 km)', 'Doğru viskozite kullanılmalı'],
                        estimatedCost: { min: 300, max: 1000 },
                        laborTime: '30 dakika'
                    },
                    {
                        id: 'yag-kecesi',
                        name: 'Yağ Keçesi (Oil Seal)',
                        slug: 'yag-kecesi',
                        description: 'Yağ sızıntısını önler.',
                        function: 'Krank mili ve kam mili çıkışlarında sızdırmazlık sağlar.',
                        symptoms: ['Yağ sızıntısı', 'Yağ seviyesi düşüyor'],
                        repairAdvice: ['Sızıntı varsa değiştirilmeli', 'Triger değişiminde kontrol edilmeli'],
                        estimatedCost: { min: 500, max: 1500 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'arka-ana-kece',
                        name: 'Arka Ana Keçe (Rear Main Seal)',
                        slug: 'arka-ana-kece',
                        description: 'Krank mili arka keçesi.',
                        function: 'Krank mili arkasından yağ sızıntısını önler.',
                        symptoms: ['Yağ sızıntısı', 'Debriyaj üzerinde yağ'],
                        repairAdvice: ['Şanzıman sökülmeli', 'Pahalı işçilik'],
                        estimatedCost: { min: 2000, max: 5000 },
                        laborTime: '6-10 saat'
                    }
                ]
            },
            {
                id: 'hava-emme',
                name: 'Hava Emme Sistemi',
                slug: 'hava-emme-sistemi',
                description: 'Motora temiz hava sağlayan sistem.',
                components: [
                    {
                        id: 'hava-filtresi',
                        name: 'Hava Filtresi (Air Filter)',
                        slug: 'hava-filtresi',
                        description: 'Motora giren havayı temizler.',
                        function: 'Havadaki toz ve kirleri tutar, temiz hava sağlar.',
                        symptoms: ['Güç kaybı', 'Yakıt tüketimi artışı', 'Siyah duman', 'Hızlanma sorunu'],
                        repairAdvice: ['15.000-30.000 km\'de değiştirilmeli', 'Tozlu ortamlarda daha sık', 'Temizlenebilir filtreler yıkanabilir'],
                        estimatedCost: { min: 150, max: 500 },
                        laborTime: '10-15 dakika'
                    },
                    {
                        id: 'gaz-kelebegi',
                        name: 'Gaz Kelebeği (Throttle Body)',
                        slug: 'gaz-kelebegi',
                        description: 'Motora giren hava miktarını kontrol eder.',
                        function: 'Gaz pedalı ile kontrol edilerek hava akışını ayarlar.',
                        symptoms: ['Rölanti problemi', 'Titreşim', 'Check engine lambası', 'Güç kaybı'],
                        repairAdvice: ['Düzenli temizlenmeli', 'Sensör kontrol edilmeli', 'Elektronik kelebek kalibrasyonu'],
                        estimatedCost: { min: 1500, max: 4000 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'emme-manifoldu',
                        name: 'Emme Manifoldu (Intake Manifold)',
                        slug: 'emme-manifoldu',
                        description: 'Havayı silindirlere dağıtır.',
                        function: 'Hava-yakıt karışımını silindirlere eşit dağıtır.',
                        symptoms: ['Vakum kaçağı', 'Rölanti problemi', 'Güç kaybı', 'Check engine lambası'],
                        repairAdvice: ['Conta kontrol edilmeli', 'Çatlak varsa tamir', 'Vakum hortumları kontrol edilmeli'],
                        estimatedCost: { min: 2000, max: 6000 },
                        laborTime: '3-5 saat'
                    },
                    {
                        id: 'turbo',
                        name: 'Turboşarj (Turbocharger)',
                        slug: 'turbo',
                        description: 'Motora basınçlı hava sağlar.',
                        function: 'Egzoz gazlarını kullanarak havayı sıkıştırır ve motora daha fazla hava verir.',
                        symptoms: ['Güç kaybı', 'Siyah/mavi duman', 'Islık sesi', 'Yağ tüketimi', 'Turbo gecikmesi'],
                        repairAdvice: ['Yağ değişimi kritik', 'Soğuma süresi verilmeli', 'Hava filtresi temiz olmalı'],
                        estimatedCost: { min: 5000, max: 15000 },
                        laborTime: '4-8 saat'
                    },
                    {
                        id: 'supercharger',
                        name: 'Süperşarj (Supercharger)',
                        slug: 'supercharger',
                        description: 'Mekanik olarak basınçlı hava sağlar.',
                        function: 'Motor gücüyle çalışarak havayı sıkıştırır.',
                        symptoms: ['Güç kaybı', 'Gürültü', 'Kayış problemi'],
                        repairAdvice: ['Kayış kontrol edilmeli', 'Yağ seviyesi kontrol edilmeli'],
                        estimatedCost: { min: 8000, max: 20000 },
                        laborTime: '6-10 saat'
                    },
                    {
                        id: 'maf-sensoru',
                        name: 'MAF Sensörü (Mass Air Flow Sensor)',
                        slug: 'maf-sensoru',
                        description: 'Hava akış miktarını ölçer.',
                        function: 'Motora giren hava miktarını ECU\'ya bildirir.',
                        symptoms: ['Rölanti problemi', 'Güç kaybı', 'Check engine lambası', 'Kötü yakıt ekonomisi'],
                        repairAdvice: ['Temizlenebilir', 'Arızalı ise değiştirilmeli', 'Hava filtresi temiz olmalı'],
                        estimatedCost: { min: 800, max: 2500 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'intercooler',
                        name: 'Intercooler',
                        slug: 'intercooler',
                        description: 'Turbodan gelen havayı soğutur.',
                        function: 'Sıkıştırılmış havayı soğutarak yoğunluğunu artırır.',
                        symptoms: ['Güç kaybı', 'Turbo basıncı düşük', 'Sızıntı'],
                        repairAdvice: ['Sızıntı kontrol edilmeli', 'Temizlik önemli'],
                        estimatedCost: { min: 2000, max: 5000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'throttle-actuator',
                        name: 'Gaz Kelebeği Aktüatörü (Throttle Actuator)',
                        slug: 'throttle-actuator',
                        description: 'Elektronik gaz kelebeğini kontrol eder.',
                        function: 'ECU komutlarına göre kelebeği açıp kapatır.',
                        symptoms: ['Rölanti problemi', 'Gaz tepkisi yok', 'Check engine lambası'],
                        repairAdvice: ['Kalibrasyon gerekebilir', 'Arızalı ise değiştirilmeli'],
                        estimatedCost: { min: 1500, max: 4000 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'yakit-enjektoru',
                        name: 'Yakıt Enjektörü (Fuel Injector)',
                        slug: 'yakit-enjektoru',
                        description: 'Yakıtı motora püskürten parça.',
                        function: 'Yakıtı atomize ederek yanma odasına püskürtür.',
                        symptoms: ['Motor titremesi', 'Güç kaybı', 'Kötü yakıt ekonomisi'],
                        repairAdvice: ['80.000 km\'de temizlenmeli', 'Arızalı enjektör değiştirilmeli'],
                        estimatedCost: { min: 1000, max: 3000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'yakit-pompasi',
                        name: 'Yakıt Pompası (Fuel Pump)',
                        slug: 'yakit-pompasi',
                        description: 'Yakıtı depodan motora pompalayan parça.',
                        function: 'Yakıtı basınç altında enjektörlere gönderir.',
                        symptoms: ['Motor çalışmıyor', 'Güç kaybı', 'Pompa sesi'],
                        repairAdvice: ['Yakıt filtresi temiz olmalı', 'Elektrik kontrol edilmeli'],
                        estimatedCost: { min: 1500, max: 4000 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'yakit-filtresi-motor',
                        name: 'Yakıt Filtresi (Fuel Filter)',
                        slug: 'yakit-filtresi-motor',
                        description: 'Yakıttaki kirleri tutar.',
                        function: 'Yakıttaki partikülleri filtreleyerek enjektörleri korur.',
                        symptoms: ['Güç kaybı', 'Motor boğuluyor', 'Zor çalışma'],
                        repairAdvice: ['20.000-40.000 km\'de değiştirilmeli'],
                        estimatedCost: { min: 200, max: 600 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'yakit-basinc-regulatoru',
                        name: 'Yakıt Basınç Regülatörü',
                        slug: 'yakit-basinc-regulatoru',
                        description: 'Yakıt basıncını kontrol eder.',
                        function: 'Enjektörlere giden yakıt basıncını ayarlar.',
                        symptoms: ['Kötü yakıt ekonomisi', 'Siyah duman'],
                        repairAdvice: ['Basınç testi yapılmalı'],
                        estimatedCost: { min: 600, max: 1800 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'karburator',
                        name: 'Karbüratör (Carburetor)',
                        slug: 'karburator',
                        description: 'Eski motorlarda yakıt-hava karışımını hazırlar.',
                        function: 'Yakıt ve havayı karıştırarak motora gönderir.',
                        symptoms: ['Rölanti problemi', 'Kötü yakıt ekonomisi'],
                        repairAdvice: ['Düzenli temizlenmeli', 'Eski teknoloji'],
                        estimatedCost: { min: 1000, max: 3000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'iac-valf',
                        name: 'Rölanti Hava Kontrol Valfi (IAC)',
                        slug: 'iac-valf',
                        description: 'Rölanti hava akışını kontrol eder.',
                        function: 'Motor rölantideyken hava miktarını ayarlar.',
                        symptoms: ['Rölanti problemi', 'Motor duruyor'],
                        repairAdvice: ['Temizlenebilir', 'Arızalı ise değiştirilmeli'],
                        estimatedCost: { min: 500, max: 1500 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'pcv-valf',
                        name: 'PCV Valfi (PCV Valve)',
                        slug: 'pcv-valf',
                        description: 'Karter gazlarını yakma odasına gönderir.',
                        function: 'Motor nefes almasını sağlar ve emisyonları azaltır.',
                        symptoms: ['Yağ tüketimi', 'Rölanti problemi'],
                        repairAdvice: ['20.000-50.000 km\'de değiştirilmeli'],
                        estimatedCost: { min: 100, max: 300 },
                        laborTime: '30 dakika'
                    },
                    {
                        id: 'vakum-pompasi',
                        name: 'Vakum Pompası (Vacuum Pump)',
                        slug: 'vakum-pompasi',
                        description: 'Fren ve diğer sistemler için vakum sağlar.',
                        function: 'Dizel motorlarda fren güçlendirici için vakum üretir.',
                        symptoms: ['Fren pedalı sert', 'Fren gücü yok'],
                        repairAdvice: ['Dizel motorlarda bulunur'],
                        estimatedCost: { min: 1000, max: 2500 },
                        laborTime: '2-3 saat'
                    }
                ]
            },
            {
                id: 'contalar',
                name: 'Contalar ve Sızdırmazlık',
                slug: 'contalar',
                description: 'Motor sızdırmazlığını sağlayan parçalar.',
                components: [
                    {
                        id: 'silindir-kapak-contasi',
                        name: 'Silindir Kapak Contası (Head Gasket)',
                        slug: 'silindir-kapak-contasi',
                        description: 'Silindir kapağı ile blok arasında sızdırmazlık sağlar.',
                        function: 'Yanma odasını, yağ ve su kanallarını birbirinden ayırır.',
                        symptoms: ['Aşırı ısınma', 'Beyaz duman', 'Yağ-su karışması', 'Güç kaybı', 'Radyatörde köpük'],
                        repairAdvice: ['Hasar varsa hemen değiştirilmeli', 'Kapak düzleştirme gerekebilir', 'Pahalı onarım'],
                        estimatedCost: { min: 3000, max: 8000 },
                        laborTime: '6-10 saat'
                    },
                    {
                        id: 'karter-contasi',
                        name: 'Karter Contası (Oil Pan Gasket)',
                        slug: 'karter-contasi',
                        description: 'Karter ile blok arasında sızdırmazlık.',
                        function: 'Yağ sızıntısını önler.',
                        symptoms: ['Yağ sızıntısı', 'Yağ seviyesi düşüyor'],
                        repairAdvice: ['Sızıntı varsa değiştirilmeli', 'Silikon conta kullanılabilir'],
                        estimatedCost: { min: 500, max: 1500 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'supap-kapak-contasi',
                        name: 'Supap Kapak Contası (Valve Cover Gasket)',
                        slug: 'supap-kapak-contasi',
                        description: 'Supap kapağı sızdırmazlığı.',
                        function: 'Üst motordan yağ sızıntısını önler.',
                        symptoms: ['Yağ sızıntısı', 'Yanık yağ kokusu', 'Motor üstünde yağ'],
                        repairAdvice: ['Düzenli değiştirilmeli', 'Vidalar doğru torkta sıkılmalı'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'timing-cover-gasket',
                        name: 'Zamanlama Kapağı Contası (Timing Cover Gasket)',
                        slug: 'timing-cover-gasket',
                        description: 'Zamanlama kapağı sızdırmazlığı.',
                        function: 'Ön kapaktan yağ sızıntısını önler.',
                        symptoms: ['Yağ sızıntısı', 'Triger bölgesinde yağ'],
                        repairAdvice: ['Triger değişiminde kontrol edilmeli', 'Sızıntı varsa değiştirilmeli'],
                        estimatedCost: { min: 800, max: 2000 },
                        laborTime: '3-5 saat'
                    },
                    {
                        id: 'main-seal',
                        name: 'Ana Keçe (Main Seal)',
                        slug: 'main-seal',
                        description: 'Krank mili arka keçesi.',
                        function: 'Krank mili arkasından yağ sızıntısını önler.',
                        symptoms: ['Yağ sızıntısı', 'Debriyaj üzerinde yağ'],
                        repairAdvice: ['Şanzıman sökülmeli', 'Pahalı işçilik'],
                        estimatedCost: { min: 2000, max: 5000 },
                        laborTime: '6-10 saat'
                    },
                    {
                        id: 'emme-manifold-contasi',
                        name: 'Emme Manifoldu Contası (Intake Manifold Gasket)',
                        slug: 'emme-manifold-contasi',
                        description: 'Emme manifoldu sızdırmazlığı.',
                        function: 'Vakum kaçağını önler.',
                        symptoms: ['Rölanti problemi', 'Vakum kaçağı', 'Check engine lambası'],
                        repairAdvice: ['Kaçak varsa değiştirilmeli', 'Vakum hortumları kontrol edilmeli'],
                        estimatedCost: { min: 800, max: 2500 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'su-pompasi-contasi',
                        name: 'Su Pompası Contası (Water Pump Gasket)',
                        slug: 'su-pompasi-contasi',
                        description: 'Su pompası sızdırmazlığı.',
                        function: 'Pompa ile blok arasında sızdırmazlık sağlar.',
                        symptoms: ['Soğutma suyu sızıntısı'],
                        repairAdvice: ['Pompa değişiminde yenilenmeli'],
                        estimatedCost: { min: 100, max: 300 },
                        laborTime: '2-4 saat (pompa ile birlikte)'
                    },
                    {
                        id: 'termostat-contasi',
                        name: 'Termostat Contası (Thermostat Gasket)',
                        slug: 'termostat-contasi',
                        description: 'Termostat sızdırmazlığı.',
                        function: 'Termostat yuvasında sızdırmazlık sağlar.',
                        symptoms: ['Soğutma suyu sızıntısı'],
                        repairAdvice: ['Termostat değişiminde yenilenmeli'],
                        estimatedCost: { min: 50, max: 200 },
                        laborTime: '1-2 saat (termostat ile birlikte)'
                    },
                    {
                        id: 'yag-tapa-contasi',
                        name: 'Yağ Tapası Contası (Oil Drain Plug Gasket)',
                        slug: 'yag-tapa-contasi',
                        description: 'Yağ tahliye tapası contası.',
                        function: 'Yağ tapasında sızdırmazlık sağlar.',
                        symptoms: ['Yağ sızıntısı'],
                        repairAdvice: ['Her yağ değişiminde yenilenmeli'],
                        estimatedCost: { min: 10, max: 50 },
                        laborTime: '15 dakika'
                    },
                    {
                        id: 'conta-macunu',
                        name: 'Conta Macunu (Gasket Sealer)',
                        slug: 'conta-macunu',
                        description: 'Conta sızdırmazlığını artırır.',
                        function: 'Contaların sızdırmazlığını güçlendirir.',
                        symptoms: ['Sızıntı önleme'],
                        repairAdvice: ['Doğru tip kullanılmalı', 'Bazı contalar gerektirmez'],
                        estimatedCost: { min: 50, max: 200 },
                        laborTime: 'Değişken'
                    },
                    {
                        id: 'hortum-kelepcesi',
                        name: 'Hortum Kelepçesi (Hose Clamps)',
                        slug: 'hortum-kelepcesi',
                        description: 'Hortumları sabitler.',
                        function: 'Hortumların sızdırmazlığını sağlar.',
                        symptoms: ['Sızıntı', 'Hortum kayması'],
                        repairAdvice: ['Düzenli kontrol edilmeli'],
                        estimatedCost: { min: 20, max: 100 },
                        laborTime: '15-30 dakika'
                    },
                    {
                        id: 'krank-mili-kecesi',
                        name: 'Krank Mili Keçesi (Crankshaft Seal)',
                        slug: 'krank-mili-kecesi',
                        description: 'Krank mili ön keçesi.',
                        function: 'Krank mili ön çıkışında sızdırmazlık sağlar.',
                        symptoms: ['Yağ sızıntısı', 'Triger bölgesinde yağ'],
                        repairAdvice: ['Triger değişiminde kontrol edilmeli'],
                        estimatedCost: { min: 500, max: 1500 },
                        laborTime: '3-5 saat'
                    }
                ]
            },
            {
                id: 'sensorler',
                name: 'Sensörler ve Kontrol',
                slug: 'sensorler',
                description: 'Motor kontrolünü sağlayan elektronik parçalar.',
                components: [
                    {
                        id: 'ecu',
                        name: 'Motor Kontrol Ünitesi (ECU/Engine Control Unit)',
                        slug: 'ecu',
                        description: 'Motorun beyni.',
                        function: 'Tüm sensörlerden veri alarak enjeksiyon, ateşleme ve diğer sistemleri kontrol eder.',
                        symptoms: ['Check engine lambası', 'Motor çalışmıyor', 'Performans kaybı', 'Yakıt tüketimi artışı'],
                        repairAdvice: ['Yazılım güncellemesi gerekebilir', 'Arızalı ECU değiştirilmeli', 'Çok pahalı'],
                        estimatedCost: { min: 5000, max: 15000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'oksijen-sensoru',
                        name: 'Oksijen Sensörü (O2 Sensor)',
                        slug: 'oksijen-sensoru',
                        description: 'Egzoz gazındaki oksijen miktarını ölçer.',
                        function: 'Yakıt-hava karışımını optimize etmek için ECU\'ya veri sağlar.',
                        symptoms: ['Check engine lambası', 'Yakıt tüketimi artışı', 'Performans kaybı', 'Emisyon testi başarısız'],
                        repairAdvice: ['100.000-150.000 km\'de değiştirilmeli', 'Katalitik önce ve sonrası sensörler var'],
                        estimatedCost: { min: 600, max: 1800 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'sicaklik-sensoru',
                        name: 'Motor Sıcaklık Sensörü (Coolant Temperature Sensor)',
                        slug: 'sicaklik-sensoru',
                        description: 'Motor sıcaklığını ölçer.',
                        function: 'Motor sıcaklığını ECU\'ya bildirir.',
                        symptoms: ['Yanlış sıcaklık göstergesi', 'Fan çalışmıyor', 'Aşırı ısınma', 'Check engine lambası'],
                        repairAdvice: ['Arızalı sensör değiştirilmeli', 'Elektrik bağlantıları kontrol edilmeli'],
                        estimatedCost: { min: 300, max: 1000 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'knock-sensor',
                        name: 'Vuruntu Sensörü (Knock Sensor)',
                        slug: 'knock-sensor',
                        description: 'Motor vuruntusunu algılar.',
                        function: 'Anormal yanmayı tespit ederek ateşleme zamanlamasını ayarlar.',
                        symptoms: ['Vuruntu sesi', 'Güç kaybı', 'Check engine lambası'],
                        repairAdvice: ['Arızalı sensör değiştirilmeli', 'Kaliteli yakıt kullanılmalı'],
                        estimatedCost: { min: 500, max: 1500 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'tps-sensor',
                        name: 'Gaz Kelebeği Pozisyon Sensörü (TPS)',
                        slug: 'tps-sensor',
                        description: 'Kelebek açıklığını ölçer.',
                        function: 'Gaz pedalı pozisyonunu ECU\'ya bildirir.',
                        symptoms: ['Rölanti problemi', 'Titreşim', 'Güç kaybı', 'Check engine lambası'],
                        repairAdvice: ['Kalibrasyon gerekebilir', 'Arızalı ise değiştirilmeli'],
                        estimatedCost: { min: 600, max: 1800 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'map-sensor',
                        name: 'Manifold Basınç Sensörü (MAP Sensor)',
                        slug: 'map-sensor',
                        description: 'Emme manifoldu basıncını ölçer.',
                        function: 'Motor yükünü hesaplamak için basınç verisini ECU\'ya gönderir.',
                        symptoms: ['Güç kaybı', 'Kötü yakıt ekonomisi', 'Check engine lambası'],
                        repairAdvice: ['Vakum hortumları kontrol edilmeli', 'Arızalı sensör değiştirilmeli'],
                        estimatedCost: { min: 500, max: 1500 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'yag-basinc-sensoru',
                        name: 'Yağ Basınç Sensörü (Oil Pressure Sensor)',
                        slug: 'yag-basinc-sensoru',
                        description: 'Yağ basıncını ölçer.',
                        function: 'Motor yağ basıncını ECU\'ya ve göstergeye bildirir.',
                        symptoms: ['Yağ lambası yanıyor', 'Yanlış gösterge'],
                        repairAdvice: ['Arızalı sensör değiştirilmeli'],
                        estimatedCost: { min: 300, max: 1000 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'atesleme-modulu',
                        name: 'Ateşleme Modülü (Ignition Module)',
                        slug: 'atesleme-modulu',
                        description: 'Ateşleme bobinlerini kontrol eder.',
                        function: 'ECU sinyallerine göre bobinleri tetikler.',
                        symptoms: ['Motor çalışmıyor', 'Ateşleme yok'],
                        repairAdvice: ['Arızalı modül değiştirilmeli'],
                        estimatedCost: { min: 800, max: 2500 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'distributor-kapak-rotor',
                        name: 'Distribütör Kapak ve Rotor',
                        slug: 'distributor-kapak-rotor',
                        description: 'Ateşleme sinyalini dağıtır.',
                        function: 'Ateşlemeyi doğru silindire doğru zamanda iletir.',
                        symptoms: ['Motor çalışmıyor', 'Ateşleme zamanlaması bozuk'],
                        repairAdvice: ['Birlikte değiştirilmeli', 'Eski motorlarda'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '1 saat'
                    },
                    {
                        id: 'kam-aktuatoru',
                        name: 'Kam Aktuatörü (Camshaft Actuator)',
                        slug: 'kam-aktuatoru',
                        description: 'Değişken kam zamanlamasını kontrol eder.',
                        function: 'Kam zamanlamasını motor koşullarına göre ayarlar.',
                        symptoms: ['Check engine lambası', 'Güç kaybı'],
                        repairAdvice: ['Arızalı aktuatör değiştirilmeli'],
                        estimatedCost: { min: 1000, max: 3000 },
                        laborTime: '2-4 saat'
                    }
                ]
            },
            {
                id: 'kayislar',
                name: 'Kayışlar ve Kasnak',
                slug: 'kayislar',
                description: 'Motor aksesuarlarını tahrik eden kayışlar.',
                components: [
                    {
                        id: 'aksesuar-kayisi',
                        name: 'Aksesuar Kayışı (Drive Belt/Serpentine Belt)',
                        slug: 'aksesuar-kayisi',
                        description: 'Alternatör, klima, direksiyon pompası gibi aksesuarları çalıştırır.',
                        function: 'Krank kasnağından gücü alarak tüm aksesuarları döndürür.',
                        symptoms: ['Cırlama sesi', 'Akü şarj olmuyor', 'Direksiyon ağırlaşıyor', 'Klima çalışmıyor', 'Aşırı ısınma'],
                        repairAdvice: ['40.000-80.000 km\'de değiştirilmeli', 'Çatlak veya aşınma varsa değiştirilmeli', 'Gergi kontrol edilmeli'],
                        estimatedCost: { min: 300, max: 800 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'kayis-gergisi',
                        name: 'Kayış Gergisi (Belt Tensioner)',
                        slug: 'kayis-gergisi',
                        description: 'Aksesuar kayışının gerginliğini sağlar.',
                        function: 'Kayışı doğru gerginlikte tutar.',
                        symptoms: ['Kayıştan cırlama', 'Titreşim', 'Kayış atlaması'],
                        repairAdvice: ['Rulman kontrol edilmeli', 'Arızalı gergi değiştirilmeli'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'kasnak',
                        name: 'Kasnak (Pulley)',
                        slug: 'kasnak',
                        description: 'Kayışı yönlendirir.',
                        function: 'Kayışın doğru yolda gitmesini sağlar.',
                        symptoms: ['Gürültü', 'Titreşim', 'Kayış aşınması'],
                        repairAdvice: ['Rulman kontrol edilmeli', 'Hasar varsa değiştirilmeli'],
                        estimatedCost: { min: 300, max: 1000 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'kayis-kasnak-rulman',
                        name: 'Kayış Kasnağı Rulmanı (Drive Belt Idler Pulley)',
                        slug: 'kayis-kasnak-rulman',
                        description: 'Kayışı yönlendirir ve gerginliği sağlar.',
                        function: 'Kayışın doğru yolda gitmesini sağlar.',
                        symptoms: ['Gürültü', 'Titreşim', 'Kayış aşınması'],
                        repairAdvice: ['Rulman kontrol edilmeli'],
                        estimatedCost: { min: 300, max: 1000 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'gergi-kasnagi',
                        name: 'Gergi Kasnağı (Drive Belt Tensioner Pulley)',
                        slug: 'gergi-kasnagi',
                        description: 'Gergi mekanizmasının kasnağı.',
                        function: 'Kayış gergisinin rulmanı.',
                        symptoms: ['Gürültü', 'Kayış gevşek'],
                        repairAdvice: ['Gergi ile birlikte değiştirilmeli'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'denge-mili-kayisi',
                        name: 'Denge Mili Kayışı (Balance Shaft Belt)',
                        slug: 'denge-mili-kayisi',
                        description: 'Denge milini tahrik eder.',
                        function: 'Krank milinden denge miline güç iletir.',
                        symptoms: ['Titreşim', 'Gürültü'],
                        repairAdvice: ['Triger ile birlikte değiştirilmeli'],
                        estimatedCost: { min: 500, max: 1500 },
                        laborTime: '3-5 saat'
                    }
                ]
            },
            {
                id: 'sogutma-motor',
                name: 'Motor Soğutma Sistemi',
                slug: 'sogutma-motor',
                description: 'Motorun aşırı ısınmasını önleyen soğutma bileşenleri.',
                components: [
                    {
                        id: 'radyator',
                        name: 'Radyatör (Radiator)',
                        slug: 'radyator',
                        description: 'Motor sıcaklığını düşüren ısı değiştirici.',
                        function: 'Soğutma sıvısındaki ısıyı havaya aktararak motoru soğutur.',
                        symptoms: ['Aşırı ısınma', 'Sızıntı', 'Radyatörde tıkanma', 'Soğutma suyu kaybı'],
                        repairAdvice: ['Düzenli temizlenmeli', 'Hasarlı radyatör değiştirilmeli', 'Radyatör kapağı kontrol edilmeli'],
                        estimatedCost: { min: 1500, max: 4000 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'su-pompasi',
                        name: 'Su Pompası (Water Pump)',
                        slug: 'su-pompasi',
                        description: 'Soğutma sıvısını dolaştıran pompa.',
                        function: 'Soğutma sıvısını motor ve radyatör arasında pompalar.',
                        symptoms: ['Sızıntı', 'Aşırı ısınma', 'Gürültü', 'Soğutma suyu kaybı'],
                        repairAdvice: ['Triger değişiminde kontrol edilmeli', 'Sızıntı varsa değiştirilmeli'],
                        estimatedCost: { min: 1200, max: 3000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'termostat',
                        name: 'Termostat (Thermostat)',
                        slug: 'termostat',
                        description: 'Motor sıcaklığını kontrol eden valf.',
                        function: 'Motor sıcaklığına göre soğutma sıvısı akışını ayarlar.',
                        symptoms: ['Aşırı ısınma', 'Motor ısınmıyor', 'Yakıt tüketimi artışı'],
                        repairAdvice: ['Arızalı termostat değiştirilmeli', 'Conta ile birlikte değiştirilmeli'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'sogutma-fani',
                        name: 'Soğutma Fanı (Cooling Fan)',
                        slug: 'sogutma-fani',
                        description: 'Radyatörden hava geçiren fan.',
                        function: 'Radyatör üzerinden hava geçirerek soğutmayı artırır.',
                        symptoms: ['Aşırı ısınma', 'Fan çalışmıyor', 'Gürültü'],
                        repairAdvice: ['Fan motoru kontrol edilmeli', 'Termostatik anahtar kontrol edilmeli'],
                        estimatedCost: { min: 800, max: 2500 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'ust-radyator-hortumu',
                        name: 'Üst Radyatör Hortumu (Upper Radiator Hose)',
                        slug: 'ust-radyator-hortumu',
                        description: 'Motordan radyatöre sıcak su taşır.',
                        function: 'Sıcak soğutma sıvısını motordan radyatöre iletir.',
                        symptoms: ['Sızıntı', 'Çatlak', 'Aşırı ısınma'],
                        repairAdvice: ['Çatlak veya şişmiş hortumlar değiştirilmeli', 'Kelepçeler kontrol edilmeli'],
                        estimatedCost: { min: 200, max: 600 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'alt-radyator-hortumu',
                        name: 'Alt Radyatör Hortumu (Lower Radiator Hose)',
                        slug: 'alt-radyator-hortumu',
                        description: 'Radyatörden motora soğuk su taşır.',
                        function: 'Soğumuş soğutma sıvısını radyatörden motora iletir.',
                        symptoms: ['Sızıntı', 'Çatlak', 'Aşırı ısınma'],
                        repairAdvice: ['Çatlak veya şişmiş hortumlar değiştirilmeli', 'Kelepçeler kontrol edilmeli'],
                        estimatedCost: { min: 200, max: 600 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'radyator-kapagi',
                        name: 'Radyatör Kapağı (Radiator Cap)',
                        slug: 'radyator-kapagi',
                        description: 'Soğutma sisteminde basıncı kontrol eder.',
                        function: 'Sistemde doğru basıncı korur ve taşmayı önler.',
                        symptoms: ['Aşırı ısınma', 'Soğutma suyu kaybı', 'Taşma'],
                        repairAdvice: ['Basınç testi yapılmalı', 'Arızalı kapak değiştirilmeli'],
                        estimatedCost: { min: 100, max: 300 },
                        laborTime: '10 dakika'
                    },
                    {
                        id: 'genlesme-tanki',
                        name: 'Genleşme Tankı (Coolant Expansion Tank)',
                        slug: 'genlesme-tanki',
                        description: 'Soğutma sıvısı genleşmesini karşılar.',
                        function: 'Isınan soğutma sıvısının genleşmesini karşılar.',
                        symptoms: ['Sızıntı', 'Çatlak', 'Soğutma suyu kaybı'],
                        repairAdvice: ['Çatlak tank değiştirilmeli', 'Seviye düzenli kontrol edilmeli'],
                        estimatedCost: { min: 300, max: 800 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'fan-kasnagi',
                        name: 'Fan Kasnağı (Cooling Fan Clutch)',
                        slug: 'fan-kasnagi',
                        description: 'Mekanik fanı kontrol eder.',
                        function: 'Motor sıcaklığına göre fan hızını ayarlar.',
                        symptoms: ['Aşırı ısınma', 'Sürekli çalışan fan', 'Gürültü'],
                        repairAdvice: ['Arızalı kasnak değiştirilmeli', 'Viskoz yağ kontrol edilmeli'],
                        estimatedCost: { min: 600, max: 1500 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'sogutma-suyu',
                        name: 'Soğutma Sıvısı (Coolant)',
                        slug: 'sogutma-suyu',
                        description: 'Motor sıcaklığını düşüren sıvı.',
                        function: 'Isıyı motor bloğundan radyatöre taşır.',
                        symptoms: ['Düşük seviye', 'Kirli soğutma suyu', 'Aşırı ısınma'],
                        repairAdvice: ['Düzenli değiştirilmeli (2-3 yılda)', 'Doğru tip kullanılmalı', 'Karışım oranı önemli'],
                        estimatedCost: { min: 200, max: 600 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'fan-motoru',
                        name: 'Fan Motoru (Cooling Fan Motor)',
                        slug: 'fan-motoru',
                        description: 'Elektrikli fanı çalıştırır.',
                        function: 'Fanı döndürerek radyatörden hava geçirir.',
                        symptoms: ['Fan çalışmıyor', 'Aşırı ısınma'],
                        repairAdvice: ['Elektrik bağlantıları kontrol edilmeli'],
                        estimatedCost: { min: 800, max: 2000 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'fan-calisma-sistemi',
                        name: 'Fan Çalışma Sistemi (Cooling Fan Operation)',
                        slug: 'fan-calisma-sistemi',
                        description: 'Fan kontrol sistemi.',
                        function: 'Fanın ne zaman çalışacağını kontrol eder.',
                        symptoms: ['Fan sürekli çalışıyor', 'Fan hiç çalışmıyor'],
                        repairAdvice: ['Termostatik anahtar kontrol edilmeli'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '1-2 saat'
                    }
                ]
            },
,            {
                id: 'dizel-bilesenleri',
                name: 'Dizel Motor Bileşenleri',
                slug: 'dizel-bilesenleri',
                description: 'Dizel motorlara özel bileşenler.',
                components: [
                    {
                        id: 'dizel-motor-yagi',
                        name: 'Dizel Motor Yağı (Diesel Engine Oil)',
                        slug: 'dizel-motor-yagi',
                        description: 'Dizel motorlara özel yağ.',
                        function: 'Dizel motorların yüksek sıkıştırma ve is oluşumuna dayanır.',
                        symptoms: ['Kirli yağ', 'Yağ seviyesi düşük'],
                        repairAdvice: ['Dizel motorlara özel yağ kullanılmalı', '10.000-15.000 km\'de değiştirilmeli'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '30 dakika'
                    },
                    {
                        id: 'dizel-yakit-filtresi',
                        name: 'Dizel Yakıt Filtresi (Diesel Fuel Filter)',
                        slug: 'dizel-yakit-filtresi',
                        description: 'Dizel yakıttaki suyu ve kirleri tutar.',
                        function: 'Dizel yakıttaki su ve partikülleri filtreler.',
                        symptoms: ['Güç kaybı', 'Motor boğuluyor', 'Zor çalışma'],
                        repairAdvice: ['15.000-30.000 km\'de değiştirilmeli', 'Su tahliyesi yapılmalı'],
                        estimatedCost: { min: 300, max: 800 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'dizel-enjektoru',
                        name: 'Dizel Enjektörü (Diesel Fuel Injector)',
                        slug: 'dizel-enjektoru',
                        description: 'Dizel yakıtı yüksek basınçla püskürtür.',
                        function: 'Dizel yakıtı çok yüksek basınçta yanma odasına püskürtür.',
                        symptoms: ['Siyah duman', 'Güç kaybı', 'Kötü yakıt ekonomisi'],
                        repairAdvice: ['Çok pahalı', 'Temizlenebilir', 'Yüksek basınç sistemi'],
                        estimatedCost: { min: 2000, max: 6000 },
                        laborTime: '3-6 saat'
                    },
                    {
                        id: 'dizel-yakit-pompasi',
                        name: 'Dizel Yakıt Pompası (Diesel Fuel Pump)',
                        slug: 'dizel-yakit-pompasi',
                        description: 'Yüksek basınçlı dizel pompası.',
                        function: 'Dizel yakıtı çok yüksek basınca çıkarır.',
                        symptoms: ['Motor çalışmıyor', 'Güç kaybı', 'Gürültü'],
                        repairAdvice: ['Çok pahalı parça', 'Kaliteli yakıt kullanılmalı'],
                        estimatedCost: { min: 5000, max: 15000 },
                        laborTime: '4-8 saat'
                    },
                    {
                        id: 'enjeksiyon-pompasi',
                        name: 'Enjeksiyon Pompası (Diesel Injection Pump)',
                        slug: 'enjeksiyon-pompasi',
                        description: 'Eski dizel motorlarda yakıt pompası.',
                        function: 'Yakıtı basınçlandırır ve enjektörlere dağıtır.',
                        symptoms: ['Motor çalışmıyor', 'Güç kaybı', 'Siyah duman'],
                        repairAdvice: ['Eski teknoloji', 'Çok pahalı onarım'],
                        estimatedCost: { min: 6000, max: 20000 },
                        laborTime: '6-10 saat'
                    }
                ]
            }
        ],
        components: []
    },

    {
        id: 'fren',
        name: 'Fren Sistemi',
        slug: 'fren-sistemi',
        description: 'Aracınızı güvenli bir şekilde yavaşlatıp durduran hayati güvenlik sistemi.',
        icon: 'brake',
        color: 'orange',
        subsystems: [
            {
                id: 'fren-bilesenleri',
                name: 'Fren Bileşenleri',
                slug: 'fren-bilesenleri',
                description: 'Fren sisteminin temel bileşenleri.',
                components: [
            {
                id: 'fren-balata',
                name: 'Fren Balatası',
                slug: 'fren-balata',
                description: 'Fren diskine sürtünerek aracı yavaşlatan sürtünme malzemesi.',
                function: 'Fren pedalına basıldığında fren diskine baskı yaparak sürtünme oluşturur ve aracı yavaşlatır.',
                symptoms: [
                    'Fren yaparken cırlama sesi',
                    'Fren pedalında titreme',
                    'Fren mesafesinde uzama',
                    'Fren yaparken çekme hissi',
                    'Fren lambası yanması'
                ],
                repairAdvice: [
                    'Balatalar genellikle 30.000-70.000 km\'de değiştirilmeli',
                    'Ön ve arka balatalar aynı anda değiştirilmeli',
                    'Fren diskleri de kontrol edilmeli',
                    'Kaliteli balata kullanımı önemlidir',
                    'Aşınma göstergesi varsa takip edilmeli'
                ],
                estimatedCost: { min: 600, max: 1800 },
                laborTime: '1-2 saat',
                relatedComponents: ['fren-diski', 'fren-hidrolik']
            },
            {
                id: 'fren-diski',
                name: 'Fren Diski',
                slug: 'fren-diski',
                description: 'Balataların sürtündüğü metal disk.',
                function: 'Balataların sürtünmesiyle ısı oluşturarak kinetik enerjiyi ısı enerjisine dönüştürür.',
                symptoms: [
                    'Fren yaparken titreme',
                    'Fren yaparken gürültü',
                    'Fren performansında düşüş',
                    'Direksiyonda titreme',
                    'Disk yüzeyinde çizikler'
                ],
                repairAdvice: [
                    'Diskler genellikle 60.000-100.000 km\'de değiştirilmeli',
                    'Disk kalınlığı minimum değerin üzerinde olmalı',
                    'Çarpık veya çizik diskler değiştirilmeli',
                    'Diskler çiftler halinde değiştirilmeli',
                    'Yeni balata takılırken diskler kontrol edilmeli'
                ],
                estimatedCost: { min: 800, max: 2500 },
                laborTime: '1-2 saat',
                relatedComponents: ['fren-balata', 'fren-kaliper']
            },
                    {
                        id: 'abs-kontrol-modulu',
                        name: 'ABS Kontrol Modülü (ABS Control Module)',
                        slug: 'abs-kontrol-modulu',
                        description: 'ABS sisteminin beyni.',
                        function: 'Tekerlek sensörlerinden veri alarak fren basıncını kontrol eder.',
                        symptoms: ['ABS lambası yanıyor', 'ABS çalışmıyor', 'Fren performans kaybı'],
                        repairAdvice: ['Pahalı parça', 'Teşhis gerektirir', 'Kodlar okunmalı'],
                        estimatedCost: { min: 3000, max: 8000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'abs-tekerlek-sensoru',
                        name: 'ABS Tekerlek Hız Sensörü (ABS Wheel Speed Sensor)',
                        slug: 'abs-tekerlek-sensoru',
                        description: 'Tekerlek hızını ölçer.',
                        function: 'Her tekerleğin hızını ABS modülüne bildirir.',
                        symptoms: ['ABS lambası', 'ABS çalışmıyor', 'Tek tekerlek sorunu'],
                        repairAdvice: ['Sensör başına değiştirilir', 'Elektrik bağlantıları kontrol edilmeli'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'abs-pompasi',
                        name: 'ABS Pompası (ABS Pump)',
                        slug: 'abs-pompasi',
                        description: 'ABS hidrolik pompası.',
                        function: 'Fren basıncını hızla artırıp azaltır.',
                        symptoms: ['ABS lambası', 'Gürültü', 'ABS çalışmıyor'],
                        repairAdvice: ['Çok pahalı', 'Genelde modül ile birlikte'],
                        estimatedCost: { min: 4000, max: 10000 },
                        laborTime: '3-5 saat'
                    },
                    {
                        id: 'abs-valf',
                        name: 'ABS Valf Grubu (ABS Valve Assembly)',
                        slug: 'abs-valf',
                        description: 'ABS hidrolik valfleri.',
                        function: 'Her tekerleğin fren basıncını ayrı ayrı kontrol eder.',
                        symptoms: ['ABS lambası', 'Fren performans kaybı'],
                        repairAdvice: ['Pompa ile birlikte olabilir'],
                        estimatedCost: { min: 3000, max: 8000 },
                        laborTime: '3-5 saat'
                    },
                    {
                        id: 'fren-guclendirici',
                        name: 'Fren Güçlendirici (Brake Booster)',
                        slug: 'fren-guclendirici',
                        description: 'Fren pedalı kuvvetini artırır.',
                        function: 'Vakum kullanarak pedal kuvvetini 3-4 kat artırır.',
                        symptoms: ['Sert fren pedalı', 'Fren gücü yok', 'Hissing sesi'],
                        repairAdvice: ['Vakum kaçağı kontrol edilmeli', 'Pompa kontrol edilmeli'],
                        estimatedCost: { min: 2000, max: 5000 },
                        laborTime: '3-5 saat'
                    },
                    {
                        id: 'fren-tamburu',
                        name: 'Fren Tamburları (Brake Drums)',
                        slug: 'fren-tamburu',
                        description: 'Arka tekerleklerde tambur fren.',
                        function: 'Fren pabuçlarının sürtündüğü dönen tambur.',
                        symptoms: ['Fren gürültüsü', 'Titreşim', 'Fren mesafesi uzun'],
                        repairAdvice: ['Aşınma limiti kontrol edilmeli', 'Tornalama yapılabilir'],
                        estimatedCost: { min: 800, max: 2000 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'fren-hortumu',
                        name: 'Fren Hortumu (Brake Flexible Hose)',
                        slug: 'fren-hortumu',
                        description: 'Esnek fren hortumu.',
                        function: 'Hidrolik sıvıyı ana hattan kalipere iletir.',
                        symptoms: ['Fren sızıntısı', 'Yumuşak pedal', 'Şişmiş hortum'],
                        repairAdvice: ['Çatlak veya şişmiş hortumlar değiştirilmeli'],
                        estimatedCost: { min: 300, max: 800 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'fren-asinma-sensoru-elektrik',
                        name: 'Fren Aşınma Sensörü - Elektrikli',
                        slug: 'fren-asinma-sensoru-elektrik',
                        description: 'Balata aşınmasını elektrikli olarak algılar.',
                        function: 'Balata ince olunca göstergeyi yakar.',
                        symptoms: ['Fren aşınma lambası', 'Uyarı sesi'],
                        repairAdvice: ['Balata değişiminde yenilenmeli'],
                        estimatedCost: { min: 200, max: 600 },
                        laborTime: '30 dakika'
                    },
                    {
                        id: 'fren-asinma-sensoru-mekanik',
                        name: 'Fren Aşınma Sensörü - Mekanik',
                        slug: 'fren-asinma-sensoru-mekanik',
                        description: 'Balata aşınmasını sesle bildirir.',
                        function: 'Metal parça diske değerek cırlama sesi çıkarır.',
                        symptoms: ['Cırlama sesi', 'Fren sesi'],
                        repairAdvice: ['Balata değişiminde yenilenir'],
                        estimatedCost: { min: 100, max: 300 },
                        laborTime: '30 dakika'
                    },
                    {
                        id: 'fren-pabuclari',
                        name: 'Fren Pabuçları (Brake Shoes)',
                        slug: 'fren-pabuclari',
                        description: 'Tambur fren sisteminde kullanılan pabuçlar.',
                        function: 'Tambura sürtünerek frenleme sağlar.',
                        symptoms: ['Fren gürültüsü', 'Fren mesafesi uzun', 'El freni tutmuyor'],
                        repairAdvice: ['Çiftler halinde değiştirilmeli', 'Tambur kontrol edilmeli'],
                        estimatedCost: { min: 600, max: 1500 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'poyra',
                        name: 'Poyra (Hub Assembly)',
                        slug: 'poyra',
                        description: 'Tekerlek göbeği ve rulman grubu.',
                        function: 'Tekerleği döndürür ve ABS sensörünü barındırır.',
                        symptoms: ['Gürültü', 'Titreşim', 'ABS lambası', 'Oynak tekerlek'],
                        repairAdvice: ['Rulman aşınmışsa değiştirilmeli', 'Tork önemli'],
                        estimatedCost: { min: 1200, max: 3000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'el-freni-pabuclari',
                        name: 'El Freni Pabuçları (Parking Brake Shoes)',
                        slug: 'el-freni-pabuclari',
                        description: 'Ayrı el freni pabuçları.',
                        function: 'Bazı araçlarda diskli frenlerde el freni için ayrı tambur sistemi.',
                        symptoms: ['El freni tutmuyor', 'El freni lambası'],
                        repairAdvice: ['Ayar yapılmalı', 'Aşınmışsa değiştirilmeli'],
                        estimatedCost: { min: 400, max: 1000 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'tekerlek-silindiri',
                        name: 'Tekerlek Silindiri (Wheel Cylinder)',
                        slug: 'tekerlek-silindiri',
                        description: 'Tambur frenlerde hidrolik silindir.',
                        function: 'Hidrolik basıncı pabuçlara iletir.',
                        symptoms: ['Fren sızıntısı', 'Yumuşak pedal', 'Tek taraf fren yapmıyor'],
                        repairAdvice: ['Sızıntı varsa değiştirilmeli', 'Çiftler halinde önerilir'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'abs-diferansiyel-sensoru',
                        name: 'ABS Diferansiyel Sensörü (ABS Differential Sensor)',
                        slug: 'abs-diferansiyel-sensoru',
                        description: 'Diferansiyel hızını ölçer.',
                        function: 'Bazı ABS sistemlerinde diferansiyel hızını izler.',
                        symptoms: ['ABS lambası', 'Traction control sorunu'],
                        repairAdvice: ['Nadir kullanılır', 'Teşhis gerektirir'],
                        estimatedCost: { min: 600, max: 1800 },
                        laborTime: '1-2 saat'
                    }
                
                ]
            }
        ],
        components: []
    },
    {
        id: 'suspansiyon',
        name: 'Süspansiyon Sistemi',
        slug: 'suspansiyon-sistemi',
        description: 'Sürüş konforunu sağlayan ve yol tutuşunu iyileştiren sistem.',
        icon: 'suspension',
        color: 'blue',
        subsystems: [
            {
                id: 'suspansiyon-bilesenleri',
                name: 'Süspansiyon Bileşenleri',
                slug: 'suspansiyon-bilesenleri',
                description: 'Süspansiyon sisteminin temel bileşenleri.',
                components: [
            {
                id: 'amortisör',
                name: 'Amortisör',
                slug: 'amortisor',
                description: 'Yay hareketlerini sönümleyerek sürüş konforunu sağlar.',
                function: 'Yayların hareketini kontrol ederek aracın zıplamasını önler ve yol tutuşunu iyileştirir.',
                symptoms: [
                    'Aşırı zıplama',
                    'Virajlarda yalpalama',
                    'Frenleme sırasında öne dalma',
                    'Lastik aşınması',
                    'Yağ sızıntısı'
                ],
                repairAdvice: [
                    'Amortisörler genellikle 80.000-100.000 km\'de değiştirilmeli',
                    'Çiftler halinde değiştirilmeli',
                    'Gaz veya yağ amortisör seçimi önemli',
                    'Yay durumu da kontrol edilmeli',
                    'Kaliteli marka tercih edilmeli'
                ],
                estimatedCost: { min: 1500, max: 4000 },
                laborTime: '2-3 saat',
                relatedComponents: ['yay', 'rot']
            },
                    {
                        id: 'aktif-suspansiyon',
                        name: 'Aktif Süspansiyon (Active Suspension)',
                        slug: 'aktif-suspansiyon',
                        description: 'Elektronik kontrollü süspansiyon.',
                        function: 'Yol koşullarına göre sertliği otomatik ayarlar.',
                        symptoms: ['Sert sürüş', 'Yumuşak sürüş', 'Süspansiyon lambası'],
                        repairAdvice: ['Çok pahalı', 'Uzman gerektirir'],
                        estimatedCost: { min: 5000, max: 15000 },
                        laborTime: '4-8 saat'
                    },
                    {
                        id: 'rotil',
                        name: 'Rotil (Ball Joint)',
                        slug: 'rotil',
                        description: 'Tekerleği salıncak koluna bağlar.',
                        function: 'Tekerleğin yukarı aşağı ve dönme hareketini sağlar.',
                        symptoms: ['Direksiyon titremesi', 'Gürültü', 'Lastikte aşınma'],
                        repairAdvice: ['Oynak rotiller değiştirilmeli', 'Rot ayarı gerekir'],
                        estimatedCost: { min: 600, max: 1800 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'aks-körüğü',
                        name: 'Aks Körüğü (CV Half Shaft Boot Kit)',
                        slug: 'aks-korugu',
                        description: 'Aks mafsalını korur.',
                        function: 'Sabit hızlı mafsalı toz ve sudan korur.',
                        symptoms: ['Yırtık körük', 'Gres sızıntısı', 'Tıklama sesi'],
                        repairAdvice: ['Yırtılmışsa hemen değiştirilmeli', 'Mafsal hasar görebilir'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'salincak-kolu',
                        name: 'Salıncak Kolu (Control Arm)',
                        slug: 'salincak-kolu',
                        description: 'Tekerleği şasiye bağlar.',
                        function: 'Süspansiyon geometrisini sağlar.',
                        symptoms: ['Direksiyon titremesi', 'Gürültü', 'Lastikte aşınma'],
                        repairAdvice: ['Eğilmiş veya kırık kollar değiştirilmeli'],
                        estimatedCost: { min: 1000, max: 3000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'salincak-burcu',
                        name: 'Salıncak Burcu (Control Arm Bushing)',
                        slug: 'salincak-burcu',
                        description: 'Salıncak kolunun kauçuk burcu.',
                        function: 'Salıncağı şasiye esnek bağlar.',
                        symptoms: ['Gürültü', 'Titreşim', 'Lastikte aşınma'],
                        repairAdvice: ['Yıpranmış burclar değiştirilmeli'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'on-helezon-yay',
                        name: 'Ön Helezon Yay (Front Coil Spring)',
                        slug: 'on-helezon-yay',
                        description: 'Ön süspansiyon yayı.',
                        function: 'Aracın ağırlığını taşır ve darbeleri emer.',
                        symptoms: ['Çökmüş ön', 'Gürültü', 'Sert sürüş'],
                        repairAdvice: ['Kırık veya çökmüş yaylar değiştirilmeli', 'Çiftler halinde'],
                        estimatedCost: { min: 800, max: 2500 },
                        laborTime: '3-5 saat'
                    },
                    {
                        id: 'on-amortisör',
                        name: 'Ön Amortisör (Front Shock Absorber)',
                        slug: 'on-amortisor',
                        description: 'Ön darbe emici.',
                        function: 'Yay hareketini sönümler.',
                        symptoms: ['Zıplama', 'Dalga geçiş', 'Sızıntı', 'Gürültü'],
                        repairAdvice: ['Çiftler halinde değiştirilmeli'],
                        estimatedCost: { min: 1000, max: 3000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'on-stabilizator',
                        name: 'Ön Stabilizatör (Front Sway Bar)',
                        slug: 'on-stabilizator',
                        description: 'Ön viraj dengesi çubuğu.',
                        function: 'Virajlarda yan yatmayı azaltır.',
                        symptoms: ['Aşırı yan yatma', 'Gürültü'],
                        repairAdvice: ['Burc ve bağlantılar kontrol edilmeli'],
                        estimatedCost: { min: 600, max: 1800 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'ic-rot-baglantisi',
                        name: 'İç Rot Başı (Inner Tie Rod End)',
                        slug: 'ic-rot-baglantisi',
                        description: 'Direksiyon kutusuna bağlı rot.',
                        function: 'Direksiyon hareketini tekerleklere iletir.',
                        symptoms: ['Direksiyon titremesi', 'Lastikte aşınma', 'Oynak direksiyon'],
                        repairAdvice: ['Rot ayarı gerekir', 'Dış rot ile birlikte kontrol edilmeli'],
                        estimatedCost: { min: 600, max: 1800 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'yaprak-yay',
                        name: 'Yaprak Yay (Leaf Spring)',
                        slug: 'yaprak-yay',
                        description: 'Ticari araçlarda arka yay.',
                        function: 'Yük taşır ve süspansiyon sağlar.',
                        symptoms: ['Çökmüş arka', 'Kırık yaprak', 'Gürültü'],
                        repairAdvice: ['Kırık yapraklar değiştirilmeli'],
                        estimatedCost: { min: 1500, max: 4000 },
                        laborTime: '3-5 saat'
                    },
                    {
                        id: 'hidrolik-direksiyon-sıvısı',
                        name: 'Hidrolik Direksiyon Sıvısı',
                        slug: 'hidrolik-direksiyon-sivisi',
                        description: 'Power steering yağı.',
                        function: 'Hidrolik basınç sağlar.',
                        symptoms: ['Düşük seviye', 'Kirli yağ', 'Sızıntı'],
                        repairAdvice: ['Düzenli kontrol edilmeli', 'Sızıntı varsa tamir'],
                        estimatedCost: { min: 100, max: 300 },
                        laborTime: '30 dakika'
                    },
                    {
                        id: 'direksiyon-basinc-hortumu',
                        name: 'Direksiyon Basınç Hortumu',
                        slug: 'direksiyon-basinc-hortumu',
                        description: 'Yüksek basınçlı hidrolik hortum.',
                        function: 'Pompadan direksiyon kutusuna yağ taşır.',
                        symptoms: ['Sızıntı', 'Ağır direksiyon', 'Gürültü'],
                        repairAdvice: ['Sızıntı varsa değiştirilmeli'],
                        estimatedCost: { min: 600, max: 1800 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'direksiyon-pompasi',
                        name: 'Direksiyon Pompası (Power Steering Pump)',
                        slug: 'direksiyon-pompasi',
                        description: 'Hidrolik direksiyon pompası.',
                        function: 'Hidrolik basınç oluşturur.',
                        symptoms: ['Ağır direksiyon', 'Gürültü', 'Sızıntı'],
                        repairAdvice: ['Kayış kontrol edilmeli', 'Yağ seviyesi önemli'],
                        estimatedCost: { min: 2000, max: 5000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'arka-helezon-yay',
                        name: 'Arka Helezon Yay (Rear Coil Spring)',
                        slug: 'arka-helezon-yay',
                        description: 'Arka süspansiyon yayı.',
                        function: 'Arka ağırlığı taşır.',
                        symptoms: ['Çökmüş arka', 'Gürültü'],
                        repairAdvice: ['Çiftler halinde değiştirilmeli'],
                        estimatedCost: { min: 800, max: 2500 },
                        laborTime: '3-5 saat'
                    },
                    {
                        id: 'arka-amortisör',
                        name: 'Arka Amortisör (Rear Shock Absorber)',
                        slug: 'arka-amortisor',
                        description: 'Arka darbe emici.',
                        function: 'Arka yay hareketini sönümler.',
                        symptoms: ['Zıplama', 'Sızıntı', 'Gürültü'],
                        repairAdvice: ['Çiftler halinde değiştirilmeli'],
                        estimatedCost: { min: 1000, max: 3000 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'arka-stabilizator',
                        name: 'Arka Stabilizatör (Rear Sway Bar)',
                        slug: 'arka-stabilizator',
                        description: 'Arka viraj dengesi çubuğu.',
                        function: 'Arka yan yatmayı azaltır.',
                        symptoms: ['Aşırı yan yatma', 'Gürültü'],
                        repairAdvice: ['Burc ve bağlantılar kontrol edilmeli'],
                        estimatedCost: { min: 600, max: 1800 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'arka-salincak',
                        name: 'Arka Salıncak (Rear Trailing Arm)',
                        slug: 'arka-salincak',
                        description: 'Arka tekerlek salıncağı.',
                        function: 'Arka tekerleği şasiye bağlar.',
                        symptoms: ['Gürültü', 'Lastikte aşınma'],
                        repairAdvice: ['Burclar kontrol edilmeli'],
                        estimatedCost: { min: 1000, max: 3000 },
                        laborTime: '3-5 saat'
                    },
                    {
                        id: 'direksiyon-kolonu',
                        name: 'Direksiyon Kolonu (Steering Column)',
                        slug: 'direksiyon-kolonu',
                        description: 'Direksiyon simidini kutuya bağlar.',
                        function: 'Direksiyon hareketini iletir.',
                        symptoms: ['Gürültü', 'Oynak direksiyon', 'Kilit sorunu'],
                        repairAdvice: ['Güvenlik parçası', 'Uzman gerektirir'],
                        estimatedCost: { min: 2000, max: 5000 },
                        laborTime: '3-5 saat'
                    },
                    {
                        id: 'direksiyon-ara-mil',
                        name: 'Direksiyon Ara Mili (Steering Intermediate Shaft)',
                        slug: 'direksiyon-ara-mil',
                        description: 'Kolon ile kutu arasındaki mil.',
                        function: 'Direksiyon hareketini esnek iletir.',
                        symptoms: ['Gürültü', 'Tıklama', 'Titreşim'],
                        repairAdvice: ['Mafsal kontrol edilmeli'],
                        estimatedCost: { min: 800, max: 2000 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'direksiyon-kutusu',
                        name: 'Direksiyon Kutusu (Steering Rack And Pinion)',
                        slug: 'direksiyon-kutusu',
                        description: 'Kremayer direksiyon sistemi.',
                        function: 'Direksiyon hareketini tekerleklere iletir.',
                        symptoms: ['Ağır direksiyon', 'Sızıntı', 'Oynak direksiyon'],
                        repairAdvice: ['Çok pahalı', 'Rot ayarı gerekir'],
                        estimatedCost: { min: 4000, max: 12000 },
                        laborTime: '4-8 saat'
                    },
                    {
                        id: 'direksiyon-korugu',
                        name: 'Direksiyon Körüğü (Steering Rack Boot)',
                        slug: 'direksiyon-korugu',
                        description: 'Direksiyon kutusunu korur.',
                        function: 'Kutuyu toz ve sudan korur.',
                        symptoms: ['Yırtık körük', 'Gres sızıntısı'],
                        repairAdvice: ['Yırtılmışsa hemen değiştirilmeli'],
                        estimatedCost: { min: 300, max: 800 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'direksiyon-burclari',
                        name: 'Direksiyon Kutusu Burcları',
                        slug: 'direksiyon-burclari',
                        description: 'Kutuyu şasiye bağlayan burclar.',
                        function: 'Kutuyu esnek tutar.',
                        symptoms: ['Gürültü', 'Titreşim'],
                        repairAdvice: ['Yıpranmış burclar değiştirilmeli'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'amortisör-rulman',
                        name: 'Amortisör Rulmanı (Strut Bearing)',
                        slug: 'amortisor-rulman',
                        description: 'Amortisör üst rulmanı.',
                        function: 'Amortisörün dönmesini sağlar.',
                        symptoms: ['Direksiyon gürültüsü', 'Tıklama'],
                        repairAdvice: ['Amortisör değişiminde kontrol edilmeli'],
                        estimatedCost: { min: 300, max: 800 },
                        laborTime: '2-3 saat (amortisör ile birlikte)'
                    },
                    {
                        id: 'amortisör-grubu',
                        name: 'Amortisör Grubu (Struts)',
                        slug: 'amortisor-grubu',
                        description: 'Yay ve amortisör birlikte.',
                        function: 'MacPherson tipi süspansiyon.',
                        symptoms: ['Zıplama', 'Sızıntı', 'Gürültü'],
                        repairAdvice: ['Komple grup değişimi', 'Çiftler halinde'],
                        estimatedCost: { min: 2000, max: 6000 },
                        laborTime: '3-5 saat'
                    },
                    {
                        id: 'porya',
                        name: 'Porya (Suspension Knuckle)',
                        slug: 'porya',
                        description: 'Tekerlek taşıyıcı.',
                        function: 'Tekerleği, freni ve süspansiyonu birleştirir.',
                        symptoms: ['Hasar', 'Çatlak'],
                        repairAdvice: ['Nadir değiştirilir', 'Kaza hasarı'],
                        estimatedCost: { min: 1500, max: 4000 },
                        laborTime: '4-6 saat'
                    },
                    {
                        id: 'stabilizator-burcu',
                        name: 'Stabilizatör Burcu (Sway Bar Bushing)',
                        slug: 'stabilizator-burcu',
                        description: 'Stabilizatör kauçuk burcu.',
                        function: 'Stabilizatörü şasiye esnek bağlar.',
                        symptoms: ['Gürültü', 'Tıklama'],
                        repairAdvice: ['Ucuz parça', 'Kolay değişim'],
                        estimatedCost: { min: 200, max: 600 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'arka-stabilizator-baglantisi',
                        name: 'Arka Stabilizatör Bağlantısı',
                        slug: 'arka-stabilizator-baglantisi',
                        description: 'Arka stabilizatör link.',
                        function: 'Stabilizatörü süspansiyona bağlar.',
                        symptoms: ['Gürültü', 'Tıklama'],
                        repairAdvice: ['Çiftler halinde değiştirilmeli'],
                        estimatedCost: { min: 300, max: 800 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'stabilizator-baglantisi',
                        name: 'Stabilizatör Bağlantısı (Sway Bar End Links)',
                        slug: 'stabilizator-baglantisi',
                        description: 'Ön stabilizatör link.',
                        function: 'Stabilizatörü süspansiyona bağlar.',
                        symptoms: ['Gürültü', 'Tıklama'],
                        repairAdvice: ['Çiftler halinde değiştirilmeli'],
                        estimatedCost: { min: 300, max: 800 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'tekerlek-rulman',
                        name: 'Tekerlek Rulmanı (Wheel Bearing)',
                        slug: 'tekerlek-rulman',
                        description: 'Tekerlek göbeği rulmanı.',
                        function: 'Tekerleğin dönmesini sağlar.',
                        symptoms: ['Gürültü', 'Uğultu', 'Titreşim', 'ABS lambası'],
                        repairAdvice: ['Gürültü varsa hemen değiştirilmeli'],
                        estimatedCost: { min: 800, max: 2500 },
                        laborTime: '2-4 saat'
                    }
                
                ]
            }
        ],
        components: []
    },
    {
        id: 'elektrik',
        name: 'Elektrik Sistemi',
        slug: 'elektrik-sistemi',
        description: 'Aracın tüm elektrikli bileşenlerini besleyen ve kontrol eden sistem.',
        icon: 'electric',
        color: 'yellow',
        subsystems: [
            {
                id: 'elektrik-bilesenleri',
                name: 'Elektrik Bileşenleri',
                slug: 'elektrik-bilesenleri',
                description: 'Elektrik sisteminin temel bileşenleri.',
                components: [
            {
                id: 'aküü',
                name: 'Akü',
                slug: 'aku',
                description: 'Aracın elektrik enerjisini depolayan batarya.',
                function: 'Marş motorunu çalıştırır ve motor kapalıyken elektrikli sistemlere güç sağlar.',
                symptoms: [
                    'Zor çalışma',
                    'Farların sönük yanması',
                    'Elektrikli aksesuarlarda sorun',
                    'Akü lambası yanması',
                    'Korozyon oluşumu'
                ],
                repairAdvice: [
                    'Akü ömrü genellikle 3-5 yıldır',
                    'Kutuplar temiz tutulmalı',
                    'Akü suyu seviyesi kontrol edilmeli (bakımlı akülerde)',
                    'Soğuk havalarda performans düşer',
                    'Alternatör de kontrol edilmeli'
                ],
                estimatedCost: { min: 1200, max: 3500 },
                laborTime: '30 dakika',
                relatedComponents: ['alternator', 'mars-motoru']
            },
                    {
                        id: 'cam-motoru',
                        name: 'Cam Motoru (Door Window Motor)',
                        slug: 'cam-motoru',
                        description: 'Elektrikli cam motorları.',
                        function: 'Camları yukarı aşağı hareket ettirir.',
                        symptoms: ['Cam çalışmıyor', 'Yavaş hareket', 'Gürültü'],
                        repairAdvice: ['Motor veya regülatör sorunu olabilir'],
                        estimatedCost: { min: 800, max: 2500 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'cam-regulatoru',
                        name: 'Cam Regülatörü (Door Window Regulator)',
                        slug: 'cam-regulatoru',
                        description: 'Cam mekanizması.',
                        function: 'Camı yukarı aşağı hareket ettiren mekanik sistem.',
                        symptoms: ['Cam düşüyor', 'Cam sıkışıyor', 'Gürültü'],
                        repairAdvice: ['Motor ile birlikte değiştirilmeli'],
                        estimatedCost: { min: 1000, max: 3000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'sigorta-kutusu',
                        name: 'Sigorta Kutusu (Fuse Box)',
                        slug: 'sigorta-kutusu',
                        description: 'Elektrik devrelerini korur.',
                        function: 'Sigortaları ve röleleri barındırır.',
                        symptoms: ['Elektrik arızaları', 'Bazı sistemler çalışmıyor'],
                        repairAdvice: ['Sigortalar kontrol edilmeli', 'Nadir değiştirilir'],
                        estimatedCost: { min: 500, max: 2000 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'far',
                        name: 'Far (Headlight)',
                        slug: 'far',
                        description: 'Ön aydınlatma sistemi.',
                        function: 'Yolu aydınlatır.',
                        symptoms: ['Far yanmıyor', 'Buğulanma', 'Kırık cam'],
                        repairAdvice: ['Ampul veya far grubu değişimi'],
                        estimatedCost: { min: 500, max: 3000 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'far-ampulu',
                        name: 'Far Ampulü (Headlight Bulb)',
                        slug: 'far-ampulu',
                        description: 'Far lambası.',
                        function: 'Işık üretir.',
                        symptoms: ['Far yanmıyor', 'Sönük ışık'],
                        repairAdvice: ['Çiftler halinde değiştirilmeli', 'Doğru tip kullanılmalı'],
                        estimatedCost: { min: 100, max: 500 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'hibrit-batarya-modulu',
                        name: 'Hibrit Batarya Kontrol Modülü',
                        slug: 'hibrit-batarya-modulu',
                        description: 'Hibrit araçlarda batarya yönetimi.',
                        function: 'Yüksek voltaj bataryasını kontrol eder.',
                        symptoms: ['Hibrit sistem arızası', 'Güç kaybı'],
                        repairAdvice: ['Çok pahalı', 'Uzman gerektirir'],
                        estimatedCost: { min: 10000, max: 30000 },
                        laborTime: '4-8 saat'
                    },
                    {
                        id: 'kontak-kilidi-silindir',
                        name: 'Kontak Kilidi Silindiri',
                        slug: 'kontak-kilidi-silindir',
                        description: 'Anahtarın girdiği mekanik kilit.',
                        function: 'Anahtarı kabul eder ve döndürür.',
                        symptoms: ['Anahtar dönmüyor', 'Anahtar sıkışıyor'],
                        repairAdvice: ['Elektrik grubu ile birlikte olabilir'],
                        estimatedCost: { min: 800, max: 2500 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'kontak-elektrik-grubu',
                        name: 'Kontak Elektrik Grubu',
                        slug: 'kontak-elektrik-grubu',
                        description: 'Kontak anahtarının elektrik bağlantıları.',
                        function: 'Kontak pozisyonlarını elektrik sistemine iletir.',
                        symptoms: ['Kontak çalışmıyor', 'Elektrik kesilmesi'],
                        repairAdvice: ['Silindir ile birlikte değişebilir'],
                        estimatedCost: { min: 600, max: 2000 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'kontak-anahtari',
                        name: 'Kontak Anahtarı (Ignition Switch)',
                        slug: 'kontak-anahtari',
                        description: 'Kontak anahtarı.',
                        function: 'Aracı çalıştırır ve elektriği kontrol eder.',
                        symptoms: ['Araç çalışmıyor', 'Elektrik yok'],
                        repairAdvice: ['Teşhis gerektirir'],
                        estimatedCost: { min: 500, max: 1800 },
                        laborTime: '1-3 saat'
                    },
                    {
                        id: 'hava-yastigi-modulu',
                        name: 'Hava Yastığı Kontrol Modülü (ORC)',
                        slug: 'hava-yastigi-modulu',
                        description: 'Airbag sisteminin beyni.',
                        function: 'Çarpışmayı algılar ve hava yastıklarını patlatır.',
                        symptoms: ['Airbag lambası', 'Hava yastığı çalışmıyor'],
                        repairAdvice: ['Çok hassas', 'Uzman gerektirir', 'Pahalı'],
                        estimatedCost: { min: 3000, max: 8000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'merkezi-kilit-aktuatoru',
                        name: 'Merkezi Kilit Aktüatörü',
                        slug: 'merkezi-kilit-aktuatoru',
                        description: 'Kapı kilit motoru.',
                        function: 'Kapıları kilitler ve açar.',
                        symptoms: ['Kapı kilitlenmiyor', 'Gürültü', 'Tek kapı çalışmıyor'],
                        repairAdvice: ['Kapı başına değiştirilir'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'role',
                        name: 'Röle (Relay)',
                        slug: 'role',
                        description: 'Elektrik anahtarlama rölesi.',
                        function: 'Yüksek akımları düşük akımla kontrol eder.',
                        symptoms: ['İlgili sistem çalışmıyor', 'Tıklama sesi'],
                        repairAdvice: ['Ucuz parça', 'Kolay değişim'],
                        estimatedCost: { min: 50, max: 300 },
                        laborTime: '15-30 dakika'
                    },
                    {
                        id: 'sicaklik-gostergesi',
                        name: 'Sıcaklık Göstergesi',
                        slug: 'sicaklik-gostergesi',
                        description: 'Motor sıcaklığını gösterir.',
                        function: 'Sıcaklık sensöründen veri alarak gösterge yapar.',
                        symptoms: ['Gösterge çalışmıyor', 'Yanlış gösterim'],
                        repairAdvice: ['Sensör veya gösterge sorunu olabilir'],
                        estimatedCost: { min: 300, max: 1000 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'makyaj-aynasi',
                        name: 'Makyaj Aynası (Vanity Mirror)',
                        slug: 'makyaj-aynasi',
                        description: 'Güneşlikteki aydınlatmalı ayna.',
                        function: 'İç aydınlatma sağlar.',
                        symptoms: ['Işık yanmıyor', 'Ayna kırık'],
                        repairAdvice: ['Güneşlik ile birlikte değişebilir'],
                        estimatedCost: { min: 200, max: 800 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'silecek-motoru',
                        name: 'Silecek Motoru (Windshield Wiper Motor)',
                        slug: 'silecek-motoru',
                        description: 'Ön cam silecek motoru.',
                        function: 'Silecekleri hareket ettirir.',
                        symptoms: ['Silecek çalışmıyor', 'Yavaş hareket', 'Gürültü'],
                        repairAdvice: ['Motor veya mekanizma sorunu'],
                        estimatedCost: { min: 800, max: 2500 },
                        laborTime: '2-3 saat'
                    }
                
                ]
            }
        ],
        components: []
    },
    {
        id: 'yakit',
        name: 'Yakıt Sistemi',
        slug: 'yakit-sistemi',
        description: 'Yakıtı depodan motora ileten ve püskürten sistem.',
        icon: 'fuel',
        color: 'green',
        subsystems: [
            {
                id: 'yakit-bilesenleri',
                name: 'Yakıt Bileşenleri',
                slug: 'yakit-bilesenleri',
                description: 'Yakıt sisteminin temel bileşenleri.',
                components: [
            {
                id: 'yakit-filtresi',
                name: 'Yakıt Filtresi',
                slug: 'yakit-filtresi',
                description: 'Yakıttaki kirleri filtreleyen bileşen.',
                function: 'Yakıt sistemine giren kirleri ve partikülleri filtreler, enjektörleri korur.',
                symptoms: [
                    'Motor gücünde kayıp',
                    'Zor çalışma',
                    'Motor takılması',
                    'Yakıt tüketiminde artış',
                    'Motor arızası lambası'
                ],
                repairAdvice: [
                    'Filtre 20.000-40.000 km\'de değiştirilmeli',
                    'Kalitesiz yakıt kullanımında daha sık değişmeli',
                    'Tıkanmış filtre enjektör hasarına yol açabilir',
                    'Orijinal veya kaliteli filtre kullanılmalı'
                ],
                estimatedCost: { min: 300, max: 800 },
                laborTime: '30 dakika - 1 saat',
                relatedComponents: ['yakit-pompasi', 'enjektör']
            },
            {
                id: 'yakit-pompasi',
                name: 'Yakıt Pompası',
                slug: 'yakit-pompasi',
                description: 'Yakıtı depodan motora pompalayan bileşen.',
                function: 'Yakıtı yeterli basınçta depodan enjektörlere iletir.',
                symptoms: [
                    'Motor çalışmıyor',
                    'Zor çalışma',
                    'Motor gücünde kayıp',
                    'Yüksek devirde takılma',
                    'Vınlama sesi'
                ],
                repairAdvice: [
                    'Pompa genellikle 100.000-150.000 km dayanır',
                    'Depo boş kaldığında pompa zarar görebilir',
                    'Yakıt filtresi ile birlikte kontrol edilmeli',
                    'Elektrik bağlantıları kontrol edilmeli'
                ],
                estimatedCost: { min: 1500, max: 4000 },
                laborTime: '2-4 saat',
                relatedComponents: ['yakit-filtresi', 'yakit-basinc-regulatoru']
            },
            {
                id: 'yakit-enjektoru',
                name: 'Yakıt Enjektörü',
                slug: 'yakit-enjektoru',
                description: 'Yakıtı motora püskürten bileşen.',
                function: 'Yakıtı ince bir sis halinde silindirlere püskürtür.',
                symptoms: [
                    'Motor takılması',
                    'Rölanti düzensizliği',
                    'Yakıt tüketiminde artış',
                    'Motor gücünde kayıp',
                    'Kötü egzoz kokusu'
                ],
                repairAdvice: [
                    'Enjektörler temizlenebilir veya değiştirilir',
                    'Kaliteli yakıt kullanımı ömrünü uzatır',
                    'Tüm enjektörler birlikte değiştirilmeli',
                    'Ultrasonik temizleme etkilidir'
                ],
                estimatedCost: { min: 800, max: 2500 },
                laborTime: '2-3 saat (adet başına)',
                relatedComponents: ['yakit-filtresi', 'yakit-pompasi']
            },
            {
                id: 'yakit-deposu',
                name: 'Yakıt Deposu',
                slug: 'yakit-deposu',
                description: 'Yakıtın depolandığı tank.',
                function: 'Yakıtı güvenli bir şekilde saklar.',
                symptoms: [
                    'Yakıt sızıntısı',
                    'Yakıt kokusu',
                    'Pas veya korozyon',
                    'Depo şişmesi',
                    'Yakıt seviye göstergesi arızası'
                ],
                repairAdvice: [
                    'Sızıntı varsa hemen tamir edilmeli',
                    'Pas oluşumu kontrol edilmeli',
                    'Depo içi temizliği önemlidir',
                    'Nadir değiştirilir, genellikle kaza hasarı'
                ],
                estimatedCost: { min: 3000, max: 8000 },
                laborTime: '4-6 saat',
                relatedComponents: ['yakit-pompasi', 'yakit-samandirasi']
            },
            {
                id: 'yakit-basinc-regulatoru',
                name: 'Yakıt Basınç Regülatörü',
                slug: 'yakit-basinc-regulatoru',
                description: 'Yakıt basıncını ayarlayan bileşen.',
                function: 'Yakıt hattındaki basıncı sabit tutar.',
                symptoms: [
                    'Motor takılması',
                    'Zor çalışma',
                    'Yakıt tüketiminde artış',
                    'Siyah egzoz dumanı',
                    'Yakıt sızıntısı'
                ],
                repairAdvice: [
                    'Basınç testi yapılmalı',
                    'Vakum hortumu kontrol edilmeli',
                    'Arızalı regülatör değiştirilmeli',
                    'Enjektör performansını etkiler'
                ],
                estimatedCost: { min: 500, max: 1500 },
                laborTime: '1-2 saat',
                relatedComponents: ['yakit-pompasi', 'yakit-enjektoru']
            },
            {
                id: 'yakit-hortumu',
                name: 'Yakıt Hortumu/Borusu',
                slug: 'yakit-hortumu',
                description: 'Yakıtı taşıyan hortum ve borular.',
                function: 'Yakıtı depodan motora güvenli şekilde iletir.',
                symptoms: [
                    'Yakıt sızıntısı',
                    'Yakıt kokusu',
                    'Motor gücünde kayıp',
                    'Çatlamış hortumlar'
                ],
                repairAdvice: [
                    'Çatlak hortumlar hemen değiştirilmeli',
                    'Bağlantı kelepçeleri kontrol edilmeli',
                    'Yangın tehlikesi oluşturur',
                    'Orijinal kalitede hortum kullanılmalı'
                ],
                estimatedCost: { min: 200, max: 800 },
                laborTime: '1-2 saat',
                relatedComponents: ['yakit-pompasi', 'yakit-filtresi']
            },
            {
                id: 'yakit-kapagi',
                name: 'Yakıt Deposu Kapağı',
                slug: 'yakit-kapagi',
                description: 'Yakıt deposunu kapatan ve basıncı kontrol eden kapak.',
                function: 'Depoyu kapatır ve EVAP sisteminin basıncını korur.',
                symptoms: [
                    'Check engine lambası',
                    'EVAP kodu',
                    'Yakıt kokusu',
                    'Kapak gevşek veya kırık'
                ],
                repairAdvice: [
                    'Kapak sıkı kapatılmalı',
                    'Conta hasarlıysa değiştirilmeli',
                    'Ucuz ve kolay değişim',
                    'Emisyon testini etkiler'
                ],
                estimatedCost: { min: 150, max: 400 },
                laborTime: '5 dakika',
                relatedComponents: ['komur-filtre', 'canister-purge-valf']
            },
            {
                id: 'yakit-samandirasi',
                name: 'Yakıt Şamandırası',
                slug: 'yakit-samandirasi',
                description: 'Yakıt seviyesini ölçen sensör.',
                function: 'Depodaki yakıt miktarını göstergeye iletir.',
                symptoms: [
                    'Yakıt göstergesi çalışmıyor',
                    'Yanlış gösterim',
                    'Gösterge sabit kalıyor'
                ],
                repairAdvice: [
                    'Pompa ile birlikte olabilir',
                    'Elektrik bağlantıları kontrol edilmeli',
                    'Depo açılması gerekir'
                ],
                estimatedCost: { min: 600, max: 1800 },
                laborTime: '2-3 saat',
                relatedComponents: ['yakit-pompasi', 'yakit-deposu']
            }
                ]
            }
        ],
        components: []
    },
    {
        id: 'sogutma',
        name: 'Soğutma Sistemi',
        slug: 'sogutma-sistemi',
        description: 'Motorun aşırı ısınmasını önleyen sistem.',
        icon: 'cooling',
        color: 'cyan',
        subsystems: [
            {
                id: 'sogutma-bilesenleri',
                name: 'Soğutma Bileşenleri',
                slug: 'sogutma-bilesenleri',
                description: 'Soğutma sisteminin temel bileşenleri.',
                components: [
            {
                id: 'su-pompasi',
                name: 'Su Pompası',
                slug: 'su-pompasi',
                description: 'Soğutma sıvısını motor bloğunda dolaştıran pompa.',
                function: 'Soğutma sıvısını motor ve radyatör arasında dolaştırarak ısı transferi sağlar.',
                symptoms: [
                    'Motor aşırı ısınması',
                    'Soğutma sıvısı kaybı',
                    'Pompa bölgesinden sızıntı',
                    'Motordan hırıltı sesi',
                    'Isı göstergesinde yükselme'
                ],
                repairAdvice: [
                    'Su pompası genellikle 100.000 km\'de değiştirilmeli',
                    'Triger kayışı ile birlikte değiştirilmesi önerilir',
                    'Soğutma sıvısı da yenilenmelidir',
                    'Orijinal veya OES kalitesinde pompa kullanılmalı'
                ],
                estimatedCost: { min: 1500, max: 3500 },
                laborTime: '2-3 saat',
                relatedComponents: ['triger-kayisi', 'termostat', 'radyator']
            },
            {
                id: 'termostat',
                name: 'Termostat',
                slug: 'termostat',
                description: 'Motor sıcaklığını kontrol eden valf.',
                function: 'Soğutma sıvısının akışını düzenleyerek motorun optimal sıcaklıkta çalışmasını sağlar.',
                symptoms: [
                    'Motor yavaş ısınması',
                    'Motor aşırı ısınması',
                    'Kalorifer çalışmaması',
                    'Yakıt tüketiminde artış',
                    'Motor arızası lambası'
                ],
                repairAdvice: [
                    'Termostat genellikle 80.000-100.000 km\'de değiştirilmeli',
                    'Arızalı termostat motor hasarına yol açabilir',
                    'Soğutma sıvısı değişiminde kontrol edilmeli',
                    'Orijinal sıcaklık derecesinde termostat kullanılmalı'
                ],
                estimatedCost: { min: 400, max: 1200 },
                laborTime: '1-2 saat',
                relatedComponents: ['su-pompasi', 'radyator']
            },
                    {
                        id: 'klima-kontrol-modulu',
                        name: 'Klima Kontrol Modülü (AC/Heater Control Module)',
                        slug: 'klima-kontrol-modulu',
                        description: 'HVAC sisteminin beyni.',
                        function: 'Klima ve ısıtma sistemini kontrol eder.',
                        symptoms: ['Klima çalışmıyor', 'Isıtma çalışmıyor', 'Fan çalışmıyor'],
                        repairAdvice: ['Teşhis gerektirir', 'Pahalı parça'],
                        estimatedCost: { min: 2000, max: 5000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'klima-rolesi',
                        name: 'Klima Rölesi (A/C Relay)',
                        slug: 'klima-rolesi',
                        description: 'Klima kompresörünü kontrol eder.',
                        function: 'Kompresör devriyesini açıp kapatır.',
                        symptoms: ['Klima çalışmıyor', 'Kompresör çalışmıyor'],
                        repairAdvice: ['Ucuz parça', 'Kolay değişim'],
                        estimatedCost: { min: 100, max: 300 },
                        laborTime: '30 dakika'
                    },
                    {
                        id: 'klima-akumulatoru',
                        name: 'Klima Akümülatörü (A/C Accumulator/Receiver-Drier)',
                        slug: 'klima-akumulatoru',
                        description: 'Klima sisteminde nem tutar.',
                        function: 'Soğutucu gazdan nemi ve kirleri filtreler.',
                        symptoms: ['Klima soğutmuyor', 'Buzlanma'],
                        repairAdvice: ['Kompresör değişiminde yenilenmeli'],
                        estimatedCost: { min: 600, max: 1800 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'klima-kompresoru',
                        name: 'Klima Kompresörü (A/C Compressor)',
                        slug: 'klima-kompresoru',
                        description: 'Soğutucu gazı sıkıştırır.',
                        function: 'Soğutucu gazı basınçlandırarak soğutma sağlar.',
                        symptoms: ['Klima soğutmuyor', 'Gürültü', 'Kompresör çalışmıyor'],
                        repairAdvice: ['Çok pahalı', 'Sistem boşaltılmalı', 'Yağ eklenmeli'],
                        estimatedCost: { min: 4000, max: 12000 },
                        laborTime: '4-6 saat'
                    },
                    {
                        id: 'klima-kondenseri',
                        name: 'Klima Kondenseri (A/C Condenser)',
                        slug: 'klima-kondenseri',
                        description: 'Soğutucu gazı soğutur.',
                        function: 'Sıkıştırılmış gazı soğutarak sıvılaştırır.',
                        symptoms: ['Klima soğutmuyor', 'Hasar', 'Sızıntı'],
                        repairAdvice: ['Radyatör önünde bulunur', 'Taş hasarına açık'],
                        estimatedCost: { min: 2500, max: 6000 },
                        laborTime: '3-5 saat'
                    },
                    {
                        id: 'klima-kurutucusu',
                        name: 'Klima Kurutucusu (A/C Dryer)',
                        slug: 'klima-kurutucusu',
                        description: 'Sistemden nemi alır.',
                        function: 'Soğutucu gazdaki nemi tutar.',
                        symptoms: ['Klima soğutmuyor', 'Buzlanma'],
                        repairAdvice: ['Akümülatör ile aynı işlev'],
                        estimatedCost: { min: 600, max: 1800 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'klima-evaporatoru',
                        name: 'Klima Evaporatörü (A/C Evaporator)',
                        slug: 'klima-evaporatoru',
                        description: 'Kabini soğutur.',
                        function: 'Soğutucu gaz buharlaşarak havayı soğutur.',
                        symptoms: ['Klima soğutmuyor', 'Su sızıntısı', 'Koku'],
                        repairAdvice: ['Göğüs arkasında', 'Çok zor değişim', 'Çok pahalı'],
                        estimatedCost: { min: 5000, max: 15000 },
                        laborTime: '8-12 saat'
                    },
                    {
                        id: 'klima-hortumu',
                        name: 'Klima Hortumu (A/C Hose)',
                        slug: 'klima-hortumu',
                        description: 'Soğutucu gazı taşır.',
                        function: 'Yüksek basınçlı soğutucu gazı iletir.',
                        symptoms: ['Sızıntı', 'Klima soğutmuyor'],
                        repairAdvice: ['Sızıntı varsa değiştirilmeli'],
                        estimatedCost: { min: 800, max: 2500 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'klima-gazi',
                        name: 'Klima Gazı (A/C Refrigerant)',
                        slug: 'klima-gazi',
                        description: 'Soğutucu gaz (R134a/R1234yf).',
                        function: 'Soğutma sağlar.',
                        symptoms: ['Klima soğutmuyor', 'Gaz kaçağı'],
                        repairAdvice: ['Kaçak varsa önce tamir', 'Doğru tip kullanılmalı'],
                        estimatedCost: { min: 500, max: 1500 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'kabin-filtresi',
                        name: 'Kabin Filtresi (Cabin Air Filter)',
                        slug: 'kabin-filtresi',
                        description: 'Kabin havasını filtreler.',
                        function: 'Toz, polen ve kirleri tutar.',
                        symptoms: ['Kötü koku', 'Zayıf hava akışı', 'Buğulanma'],
                        repairAdvice: ['15.000-30.000 km\'de değiştirilmeli', 'Kolay değişim'],
                        estimatedCost: { min: 150, max: 500 },
                        laborTime: '15-30 dakika'
                    },
                    {
                        id: 'genlesme-valfi',
                        name: 'Genleşme Valfi (Expansion Valve)',
                        slug: 'genlesme-valfi',
                        description: 'Soğutucu gaz akışını kontrol eder.',
                        function: 'Evaporatöre giren gaz miktarını ayarlar.',
                        symptoms: ['Klima soğutmuyor', 'Buzlanma'],
                        repairAdvice: ['Tıkanma varsa değiştirilmeli'],
                        estimatedCost: { min: 800, max: 2000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'kalorifer-fan-motoru',
                        name: 'Kalorifer Fan Motoru (Heater Blower Motor)',
                        slug: 'kalorifer-fan-motoru',
                        description: 'Kabin fanını döndürür.',
                        function: 'Havayı kabine üfler.',
                        symptoms: ['Fan çalışmıyor', 'Gürültü', 'Sadece yüksek hızda çalışıyor'],
                        repairAdvice: ['Rezistans kontrol edilmeli'],
                        estimatedCost: { min: 1000, max: 3000 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'fan-rezistansi',
                        name: 'Fan Rezistansı (Heater Blower Motor Resistor)',
                        slug: 'fan-rezistansi',
                        description: 'Fan hızını kontrol eder.',
                        function: 'Fan hızlarını ayarlar.',
                        symptoms: ['Sadece yüksek hızda çalışıyor', 'Bazı hızlar çalışmıyor'],
                        repairAdvice: ['Ucuz parça', 'Kolay değişim'],
                        estimatedCost: { min: 300, max: 800 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'kalorifer-valf',
                        name: 'Kalorifer Valfi (Heater Control Valve)',
                        slug: 'kalorifer-valf',
                        description: 'Kalorifer sıcak su akışını kontrol eder.',
                        function: 'Kalorifer radyatörüne giden sıcak suyu ayarlar.',
                        symptoms: ['Isıtma çalışmıyor', 'Sürekli sıcak hava'],
                        repairAdvice: ['Vakum veya elektrikli olabilir'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'kalorifer-radyatoru',
                        name: 'Kalorifer Radyatörü (Heater Core)',
                        slug: 'kalorifer-radyatoru',
                        description: 'Kabini ısıtır.',
                        function: 'Motor soğutma suyundan ısı alarak kabini ısıtır.',
                        symptoms: ['Isıtma çalışmıyor', 'Sızıntı', 'Buğulanma', 'Tatlı koku'],
                        repairAdvice: ['Göğüs arkasında', 'Çok zor değişim', 'Pahalı işçilik'],
                        estimatedCost: { min: 3000, max: 10000 },
                        laborTime: '6-10 saat'
                    },
                    {
                        id: 'kalorifer-hortumu',
                        name: 'Kalorifer Hortumu (Heater Hose)',
                        slug: 'kalorifer-hortumu',
                        description: 'Kalorifer radyatörüne su taşır.',
                        function: 'Sıcak soğutma suyunu kalorifer radyatörüne iletir.',
                        symptoms: ['Sızıntı', 'Isıtma çalışmıyor', 'Aşırı ısınma'],
                        repairAdvice: ['Çatlak hortumlar değiştirilmeli'],
                        estimatedCost: { min: 200, max: 600 },
                        laborTime: '1-2 saat'
                    }
                
                ]
            }
        ],
        components: []
    },
    {
        id: 'egzoz',
        name: 'Egzoz Sistemi',
        slug: 'egzoz-sistemi',
        description: 'Yanma gazlarını dışarı atan ve emisyonları azaltan sistem.',
        icon: 'exhaust',
        color: 'gray',
        subsystems: [
            {
                id: 'egzoz-bilesenleri',
                name: 'Egzoz Bileşenleri',
                slug: 'egzoz-bilesenleri',
                description: 'Egzoz sisteminin temel bileşenleri.',
                components: [
            {
                id: 'katalitik-konvertor',
                name: 'Katalitik Konvertör',
                slug: 'katalitik-konvertor',
                description: 'Zararlı egzoz gazlarını temizleyen bileşen.',
                function: 'Egzoz gazlarındaki zararlı maddeleri kimyasal reaksiyonlarla zararsız hale getirir.',
                symptoms: [
                    'Motor gücünde kayıp',
                    'Yakıt tüketiminde artış',
                    'Egzozdan kötü koku',
                    'Motor arızası lambası',
                    'Egzozdan tıkırtı sesi'
                ],
                repairAdvice: [
                    'Katalitik konvertör genellikle 150.000+ km dayanır',
                    'Kalitesiz yakıt kullanımı ömrünü kısaltır',
                    'Motor arızaları katalizöre zarar verebilir',
                    'Değişim maliyeti yüksektir',
                    'Orijinal parça kullanımı önemlidir'
                ],
                estimatedCost: { min: 5000, max: 15000 },
                laborTime: '2-3 saat',
                relatedComponents: ['oksijen-sensoru', 'egzoz-manifoldu']
            },
                    {
                        id: 'hava-pompasi',
                        name: 'Hava Pompası (Air Pump)',
                        slug: 'hava-pompasi',
                        description: 'Emisyon kontrolü için hava pompalar.',
                        function: 'Egzoza hava pompalayarak emisyonları azaltır.',
                        symptoms: ['Check engine lambası', 'Gürültü', 'Emisyon testi başarısız'],
                        repairAdvice: ['Eski araçlarda bulunur', 'Arızalı pompa değiştirilmeli'],
                        estimatedCost: { min: 1500, max: 4000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'hava-pompasi-valf',
                        name: 'Hava Pompası Valfi (Air Pump Check Valve)',
                        slug: 'hava-pompasi-valf',
                        description: 'Hava pompası tek yönlü valfi.',
                        function: 'Egzoz gazlarının pompaya geri dönmesini önler.',
                        symptoms: ['Gürültü', 'Pompa arızası'],
                        repairAdvice: ['Pompa ile birlikte kontrol edilmeli'],
                        estimatedCost: { min: 300, max: 800 },
                        laborTime: '1 saat'
                    },
                    {
                        id: 'canister-purge-valf',
                        name: 'Canister Purge Valfi',
                        slug: 'canister-purge-valf',
                        description: 'Yakıt buharlarını motora gönderir.',
                        function: 'Kömür filtreden yakıt buharlarını emme manifolduna gönderir.',
                        symptoms: ['Check engine lambası', 'Rölanti problemi', 'Yakıt kokusu'],
                        repairAdvice: ['Elektrik bağlantıları kontrol edilmeli'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'canister-vent-valf',
                        name: 'Canister Vent Valfi',
                        slug: 'canister-vent-valf',
                        description: 'Kömür filtre havalandırma valfi.',
                        function: 'EVAP sisteminin hava girişini kontrol eder.',
                        symptoms: ['Check engine lambası', 'EVAP kodu'],
                        repairAdvice: ['EVAP sistemi teşhisi gerektirir'],
                        estimatedCost: { min: 300, max: 1000 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'komur-filtre',
                        name: 'Kömür Filtre (Charcoal Canister)',
                        slug: 'komur-filtre',
                        description: 'Yakıt buharlarını tutar.',
                        function: 'Yakıt deposundan gelen buharları aktif kömürle tutar.',
                        symptoms: ['Yakıt kokusu', 'Check engine lambası', 'EVAP kodu'],
                        repairAdvice: ['Nadir değiştirilir', 'Pahalı parça'],
                        estimatedCost: { min: 1000, max: 3000 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'egr-sogutucusu',
                        name: 'EGR Soğutucusu (EGR Cooler)',
                        slug: 'egr-sogutucusu',
                        description: 'EGR gazlarını soğutur.',
                        function: 'Geri dönen egzoz gazlarını soğutarak NOx emisyonunu azaltır.',
                        symptoms: ['Check engine lambası', 'Güç kaybı', 'Beyaz duman'],
                        repairAdvice: ['Tıkanma varsa temizlenmeli veya değiştirilmeli'],
                        estimatedCost: { min: 2000, max: 5000 },
                        laborTime: '3-5 saat'
                    },
                    {
                        id: 'egr-pozisyon-sensoru',
                        name: 'EGR Pozisyon Sensörü',
                        slug: 'egr-pozisyon-sensoru',
                        description: 'EGR valfinin pozisyonunu ölçer.',
                        function: 'EGR valfinin ne kadar açık olduğunu ECU\'ya bildirir.',
                        symptoms: ['Check engine lambası', 'Rölanti problemi'],
                        repairAdvice: ['Valf ile birlikte olabilir'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'egr-sicaklik-sensoru',
                        name: 'EGR Sıcaklık Sensörü',
                        slug: 'egr-sicaklik-sensoru',
                        description: 'EGR gazı sıcaklığını ölçer.',
                        function: 'Geri dönen egzoz gazı sıcaklığını izler.',
                        symptoms: ['Check engine lambası', 'Emisyon sorunu'],
                        repairAdvice: ['Nadir arızalanır'],
                        estimatedCost: { min: 300, max: 1000 },
                        laborTime: '1 saat'
                    },
                    {
                        id: 'egr-vakum-solenoid',
                        name: 'EGR Vakum Solenoidi',
                        slug: 'egr-vakum-solenoid',
                        description: 'EGR valfini vakumla kontrol eder.',
                        function: 'Eski araçlarda EGR valfine vakum uygular.',
                        symptoms: ['Check engine lambası', 'Rölanti problemi'],
                        repairAdvice: ['Vakum hortumları kontrol edilmeli'],
                        estimatedCost: { min: 300, max: 800 },
                        laborTime: '1 saat'
                    },
                    {
                        id: 'egr-valf-contasi',
                        name: 'EGR Valf Contası',
                        slug: 'egr-valf-contasi',
                        description: 'EGR valfinin contası.',
                        function: 'EGR valfinde sızdırmazlık sağlar.',
                        symptoms: ['Egzoz kaçağı', 'Hissing sesi'],
                        repairAdvice: ['Valf değişiminde yenilenmeli'],
                        estimatedCost: { min: 100, max: 300 },
                        laborTime: '1-2 saat (valf ile birlikte)'
                    },
                    {
                        id: 'egzoz-manifold-contasi',
                        name: 'Egzoz Manifold Contası',
                        slug: 'egzoz-manifold-contasi',
                        description: 'Egzoz manifoldu contası.',
                        function: 'Manifold ile silindir kapağı arasında sızdırmazlık sağlar.',
                        symptoms: ['Egzoz kaçağı', 'Ticking sesi', 'Gürültü'],
                        repairAdvice: ['Manifold sökülürken yenilenmeli'],
                        estimatedCost: { min: 200, max: 600 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'egzoz-boru',
                        name: 'Egzoz Borusu (Exhaust Down Pipe)',
                        slug: 'egzoz-boru',
                        description: 'Manifolddan katalitike giden boru.',
                        function: 'Egzoz gazlarını manifolddan katalitike iletir.',
                        symptoms: ['Gürültü', 'Egzoz kaçağı', 'Pas'],
                        repairAdvice: ['Paslanmış borular değiştirilmeli'],
                        estimatedCost: { min: 800, max: 2500 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'egzoz-kuyrugu',
                        name: 'Egzoz Kuyrugu (Exhaust Tailpipe)',
                        slug: 'egzoz-kuyrugu',
                        description: 'Egzoz çıkış borusu.',
                        function: 'Egzoz gazlarını araç dışına atar.',
                        symptoms: ['Pas', 'Düşme', 'Gürültü'],
                        repairAdvice: ['Estetik parça', 'Kolay değişim'],
                        estimatedCost: { min: 300, max: 1000 },
                        laborTime: '30 dakika - 1 saat'
                    },
                    {
                        id: 'evap-kacak-tespit-pompasi',
                        name: 'EVAP Kaçak Tespit Pompası',
                        slug: 'evap-kacak-tespit-pompasi',
                        description: 'EVAP sisteminde kaçak tespit eder.',
                        function: 'Yakıt sistemi kaçaklarını tespit eder.',
                        symptoms: ['Check engine lambası', 'EVAP kodu'],
                        repairAdvice: ['Teşhis için kullanılır'],
                        estimatedCost: { min: 800, max: 2000 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'yakit-deposu-basinc-sensoru',
                        name: 'Yakıt Deposu Basınç Sensörü',
                        slug: 'yakit-deposu-basinc-sensoru',
                        description: 'Depo basıncını ölçer.',
                        function: 'EVAP sistemi için depo basıncını izler.',
                        symptoms: ['Check engine lambası', 'EVAP kodu'],
                        repairAdvice: ['Depo üzerinde bulunur'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'susturucu',
                        name: 'Susturucu (Muffler)',
                        slug: 'susturucu',
                        description: 'Egzoz sesini azaltır.',
                        function: 'Egzoz gazlarının sesini kısarak sessiz çalışma sağlar.',
                        symptoms: ['Gürültü', 'Pas', 'Delik', 'Performans kaybı'],
                        repairAdvice: ['Paslanmış susturucu değiştirilmeli', 'Performans susturucuları mevcuttur'],
                        estimatedCost: { min: 800, max: 2500 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'rezonator',
                        name: 'Rezonatör (Resonator)',
                        slug: 'rezonator',
                        description: 'Egzoz sesini ayarlar.',
                        function: 'Belirli frekansları kısarak ses kalitesini iyileştirir.',
                        symptoms: ['Gürültü', 'Pas'],
                        repairAdvice: ['Opsiyonel parça', 'Ses kalitesi için önemli'],
                        estimatedCost: { min: 600, max: 2000 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'ikincil-hava-enjeksiyon',
                        name: 'İkincil Hava Enjeksiyon Sistemi',
                        slug: 'ikincil-hava-enjeksiyon',
                        description: 'Egzoza hava enjekte eder.',
                        function: 'Soğuk çalıştırmada emisyonları azaltmak için egzoza hava pompalar.',
                        symptoms: ['Check engine lambası', 'Gürültü', 'Emisyon testi başarısız'],
                        repairAdvice: ['Pompa ve valfler kontrol edilmeli'],
                        estimatedCost: { min: 2000, max: 5000 },
                        laborTime: '3-5 saat'
                    }
                
                
                ]
            }
        ],
        components: []
    },
    {
        id: 'iletim',
        name: 'İletim Sistemi (Şanzıman)',
        slug: 'iletim-sistemi',
        description: 'Motor gücünü tekerleklere ileten sistem.',
        icon: 'transmission',
        color: 'purple',
        subsystems: [
            {
                id: 'iletim-bilesenleri',
                name: 'İletim Bileşenleri',
                slug: 'iletim-bilesenleri',
                description: 'İletim sisteminin temel bileşenleri.',
                components: [
            {
                id: 'debriyaj',
                name: 'Debriyaj Seti',
                slug: 'debriyaj',
                description: 'Motor ile şanzıman arasındaki bağlantıyı sağlayan mekanizma.',
                function: 'Motor gücünü şanzımana iletir ve vites değişimlerinde bağlantıyı keser.',
                symptoms: [
                    'Debriyaj pedalında sertlik',
                    'Vites geçişlerinde zorluk',
                    'Debriyaj kayması',
                    'Yanık kokusu',
                    'Titreme ve gürültü'
                ],
                repairAdvice: [
                    'Debriyaj genellikle 100.000-150.000 km\'de değiştirilmeli',
                    'Volant ve baskı da kontrol edilmeli',
                    'Sürüş tarzı ömrü etkiler',
                    'Komple set değişimi önerilir',
                    'Hidrolik sistem de kontrol edilmeli'
                ],
                estimatedCost: { min: 3000, max: 8000 },
                laborTime: '4-6 saat',
                relatedComponents: ['volant', 'debriyaj-hidrolik']
            },
                    {
                        id: 'otomatik-sanziman-yagi',
                        name: 'Otomatik Şanzıman Yağı (ATF)',
                        slug: 'otomatik-sanziman-yagi',
                        description: 'Otomatik şanzıman sıvısı.',
                        function: 'Şanzımanı yağlar, soğutur ve hidrolik basınç sağlar.',
                        symptoms: ['Kirli yağ', 'Yanık koku', 'Vites geçiş sorunu'],
                        repairAdvice: ['60.000-100.000 km\'de değiştirilmeli', 'Doğru tip kullanılmalı'],
                        estimatedCost: { min: 500, max: 1500 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'aks-grubu',
                        name: 'Aks Grubu (CV Half Shaft Assembly)',
                        slug: 'aks-grubu',
                        description: 'Sabit hızlı aks mili.',
                        function: 'Gücü şanzımandan tekerleklere iletir.',
                        symptoms: ['Tıklama sesi', 'Titreşim', 'Körük yırtık'],
                        repairAdvice: ['Körük yırtılmışsa aks değiştirilmeli'],
                        estimatedCost: { min: 1500, max: 4000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'debriyaj',
                        name: 'Debriyaj (Clutch)',
                        slug: 'debriyaj',
                        description: 'Manuel şanzıman debriyaj sistemi.',
                        function: 'Motor gücünü şanzımana bağlar/ayırır.',
                        symptoms: ['Kayma', 'Sert pedal', 'Titreşim', 'Gürültü'],
                        repairAdvice: ['Disk, baskı, rulman birlikte değiştirilmeli'],
                        estimatedCost: { min: 3000, max: 8000 },
                        laborTime: '4-8 saat'
                    },
                    {
                        id: 'debriyaj-kablosu',
                        name: 'Debriyaj Kablosu (Clutch Cable)',
                        slug: 'debriyaj-kablosu',
                        description: 'Debriyaj pedalını bağlar.',
                        function: 'Pedal hareketini debriyaja iletir.',
                        symptoms: ['Kopuk kablo', 'Sert pedal', 'Pedal çalışmıyor'],
                        repairAdvice: ['Kopuksa değiştirilmeli', 'Ayar yapılmalı'],
                        estimatedCost: { min: 300, max: 800 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'debriyaj-diski',
                        name: 'Debriyaj Diski (Clutch Disc)',
                        slug: 'debriyaj-diski',
                        description: 'Debriyaj sürtünme diski.',
                        function: 'Motor gücünü şanzımana iletir.',
                        symptoms: ['Kayma', 'Yanık koku', 'Güç iletmiyor'],
                        repairAdvice: ['Baskı ile birlikte değiştirilmeli'],
                        estimatedCost: { min: 1500, max: 4000 },
                        laborTime: '4-8 saat'
                    },
                    {
                        id: 'debriyaj-ana-merkez',
                        name: 'Debriyaj Ana Merkezi (Clutch Master Cylinder)',
                        slug: 'debriyaj-ana-merkez',
                        description: 'Hidrolik debriyaj pompası.',
                        function: 'Pedal basıncını hidrolik basınca çevirir.',
                        symptoms: ['Yumuşak pedal', 'Sızıntı', 'Pedal yere gidiyor'],
                        repairAdvice: ['Sızıntı varsa değiştirilmeli'],
                        estimatedCost: { min: 600, max: 1800 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'debriyaj-pilot-rulman',
                        name: 'Debriyaj Pilot Rulmanı',
                        slug: 'debriyaj-pilot-rulman',
                        description: 'Giriş mili rulmanı.',
                        function: 'Giriş milini destekler.',
                        symptoms: ['Gürültü', 'Pedal basılıyken ses'],
                        repairAdvice: ['Debriyaj değişiminde yenilenmeli'],
                        estimatedCost: { min: 200, max: 600 },
                        laborTime: '4-8 saat (debriyaj ile birlikte)'
                    },
                    {
                        id: 'debriyaj-baski',
                        name: 'Debriyaj Baskısı (Clutch Pressure Plate)',
                        slug: 'debriyaj-baski',
                        description: 'Debriyaj baskı plakası.',
                        function: 'Diski volana bastırır.',
                        symptoms: ['Kayma', 'Titreşim', 'Sert pedal'],
                        repairAdvice: ['Disk ile birlikte değiştirilmeli'],
                        estimatedCost: { min: 1000, max: 3000 },
                        laborTime: '4-8 saat'
                    },
                    {
                        id: 'debriyaj-rulman',
                        name: 'Debriyaj Rulmanı (Clutch Release Bearing)',
                        slug: 'debriyaj-rulman',
                        description: 'Debriyaj ayırma rulmanı.',
                        function: 'Baskıyı iter/çeker.',
                        symptoms: ['Gürültü', 'Pedal basılıyken ses'],
                        repairAdvice: ['Debriyaj seti ile birlikte değiştirilmeli'],
                        estimatedCost: { min: 300, max: 800 },
                        laborTime: '4-8 saat (debriyaj ile birlikte)'
                    },
                    {
                        id: 'debriyaj-guvenlik-anahtari',
                        name: 'Debriyaj Güvenlik Anahtarı',
                        slug: 'debriyaj-guvenlik-anahtari',
                        description: 'Debriyaj pedal anahtarı.',
                        function: 'Debriyaj basılmadan marş çalışmasını engeller.',
                        symptoms: ['Marş çalışmıyor', 'Cruise control sorunu'],
                        repairAdvice: ['Ucuz parça', 'Kolay değişim'],
                        estimatedCost: { min: 100, max: 300 },
                        laborTime: '30 dakika'
                    },
                    {
                        id: 'debriyaj-pompa-merkez',
                        name: 'Debriyaj Pompa Merkezi (Clutch Slave Cylinder)',
                        slug: 'debriyaj-pompa-merkez',
                        description: 'Hidrolik debriyaj kölesi.',
                        function: 'Hidrolik basıncı debriyaja iletir.',
                        symptoms: ['Yumuşak pedal', 'Sızıntı'],
                        repairAdvice: ['Ana merkez ile birlikte kontrol edilmeli'],
                        estimatedCost: { min: 500, max: 1500 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'diferansiyel',
                        name: 'Diferansiyel (Differential)',
                        slug: 'diferansiyel',
                        description: 'Arka/ön diferansiyel.',
                        function: 'Gücü tekerleklere dağıtır ve virajlarda hız farkı sağlar.',
                        symptoms: ['Gürültü', 'Titreşim', 'Yağ sızıntısı'],
                        repairAdvice: ['Çok pahalı onarım', 'Yağ düzenli değiştirilmeli'],
                        estimatedCost: { min: 5000, max: 15000 },
                        laborTime: '6-12 saat'
                    },
                    {
                        id: 'karden-mili',
                        name: 'Karden Mili (Drive Shaft)',
                        slug: 'karden-mili',
                        description: 'Tahrik mili.',
                        function: 'Gücü şanzımandan diferansiyele iletir.',
                        symptoms: ['Titreşim', 'Gürültü', 'Tıklama'],
                        repairAdvice: ['Balans kontrol edilmeli', 'Mafsallar kontrol edilmeli'],
                        estimatedCost: { min: 2000, max: 5000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'vites-pozisyon-sensoru',
                        name: 'Vites Pozisyon Sensörü',
                        slug: 'vites-pozisyon-sensoru',
                        description: 'Şanzıman pozisyon sensörü.',
                        function: 'Hangi viteste olduğunu ECU\'ya bildirir.',
                        symptoms: ['Check engine lambası', 'Vites göstergesi yanlış'],
                        repairAdvice: ['Ayar veya değişim gerekebilir'],
                        estimatedCost: { min: 400, max: 1200 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'sanziman-yagi',
                        name: 'Şanzıman Yağı (Gearbox Oil)',
                        slug: 'sanziman-yagi',
                        description: 'Dişli kutusu yağı.',
                        function: 'Dişlileri yağlar.',
                        symptoms: ['Gürültü', 'Zor vites', 'Sızıntı'],
                        repairAdvice: ['Düzenli değiştirilmeli', 'Doğru viskozite önemli'],
                        estimatedCost: { min: 300, max: 1000 },
                        laborTime: '1-2 saat'
                    },
                    {
                        id: 'manuel-sanziman-yagi',
                        name: 'Manuel Şanzıman Yağı',
                        slug: 'manuel-sanziman-yagi',
                        description: 'Manuel vites kutusu yağı.',
                        function: 'Manuel şanzımanı yağlar.',
                        symptoms: ['Gürültü', 'Zor vites'],
                        repairAdvice: ['60.000-100.000 km\'de değiştirilmeli'],
                        estimatedCost: { min: 300, max: 800 },
                        laborTime: '1 saat'
                    },
                    {
                        id: 'pcm-modulu',
                        name: 'PCM Modülü (Powertrain Control Module)',
                        slug: 'pcm-modulu',
                        description: 'Motor ve şanzıman kontrol ünitesi.',
                        function: 'Motor ve şanzımanı birlikte kontrol eder.',
                        symptoms: ['Check engine lambası', 'Vites geçiş sorunu', 'Performans kaybı'],
                        repairAdvice: ['Çok pahalı', 'Teşhis gerektirir'],
                        estimatedCost: { min: 8000, max: 20000 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'vites-solenoidi',
                        name: 'Vites Solenoidi (Shift Solenoid)',
                        slug: 'vites-solenoidi',
                        description: 'Otomatik şanzıman vites solenoidi.',
                        function: 'Vitesleri değiştirir.',
                        symptoms: ['Vites geçiş sorunu', 'Check engine lambası', 'Sert vites'],
                        repairAdvice: ['Şanzıman açılmalı', 'Pahalı işçilik'],
                        estimatedCost: { min: 2000, max: 5000 },
                        laborTime: '4-8 saat'
                    },
                    {
                        id: 'tork-konvertor',
                        name: 'Tork Konvertör (Torque Converter)',
                        slug: 'tork-konvertor',
                        description: 'Otomatik şanzıman hidrolik kavrama.',
                        function: 'Motor gücünü hidrolik olarak şanzımana iletir.',
                        symptoms: ['Titreşim', 'Kayma', 'Aşırı ısınma', 'Gürültü'],
                        repairAdvice: ['Çok pahalı', 'Şanzıman sökülmeli'],
                        estimatedCost: { min: 5000, max: 15000 },
                        laborTime: '8-12 saat'
                    },
                    {
                        id: 'transaks',
                        name: 'Transaks (Transaxle)',
                        slug: 'transaks',
                        description: 'Şanzıman ve diferansiyel birlikte.',
                        function: 'Önden çekişli araçlarda şanzıman ve diferansiyel tek ünitede.',
                        symptoms: ['Gürültü', 'Vites sorunu', 'Sızıntı'],
                        repairAdvice: ['Çok pahalı onarım'],
                        estimatedCost: { min: 10000, max: 30000 },
                        laborTime: '10-20 saat'
                    },
                    {
                        id: 'transfer-kutusu',
                        name: 'Transfer Kutusu (Transfer Case)',
                        slug: 'transfer-kutusu',
                        description: '4x4 sisteminde güç dağıtım kutusu.',
                        function: 'Gücü ön ve arka akslara dağıtır.',
                        symptoms: ['Gürültü', '4x4 çalışmıyor', 'Sızıntı'],
                        repairAdvice: ['Yağ düzenli değiştirilmeli'],
                        estimatedCost: { min: 4000, max: 12000 },
                        laborTime: '6-10 saat'
                    },
                    {
                        id: 'sanziman-sogutucusu',
                        name: 'Şanzıman Soğutucusu (Transmission Cooler)',
                        slug: 'sanziman-sogutucusu',
                        description: 'Şanzıman yağı soğutucusu.',
                        function: 'Şanzıman yağını soğutur.',
                        symptoms: ['Aşırı ısınma', 'Sızıntı', 'Yanık yağ'],
                        repairAdvice: ['Römork çeken araçlarda önemli'],
                        estimatedCost: { min: 1000, max: 3000 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'sanziman-karter-contasi',
                        name: 'Şanzıman Karter Contası',
                        slug: 'sanziman-karter-contasi',
                        description: 'Şanzıman alt karter contası.',
                        function: 'Yağ sızıntısını önler.',
                        symptoms: ['Yağ sızıntısı'],
                        repairAdvice: ['Yağ değişiminde kontrol edilmeli'],
                        estimatedCost: { min: 300, max: 800 },
                        laborTime: '2-3 saat'
                    },
                    {
                        id: 'sanziman-pompasi',
                        name: 'Şanzıman Pompası (Transmission Pump)',
                        slug: 'sanziman-pompasi',
                        description: 'Otomatik şanzıman yağ pompası.',
                        function: 'Şanzıman yağını basınçlandırır.',
                        symptoms: ['Vites geçiş sorunu', 'Gürültü', 'Kayma'],
                        repairAdvice: ['Şanzıman açılmalı', 'Çok pahalı'],
                        estimatedCost: { min: 4000, max: 10000 },
                        laborTime: '8-12 saat'
                    },
                    {
                        id: 'sanziman-arka-kece',
                        name: 'Şanzıman Arka Keçe',
                        slug: 'sanziman-arka-kece',
                        description: 'Şanzıman çıkış mili keçesi.',
                        function: 'Çıkış milinden yağ sızıntısını önler.',
                        symptoms: ['Yağ sızıntısı', 'Karden altında yağ'],
                        repairAdvice: ['Karden sökülmeli'],
                        estimatedCost: { min: 600, max: 1800 },
                        laborTime: '2-4 saat'
                    },
                    {
                        id: 'universal-mafsal',
                        name: 'Universal Mafsal (Universal Joint)',
                        slug: 'universal-mafsal',
                        description: 'Karden mili mafsalı.',
                        function: 'Kardenin açılı hareketini sağlar.',
                        symptoms: ['Tıklama', 'Titreşim', 'Gürültü'],
                        repairAdvice: ['Oynak mafsallar değiştirilmeli'],
                        estimatedCost: { min: 600, max: 1800 },
                        laborTime: '2-3 saat'
                    }
                
                ]
            }
        ],
        components: []
    }
];

export function getSystemBySlug(slug: string): EncyclopediaSystem | undefined {
    return encyclopediaSystems.find(system => system.slug === slug);
}

export function getSubsystemBySlug(systemSlug: string, subsystemSlug: string): EncyclopediaSubsystem | undefined {
    const system = getSystemBySlug(systemSlug);
    if (!system || !system.subsystems) return undefined;
    return system.subsystems.filter(sub => sub !== undefined).find(subsystem => subsystem.slug === subsystemSlug);
}

export function getComponentBySlug(systemSlug: string, componentSlug: string, subsystemSlug?: string): EncyclopediaComponent | undefined {
    const system = getSystemBySlug(systemSlug);
    if (!system) return undefined;
    
    // If subsystem slug is provided, search in that specific subsystem
    if (subsystemSlug && system.subsystems) {
        const subsystem = system.subsystems.filter(sub => sub !== undefined).find(sub => sub.slug === subsystemSlug);
        return subsystem?.components.find(component => component.slug === componentSlug);
    }
    
    // First, try to find in direct components
    const directComponent = system.components?.find(component => component.slug === componentSlug);
    if (directComponent) return directComponent;
    
    // If not found in direct components, search in all subsystems
    if (system.subsystems) {
        for (const subsystem of system.subsystems) {
            if (subsystem && subsystem.components) {
                const component = subsystem.components.find(c => c.slug === componentSlug);
                if (component) return component;
            }
        }
    }
    
    return undefined;
}

export function getAllSystems(): EncyclopediaSystem[] {
    return encyclopediaSystems;
}

export function searchEncyclopedia(query: string): { system: EncyclopediaSystem; component: EncyclopediaComponent; subsystem?: EncyclopediaSubsystem }[] {
    const results: { system: EncyclopediaSystem; component: EncyclopediaComponent; subsystem?: EncyclopediaSubsystem }[] = [];
    const lowerQuery = query.toLowerCase();

    encyclopediaSystems.forEach(system => {
        // Search in subsystems if they exist
        if (system.subsystems) {
            system.subsystems.forEach(subsystem => {
                subsystem.components.forEach(component => {
                    if (
                        component.name.toLowerCase().includes(lowerQuery) ||
                        component.description.toLowerCase().includes(lowerQuery) ||
                        component.symptoms.some(s => s.toLowerCase().includes(lowerQuery))
                    ) {
                        results.push({ system, component, subsystem });
                    }
                });
            });
        }
        
        // Search in direct components
        system.components.forEach(component => {
            if (
                component.name.toLowerCase().includes(lowerQuery) ||
                component.description.toLowerCase().includes(lowerQuery) ||
                component.symptoms.some(s => s.toLowerCase().includes(lowerQuery))
            ) {
                results.push({ system, component });
            }
        });
    });

    return results;
}
