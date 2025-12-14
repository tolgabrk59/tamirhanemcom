#!/usr/bin/env python3
"""
Motor System Expansion Script
Adds remaining 45 components to reach 106 total (RepairPal complete)
"""

import re

def add_components_to_subsystem(content, subsystem_slug, new_components_code):
    """Add components to a specific subsystem"""
    # Find the subsystem and its components array closing
    pattern = rf"slug: '{subsystem_slug}'.*?components: \[(.*?)\s+\]"
    match = re.search(pattern, content, re.DOTALL)
    
    if not match:
        print(f"Could not find subsystem: {subsystem_slug}")
        return content
    
    # Insert before the closing bracket
    insertion_point = match.end() - 1
    content = content[:insertion_point] + "," + new_components_code + "\n                " + content[insertion_point:]
    return content

# Read current file
with open('src/data/encyclopedia-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

print("Adding remaining motor components...")

# 1. Hava Emme Sistemi - Add fuel system components (+8)
hava_emme_additions = """
                    {
                        id: 'yakit-enjektoru',
                        name: 'Yakıt Enjektörü (Fuel Injector)',
                        slug: 'yakit-enjektoru',
                        description: 'Yakıtı motora püskürten parça.',
                        function: 'Yakıtı atomize ederek yanma odasına püskürtür.',
                        symptoms: ['Motor titremesi', 'Güç kaybı', 'Kötü yakıt ekonomisi'],
                        repairAdvice: ['80.000 km\\'de temizlenmeli', 'Arızalı enjektör değiştirilmeli'],
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
                        repairAdvice: ['20.000-40.000 km\\'de değiştirilmeli'],
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
                        repairAdvice: ['20.000-50.000 km\\'de değiştirilmeli'],
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
                    }"""

content = add_components_to_subsystem(content, 'hava-emme-sistemi', hava_emme_additions)
print("✓ Added 8 components to Hava Emme")

# 2. Motor Blok - Add more engine parts (+7)
motor_blok_additions = """
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
                    }"""

content = add_components_to_subsystem(content, 'motor-blok', motor_blok_additions)
print("✓ Added 7 components to Motor Blok")

# 3. Sensörler - Add more sensors (+4)
sensorler_additions = """
                    {
                        id: 'yag-basinc-sensoru',
                        name: 'Yağ Basınç Sensörü (Oil Pressure Sensor)',
                        slug: 'yag-basinc-sensoru',
                        description: 'Yağ basıncını ölçer.',
                        function: 'Motor yağ basıncını ECU\\'ya ve göstergeye bildirir.',
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
                    }"""

content = add_components_to_subsystem(content, 'sensorler', sensorler_additions)
print("✓ Added 4 components to Sensörler")

# 4. Kayışlar - Add more belt components (+3)
kayislar_additions = """
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
                    }"""

content = add_components_to_subsystem(content, 'kayislar', kayislar_additions)
print("✓ Added 3 components to Kayışlar")

# 5. Contalar - Add more gaskets (+6)
contalar_additions = """
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
                    }"""

content = add_components_to_subsystem(content, 'contalar', contalar_additions)
print("✓ Added 6 components to Contalar")

# 6. Soğutma - Add more cooling components (+2)
sogutma_additions = """
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
                    }"""

content = add_components_to_subsystem(content, 'sogutma-motor', sogutma_additions)
print("✓ Added 2 components to Soğutma")

# 7. Yağlama - Add rear main seal (+1)
yaglama_additions = """
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
                    }"""

content = add_components_to_subsystem(content, 'yaglama-sistemi', yaglama_additions)
print("✓ Added 1 component to Yağlama")

# 8. Ateşleme - Add ignition components (+2)
atesleme_additions = """
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
                    }"""

content = add_components_to_subsystem(content, 'atesleme-sistemi', atesleme_additions)
print("✓ Added 2 components to Ateşleme")

# 9. Zamanlama - Add more timing components (+2)
zamanlama_additions = """
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
                    }"""

content = add_components_to_subsystem(content, 'zamanlama-sistemi', zamanlama_additions)
print("✓ Added 2 components to Zamanlama")

# 10. NEW SUBSYSTEM - Dizel Bileşenleri (+5)
# This needs to be added as a new subsystem before the closing of motor system

dizel_subsystem = """            {
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
                        repairAdvice: ['Dizel motorlara özel yağ kullanılmalı', '10.000-15.000 km\\'de değiştirilmeli'],
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
                        repairAdvice: ['15.000-30.000 km\\'de değiştirilmeli', 'Su tahliyesi yapılmalı'],
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
            },
"""

# Find the closing of motor subsystems array (before components: [])
motor_subsystems_end = content.find("        ],\n        components: []\n    },\n\n    {\n        id: 'fren',")
if motor_subsystems_end != -1:
    content = content[:motor_subsystems_end] + "," + dizel_subsystem + "\n        " + content[motor_subsystems_end:]
    print("✓ Added new Dizel Bileşenleri subsystem with 5 components")
else:
    print("! Could not add Dizel subsystem")

# Write back
with open('src/data/encyclopedia-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n" + "="*50)
print("MOTOR SYSTEM EXPANSION COMPLETE!")
print("="*50)

# Count final components
motor_start = content.find("id: 'motor',")
motor_end = content.find("id: 'fren',")
motor_section = content[motor_start:motor_end]

component_pattern = r"function: '[^']+'"
components = re.findall(component_pattern, motor_section)

subsystem_pattern = r"slug: '[^']+',\s+description: '[^']+',\s+components: \["
subsystems = re.findall(subsystem_pattern, motor_section)

print(f"\nFinal Statistics:")
print(f"  Motor Subsystems: {len(subsystems)}")
print(f"  Motor Components: {len(components)}")
print(f"  Target: 106 components")
print(f"  Coverage: {len(components)}/106 ({len(components)*100//106}%)")
print(f"\nFile updated: src/data/encyclopedia-data.ts")
print("\nRun 'npx tsc --noEmit src/data/encyclopedia-data.ts' to check for errors")
