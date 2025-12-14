
export interface ReliabilityData {
    brand: string;
    score: number; // 0-5
    ranking: number;
    description: string;
    pros: string[];
    cons: string[];
    commonIssues: string[];
    turkishMarketConsensus: string; // "Sanayi ustalarının yorumu"
    logo: string;
}


const getLogoUrl = (brand: string) => {
    const slug = brand.toLowerCase().replace(/\s+/g, '-');
    
    // PNG exceptions
    if (slug === 'chery' || slug === 'land-rover') {
        return `/assets/brands/${slug}.png`;
    }
    
    return `/assets/brands/${slug}.svg`;
}


export const reliabilityData: ReliabilityData[] = [
    {
        brand: 'Lexus',
        score: 4.9,
        ranking: 1,
        description: "Toyota'nın lüks markası, dünyada olduğu gibi Türkiye'de de 'bozulmayan otomobil' unvanını korur. Nadir bulunur ama alan vazgeçemez.",
        pros: ["Kusursuz işçilik", "Arıza yapmayan hibrit sistem", "Sessizlik"],
        cons: ["İkinci el piyasası yavaş", "Yetkili servis ağı sınırlı"],
        commonIssues: ["Bilgi-eğlence sistemi arayüzü (eski modeller)", "Fren balatası ömrü (ağırlıktan dolayı)"],
        turkishMarketConsensus: "Bilenin aldığı, alanın satmadığı, sanayi yüzü görmeyen araba.",
        logo: getLogoUrl('Lexus')
    },
    {
        brand: 'Toyota',
        score: 4.8,
        ranking: 2,
        description: "Türkiye'de 'sorunsuzluk' dendiğinde akla gelen ilk marka. Corolla ve Hilux modelleri dayanıklılık efsanesidir.",
        pros: ["Mükemmel motor ömrü", "Yüksek ikinci el değeri", "LPG uyumu"],
        cons: ["Sıkıcı sürüş dinamiği", "Yalıtım zayıflığı"],
        commonIssues: ["Dizel partikül filtresi (şehir içi)", "Baskı balata (Mmt şanzıman)"],
        turkishMarketConsensus: "Sanayi ustaları 'Toyota alan sanayiyi unutur' der. Altın gibidir, değer kaybetmez.",
        logo: getLogoUrl('Toyota')
    },
    {
        brand: 'Honda',
        score: 4.8,
        ranking: 3,
        description: "Motor teknolojisi konusunda mühendislik harikasıdır. Civic, Türkiye yollarının vazgeçilmezidir.",
        pros: ["VTEC motor dayanıklılığı", "LPG uyumu", "Sürüş hissi"],
        cons: ["Yol sesi (yalıtım)", "Kaporta sacı inceliği"],
        commonIssues: ["Direksiyon kutusu sesi", "CVT şanzıman ısınması (zorlandığında)"],
        turkishMarketConsensus: "Japon'un genci bozulmazı. 'Honda hayat onda' sözü boşa değildir.",
        logo: getLogoUrl('Honda')
    },
    {
        brand: 'Mazda',
        score: 4.7,
        ranking: 4,
        description: "Mekanik olarak dünyanın en sağlam otomobillerinden. Skyactiv teknolojisi ile sorunsuzluğu zirveye taşıdı.",
        pros: ["Sorunsuz motorlar", "Premium iç mekan", "Tasarım"],
        cons: ["Yedek parça pahalılığı", "İkinci el yavaş"],
        commonIssues: ["Ayna katlama motoru", "İnce boya"],
        turkishMarketConsensus: "Evladiyelik araba. Parçası pahalı ama bozulmadığı için parça lazım olmaz.",
        logo: getLogoUrl('Mazda')
    },
    {
        brand: 'Subaru',
        score: 4.6,
        ranking: 5,
        description: "Simetrik 4 çeker sistemi ve Boxer motoruyla ünlüdür. Çok sağlam şasi ve mekaniğe sahiptir.",
        pros: ["Mükemmel 4 çeker (AWD)", "Güvenlik (EyeSight)", "Mekanik sağlamlık"],
        cons: ["Yüksek yakıt tüketimi", "Usta bulma zorluğu"],
        commonIssues: ["Yağ eksiltme (bazı modeller)", "CVT şanzıman sesi"],
        turkishMarketConsensus: "Karda kışta yolda bırakmaz. Ancak ustasını bulmak gerekir.",
        logo: getLogoUrl('Subaru')
    },
    {
        brand: 'Suzuki',
        score: 4.6,
        ranking: 6,
        description: "Motosiklet genlerinden gelen yüksek devire dayanıklı, basit ve bozulmayan motorlar üretir.",
        pros: ["Sorunsuz AllGrip 4x4", "Basit ve sağlam mekanik", "Ekonomik"],
        cons: ["Basit iç mekan malzemesi", "Yalıtım"],
        commonIssues: ["Trim sesleri", "Multimedya sistemi yavaşlığı"],
        turkishMarketConsensus: "Dağ keçisi gibi, vur taşa git. Şehiriçi için ideal sorunsuzlukta.",
        logo: getLogoUrl('Suzuki')
    },
    {
        brand: 'Hyundai',
        score: 4.5,
        ranking: 7,
        description: "Fiyat/performans ve dayanıklılık dengesini en iyi kuran markalardan. Parçası bol ve ucuzdur.",
        pros: ["Bol yedek parça", "Yaygın servis", "Zengin donanım"],
        cons: ["Yakıt tüketimi (bazı benzinliler)", "Yol tutuş"],
        commonIssues: ["Direksiyon soyulması", "EPS (Direksiyon) sesleri"],
        turkishMarketConsensus: "Taksicilerin tercihi. Koreliler Japonları yakaladı, hatta geçti.",
        logo: getLogoUrl('Hyundai')
    },
    {
        brand: 'Kia',
        score: 4.5,
        ranking: 8,
        description: "Hyundai ile aynı altyapıyı kullanır ancak tasarımı daha Avrupai'dir. Mekanik olarak çok sağlamdır.",
        pros: ["Tasarım", "Sorunsuz motor/şanzıman", "Garanti süresi"],
        cons: ["İkinci el (bazı modeller)", "Sert süspansiyon"],
        commonIssues: ["Dizel partikül filtresi", "Plastik aksam sesleri"],
        turkishMarketConsensus: "Hyundai'nin yakışıklı kardeşi. Sağlamdır, üzmez.",
        logo: getLogoUrl('Kia')
    },
    {
        brand: 'Volvo',
        score: 4.3,
        ranking: 9,
        description: "Güvenlik dendiğinde akla gelen marka. Kasaları tank gibidir ancak yeni modellerde elektronik karmaşa artmıştır.",
        pros: ["Efsanevi güvenlik", "Koltuk konforu", "Sağlam şasi"],
        cons: ["Yüksek parça maliyeti", "Elektronik arızalar"],
        commonIssues: ["Yazılım güncellemeleri", "Sensör arızaları", "Ağır kasa nedeniyle fren aşınması"],
        turkishMarketConsensus: "Canınızı emanet edersiniz ama cüzdanınızı biraz hafifletir.",
        logo: getLogoUrl('Volvo')
    },
    {
        brand: 'Mercedes-Benz',
        score: 4.2,
        ranking: 10,
        description: "Prestij ve konforun simgesi. Motor mekaniği çok sağlamdır ancak elektronik donanım arttıkça arıza riski de artmıştır.",
        pros: ["Prestij", "Konfor", "Motor ömrü"],
        cons: ["Çok yüksek bakım maliyeti", "Karmaşık elektronikler"],
        commonIssues: ["AdBlue sistemi", "Multimedya ekranı", "Sensör hataları"],
        turkishMarketConsensus: "Yıldızı yeter. Eskisi toruna miras kalır, yenisi servisten çıkmaz.",
        logo: getLogoUrl('Mercedes-Benz')
    },
    {
        brand: 'Skoda',
        score: 4.2,
        ranking: 11,
        description: "Volkswagen kalitesini daha akılcı fiyatla sunar. Geniş iç hacmi ve pratik çözümleriyle ailelerin favorisidir.",
        pros: ["Geniş iç hacim", "VW teknolojisi", "Pratik çözümler"],
        cons: ["DSG şanzıman riski", "Bazı modellerde yalıtım"],
        commonIssues: ["DSG mekatronik", "Su pompası", "Start-stop hatası"],
        turkishMarketConsensus: "VW'nin aynısı, sadece logosu farklı. Tam bir aile arabası.",
        logo: getLogoUrl('Skoda')
    },
    {
        brand: 'Fiat',
        score: 4.1,
        ranking: 12,
        description: "Türkiye'nin en çok satan markası. Multijet motoru efsanevi dayanıklılıktadır, parçası çok ucuzdur.",
        pros: ["Ölümsüz Multijet motor", "Sudan ucuz parça", "Hızlı piyasa"],
        cons: ["Malzeme kalitesi", "Konfor"],
        commonIssues: ["Amortisör takoz sesleri", "City modu (direksiyon)", "Trim sesleri"],
        turkishMarketConsensus: "Parçası bakkalda bulunur. Vur kır, yaptır devam et.",
        logo: getLogoUrl('Fiat')
    },
    {
        brand: 'Renault',
        score: 4.1,
        ranking: 13,
        description: "1.5 dCi motoruyla tarih yazmıştır. Türkiye şartlarına en uygun süspansiyon ve servis ağına sahiptir.",
        pros: ["Motor dayanıklılığı", "Yakıt ekonomisi", "Konforlu süspansiyon"],
        cons: ["Elektronik beyin arızaları", "İç mekan kalitesi"],
        commonIssues: ["Kartlı anahtar", "Enjektörler", "EDC şanzıman beyni"],
        turkishMarketConsensus: "Sanayinin ekmek teknesi. Motoru on numara, elektroniği piyango.",
        logo: getLogoUrl('Renault')
    },
    {
        brand: 'Volkswagen',
        score: 4.0,
        ranking: 14,
        description: "Türkiye'de 'kalite' algısını belirleyen markadır. Tok kapı sesi meşhurdur ancak DSG şanzıman dikkat ister.",
        pros: ["Kalite hissi", "Performans", "İkinci el değeri"],
        cons: ["DSG arıza riski", "Yüksek servis ücretleri"],
        commonIssues: ["DSG kavrama/mekatronik", "Yağ eksiltme (TSI)", "Devirdaim"],
        turkishMarketConsensus: "Piyasanın altını. Konforu, sürüşü harika ama DSG pimi çekilmiş bomba.",
        logo: getLogoUrl('Volkswagen')
    },
    {
        brand: 'Seat',
        score: 4.0,
        ranking: 15,
        description: "VW grubunun sportif yüzü. Gençlerin favorisidir, Leon modeli piyasada çok tutulur.",
        pros: ["Tasarım", "Performans", "VW altyapısı"],
        cons: ["Sert süspansiyon", "İç mekanda trim sesleri"],
        commonIssues: ["DSG şanzıman", "Sunroof sesleri", "Led far nemlenmesi"],
        turkishMarketConsensus: "VW'nin genci. Şekli yeter, motoru Alman.",
        logo: getLogoUrl('Seat')
    },
    {
        brand: 'Ford',
        score: 3.9,
        ranking: 16,
        description: "Yol tutuşun ustasıdır. Ticari araçları çok sağlamdır, binek araçlarda eski otomatik şanzımanları sorunluydu.",
        pros: ["Mükemmel yol tutuş", "Sağlam şasi", "Güvenlik"],
        cons: ["Powershift şanzıman (eski)", "Yakıt tüketimi"],
        commonIssues: ["Şanzıman titremesi", "Hortum çatlakları", "Direksiyon kutusu"],
        turkishMarketConsensus: "Yola zamk gibi yapışır. Esenyurt kasa değilse alınır.",
        logo: getLogoUrl('Ford')
    },
    {
        brand: 'Opel',
        score: 3.8,
        ranking: 17,
        description: "Almanların sağlamcı markasıydı, şimdi PSA (Peugeot) grubu çatısı altında. Eski modelleri sağlam ama ağır kasalıdır.",
        pros: ["Tok sürüş", "Stabilite", "Donanım"],
        cons: ["Elektronik sensör arızaları", "Ağır kasa/yakıt"],
        commonIssues: ["Bobin arızası", "Yağ soğutucu patlatma", "Subap erimesi (LPG)"],
        turkishMarketConsensus: "Eskisi yağ yakar, yenisi beyin yakar. Ama yolda gidişi tank gibidir.",
        logo: getLogoUrl('Opel')
    },
    {
        brand: 'Audi',
        score: 3.8,
        ranking: 18,
        description: "Premium kalitenin teknolojik yüzü. İç mekan kalitesi çok yüksektir anca bakım maliyetleri de zirvededir.",
        pros: ["Mükemmel iç mekan", "Quattro sistemi", "Tasarım"],
        cons: ["Aşırı pahalı parçalar", "Karmaşık motor arızaları"],
        commonIssues: ["Yağ yakma (TFSI)", "Şanzıman (S-Tronic)", "Elektronik beyinler"],
        turkishMarketConsensus: "Zenginin oyuncağı. Sanayiye düşerse ocağa incir ağacı diker.",
        logo: getLogoUrl('Audi')
    },
    {
        brand: 'BMW',
        score: 3.7,
        ranking: 19,
        description: "Sürüş keyfi makinesi. Narin bir yapısı vardır, bakımsızlığa hiç gelmez. Hor kullanılmışı çoktur.",
        pros: ["Sürüş zevki", "Performans", "Prestij"],
        cons: ["Hassas soğutma sistemi", "Yağ kaçakları"],
        commonIssues: ["Zincir sesi", "Vanos", "Su hortumları"],
        turkishMarketConsensus: "Yanlamamış, temizini bulana aşk olsun. Sanayicinin en sevdiği müşteri.",
        logo: getLogoUrl('BMW')
    },
    {
        brand: 'Nissan',
        score: 3.7,
        ranking: 20,
        description: "Japon kökenli olsa da Renault ortaklığı sonrası karakter değiştirdi. Qashqai ile SUV pazarını domine etti.",
        pros: ["Qashqai piyasası", "Konfor", "Motor (dCi)"],
        cons: ["CVT şanzıman ömrü", "İç mekan soyulmaları"],
        commonIssues: ["CVT titreme/arıza", "Turbo hortumu", "Trim sesleri"],
        turkishMarketConsensus: "Japon görünümlü Fransız. Qashqai peynir ekmek gibi satar.",
        logo: getLogoUrl('Nissan')
    },
    {
        brand: 'Peugeot',
        score: 3.7,
        ranking: 21,
        description: "Son dönemde tasarımlarıyla çağ atladı. Eski sorunlu imajını, yeni EAT8 şanzımanlı modelleriyle siliyor.",
        pros: ["Harika tasarım", "EAT8 sorunsuz şanzıman", "Düşük tüketim"],
        cons: ["AdBlue sistemi", "Küçük direksiyon alışkanlığı"],
        commonIssues: ["AdBlue deposu", "Multimedya donması", "Elektronik uyarılar"],
        turkishMarketConsensus: "Eskiden 'uzak dur' denirdi, şimdi 'tasarımı için alınır' deniyor.",
        logo: getLogoUrl('Peugeot')
    },
    {
        brand: 'Citroen',
        score: 3.6,
        ranking: 22,
        description: "Konfor odaklı Fransız. Süspansiyonları çok rahattır ama elektronik aksamı bazen sürpriz yapabilir.",
        pros: ["Konfor", "Farklı tasarım", "Ekonomi"],
        cons: ["Değer kaybı", "Narin elektronik"],
        commonIssues: ["Amortisör sesleri", "AdBlue arızası", "Sensör hataları"],
        turkishMarketConsensus: "Yaylanan araba. Konforlu ama satarken bekletir.",
        logo: getLogoUrl('Citroen')
    },
    {
        brand: 'Dacia',
        score: 3.6,
        ranking: 23,
        description: "Gereksiz her şeyden arındırılmış, yürüyen aksamı sağlam araçlar. Konfor yok ama yolda kalmaz.",
        pros: ["Çok ucuz bakım", "Sağlam Renault motorları", "Arazi yeteneği (Duster)"],
        cons: ["Sıfır konfor", "Güvenlik zayıflığı", "Yalıtım yok"],
        commonIssues: ["Klima kompresörü", "Egr valfi", "Duman atma"],
        turkishMarketConsensus: "Dağ bayır gez, banamısın demez. Teneke ama yürür.",
        logo: getLogoUrl('Dacia')
    },
    {
        brand: 'Chevrolet',
        score: 3.5,
        ranking: 24,
        description: "Avrupa'dan çekilse de Cruze ve Aveo modelleri hala çok yaygın. Parçası Opel ile uyumlu.",
        pros: ["Uygun fiyat", "Şık tasarım(Cruze)", "Parça uyumu (Opel)"],
        cons: ["Ağır kasa", "Yüksek yakıt", "Kronik subap sorunu"],
        commonIssues: ["Subap erimesi (LPG)", "Yağ soğutucu", "Ateşleme bobini"],
        turkishMarketConsensus: "Opel'in Amerikan şubesi. Çelik subap taktır bin.",
        logo: getLogoUrl('Chevrolet')
    },
    {
        brand: 'Chery',
        score: 3.4,
        ranking: 25,
        description: "Piyasaya çok hızlı giren Çinli dev. Donanım şov yapıyor ama uzun vadeli dayanıklılığı henüz kanıtlanmadı.",
        pros: ["İnanılmaz donanım/fiyat", "Güçlü motor", "Modern tasarım"],
        cons: ["Yüksek yakıt tüketimi", "Servis/Parça bekleme süreleri"],
        commonIssues: ["Yazılım hataları", "Multimedya donması", "Sensör kararsızlığı"],
        turkishMarketConsensus: "Bu fiyata bu lüks bedava ama 5 sene sonra ne olur bilinmez.",
        logo: getLogoUrl('Chery')
    },
    {
        brand: 'Togg',
        score: 3.3,
        ranking: 26,
        description: "Türkiye'nin yerli gururu. Mekanik olarak güçlü olsa da yazılım tarafında güncellemelerle iyileşmeye devam ediyor.",
        pros: ["Yerli üretim", "Üstün performans", "Gelişmiş teknoloji"],
        cons: ["Yazılım hataları (henüz oturuyor)", "Servis yoğunluğu"],
        commonIssues: ["Ekran kararması", "Şarj uyum sorunları", "Yazılımsal hatalar"],
        turkishMarketConsensus: "Milli gururumuz. Ufak tefek yazılım hataları var ama zamanla düzeliyor, çekişi müthiş.",
        logo: getLogoUrl('Togg')
    },
    {
        brand: 'Alfa Romeo',
        score: 3.2,
        ranking: 27,
        description: "Otomobil tutkunlarının aşkı. Tasarımı ve sürüşü büyüler ama bakımı ve nazı meşhurdur.",
        pros: ["Sanat eseri tasarım", "Ruhlu sürüş", "Ses"],
        cons: ["Hassas mekanik", "Zor bulunan parça/usta"],
        commonIssues: ["Varyatör sesi", "Elektronik karmaşa", "Alt takım"],
        turkishMarketConsensus: "Alfa sahibi olmak iki kere sevindirir: Aldığında ve sattığında.",
        logo: getLogoUrl('Alfa Romeo')
    },
    {
        brand: 'Jeep',
        score: 3.1,
        ranking: 28,
        description: "Arazi ikonu. Renegade ile şehre indi ama Fiat altyapısı ve Amerikan genleri bazen uyumsuzluk yaratabiliyor.",
        pros: ["Arazi kabiliyeti", "İmaj", "Tasarım"],
        cons: ["Yüksek tüketim", "Elektrik arızaları"],
        commonIssues: ["Şanzıman kararsızlığı", "Turbo hortumları", "Sensörler"],
        turkishMarketConsensus: "Adı var kendi yok (Renegade için). Grand Cherokee ayrı dünya tabi.",
        logo: getLogoUrl('Jeep')
    },
    {
        brand: 'Land Rover',
        score: 2.9,
        ranking: 29,
        description: "Lüks SUV'un zirvesi ama arıza istatistiklerinde maalesef dipte. Çok karmaşık sistemleri sürekli ilgi ister.",
        pros: ["Rakipsiz arazi yeteneği", "Ultra lüks konfor", "Prestij"],
        cons: ["Korkunç arıza sıklığı", "Astronomik masraflar"],
        commonIssues: ["Krank kırma (bazı dizeller)", "Airsus (Hava süspansiyon)", "Beyin arızaları"],
        turkishMarketConsensus: "İki tane alacaksın; biri servisteyken diğerine binmek için.",
        logo: getLogoUrl('Land Rover')
    }
];
