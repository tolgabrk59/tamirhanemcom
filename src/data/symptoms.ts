// Kapsamlı araç belirtileri ve sorunları veritabanı
export const symptomDatabase = {
    engine: {
        name: 'Motor',
        icon: 'motor',
        color: 'red',
        symptoms: [
            {
                id: 'engine-wont-start',
                name: 'Motor Çalışmıyor',
                severity: 'high',
                description: 'Motor hiç çalışmıyor veya çalışmaya çalışıyor ama tutmuyor',
                commonCauses: [
                    'Akü bitmiş veya zayıf',
                    'Marş motoru arızalı',
                    'Yakıt pompası arızalı',
                    'Ateşleme bobini arızalı',
                    'Emniyet kilidi sistemi sorunu'
                ],
                estimatedCost: '500 - 3.000 TL',
                urgency: 'Acil - Araç kullanılamaz'
            },
            {
                id: 'engine-vibration',
                name: 'Motor Titreşimi',
                severity: 'medium',
                description: 'Motor çalışırken anormal titreşim hissediliyor',
                commonCauses: [
                    'Bujiler eskimiş',
                    'Motor takozları yıpranmış',
                    'Enjektör sorunu',
                    'Hava filtresi tıkalı',
                    'Silindir ateşleme sorunu'
                ],
                estimatedCost: '300 - 2.500 TL',
                urgency: 'Orta - Kısa sürede kontrol ettirin'
            },
            {
                id: 'loss-of-power',
                name: 'Güç Kaybı',
                severity: 'high',
                description: 'Motor yeterli güç üretmiyor, hızlanma zayıf',
                commonCauses: [
                    'Turbo arızası',
                    'Yakıt filtresi tıkalı',
                    'Egzoz sistemi tıkanması',
                    'Hava akış sensörü arızası',
                    'Katalitik konvertör tıkanması'
                ],
                estimatedCost: '800 - 8.000 TL',
                urgency: 'Yüksek - En kısa sürede kontrol ettirin'
            },
            {
                id: 'check-engine-light',
                name: 'Check Engine Lambası Yanıyor',
                severity: 'medium',
                description: 'Motor kontrol lambası sürekli veya yanıp sönüyor',
                commonCauses: [
                    'Oksijen sensörü arızası',
                    'Katalitik konvertör sorunu',
                    'Yakıt kapağı gevşek',
                    'Hava akış sensörü',
                    'Bujiler eskimiş'
                ],
                estimatedCost: '200 - 5.000 TL',
                urgency: 'Orta - Kısa sürede OBD taraması yaptırın'
            },
            {
                id: 'engine-overheating',
                name: 'Motor Aşırı Isınıyor',
                severity: 'high',
                description: 'Motor sıcaklık göstergesi normalin üzerinde',
                commonCauses: [
                    'Radyatör sızıntısı',
                    'Termostat arızası',
                    'Su pompası arızası',
                    'Soğutma fanı çalışmıyor',
                    'Soğutma suyu seviyesi düşük'
                ],
                estimatedCost: '400 - 4.000 TL',
                urgency: 'Acil - Hemen durdurun ve kontrol ettirin'
            },
            {
                id: 'engine-noise',
                name: 'Motor Gürültüsü',
                severity: 'medium',
                description: 'Motor çalışırken anormal sesler (tıkırtı, gıcırtı, vuruntu)',
                commonCauses: [
                    'Kayış gerginliği sorunu',
                    'Yağ seviyesi düşük',
                    'Rulman aşınması',
                    'Egzoz kaçağı',
                    'Supap ayarı bozuk'
                ],
                estimatedCost: '500 - 6.000 TL',
                urgency: 'Orta - Sesi tanımlayın ve kontrol ettirin'
            }
        ]
    },

    brakes: {
        name: 'Frenler',
        icon: 'fren',
        color: 'orange',
        symptoms: [
            {
                id: 'brake-squealing',
                name: 'Fren Cıyaklaması',
                severity: 'medium',
                description: 'Fren yapılırken yüksek perdeli cıyaklama sesi',
                commonCauses: [
                    'Fren balatası aşınmış',
                    'Fren diski pürüzlü',
                    'Fren tozları birikmiş',
                    'Düşük kalite balata',
                    'Nem veya pas'
                ],
                estimatedCost: '800 - 2.500 TL',
                urgency: 'Orta - Yakında kontrol ettirin'
            },
            {
                id: 'soft-brake-pedal',
                name: 'Yumuşak Fren Pedalı',
                severity: 'high',
                description: 'Fren pedalı yere kadar iniyor veya çok yumuşak',
                commonCauses: [
                    'Fren hidroliği kaçağı',
                    'Fren hava almış',
                    'Ana merkez arızası',
                    'Fren hortumu hasarlı',
                    'Fren balataları aşırı aşınmış'
                ],
                estimatedCost: '600 - 3.500 TL',
                urgency: 'Acil - Kullanmayın, çektirici çağırın'
            },
            {
                id: 'brake-vibration',
                name: 'Fren Titreşimi',
                severity: 'medium',
                description: 'Fren yapılırken direksiyon veya pedal titriyor',
                commonCauses: [
                    'Fren diski eğilmiş',
                    'Fren diski aşınmış',
                    'Tekerlek rulmanı gevşek',
                    'Süspansiyon sorunu',
                    'ABS sensör arızası'
                ],
                estimatedCost: '1.000 - 3.000 TL',
                urgency: 'Orta - Kısa sürede kontrol ettirin'
            },
            {
                id: 'brake-warning-light',
                name: 'Fren Uyarı Lambası',
                severity: 'high',
                description: 'Fren sistemi uyarı lambası yanıyor',
                commonCauses: [
                    'El freni çekili',
                    'Fren hidroliği seviyesi düşük',
                    'ABS sistemi arızası',
                    'Fren balataları kritik seviyede',
                    'Fren sensörü arızası'
                ],
                estimatedCost: '200 - 4.000 TL',
                urgency: 'Yüksek - Hemen kontrol ettirin'
            },
            {
                id: 'hard-brake-pedal',
                name: 'Sert Fren Pedalı',
                severity: 'high',
                description: 'Fren pedalına normalden çok daha fazla basılması gerekiyor',
                commonCauses: [
                    'Fren vakumu arızası',
                    'Fren güçlendirici sorunu',
                    'Vakum hortumu kaçağı',
                    'Fren kaliperi sıkışmış',
                    'Fren hidroliği donmuş'
                ],
                estimatedCost: '800 - 4.000 TL',
                urgency: 'Acil - Çok tehlikeli, hemen kontrol ettirin'
            }
        ]
    },

    suspension: {
        name: 'Süspansiyon',
        icon: 'wrench',
        color: 'blue',
        symptoms: [
            {
                id: 'clunking-noise',
                name: 'Tıkırtı Sesi',
                severity: 'medium',
                description: 'Tümseklerden geçerken veya dönüşlerde tıkırtı sesi',
                commonCauses: [
                    'Amortisör arızası',
                    'Rotil başı gevşek',
                    'Salıncak burcu yıpranmış',
                    'Stabilize çubuğu bağlantısı',
                    'Süspansiyon yayı kırık'
                ],
                estimatedCost: '600 - 3.500 TL',
                urgency: 'Orta - Kısa sürede kontrol ettirin'
            },
            {
                id: 'bouncy-ride',
                name: 'Sarsıntılı Sürüş',
                severity: 'medium',
                description: 'Araç aşırı zıplıyor veya sallanıyor',
                commonCauses: [
                    'Amortisörler bitmiş',
                    'Süspansiyon yayları zayıflamış',
                    'Lastik basıncı dengesiz',
                    'Tekerlek balanssız',
                    'Süspansiyon geometrisi bozuk'
                ],
                estimatedCost: '1.200 - 4.000 TL',
                urgency: 'Orta - Konfor ve güvenlik için kontrol ettirin'
            },
            {
                id: 'uneven-tire-wear',
                name: 'Dengesiz Lastik Aşınması',
                severity: 'low',
                description: 'Lastikler düzensiz veya tek taraflı aşınıyor',
                commonCauses: [
                    'Rot ayarı bozuk',
                    'Akor ayarı bozuk',
                    'Kamber ayarı yanlış',
                    'Süspansiyon hasarı',
                    'Lastik basıncı hatalı'
                ],
                estimatedCost: '300 - 2.000 TL',
                urgency: 'Düşük - Sonraki bakımda kontrol ettirin'
            },
            {
                id: 'steering-pull',
                name: 'Direksiyon Çekme',
                severity: 'medium',
                description: 'Araç bir tarafa doğru çekiyor',
                commonCauses: [
                    'Rot-akor ayarı bozuk',
                    'Lastik basınçları farklı',
                    'Fren kaliperi sıkışmış',
                    'Süspansiyon hasarı',
                    'Lastikler farklı'
                ],
                estimatedCost: '200 - 2.500 TL',
                urgency: 'Orta - Güvenlik için kontrol ettirin'
            }
        ]
    },

    electrical: {
        name: 'Elektrik Sistemi',
        icon: 'elektrik',
        color: 'yellow',
        symptoms: [
            {
                id: 'battery-dead',
                name: 'Akü Bitti',
                severity: 'medium',
                description: 'Akü şarjı tutmuyor veya sürekli bitiyor',
                commonCauses: [
                    'Akü ömrü dolmuş',
                    'Alternatör arızası',
                    'Parazitik akım kaçağı',
                    'Akü bağlantıları gevşek',
                    'Şarj sistemi arızası'
                ],
                estimatedCost: '400 - 3.000 TL',
                urgency: 'Orta - Yolda kalma riski var'
            },
            {
                id: 'lights-not-working',
                name: 'Farlar Çalışmıyor',
                severity: 'high',
                description: 'Farlar, stop lambaları veya sinyal lambaları çalışmıyor',
                commonCauses: [
                    'Ampul yanmış',
                    'Sigorta atmış',
                    'Kablo bağlantısı kopuk',
                    'Far anahtarı arızası',
                    'Rele arızası'
                ],
                estimatedCost: '100 - 1.500 TL',
                urgency: 'Yüksek - Trafik güvenliği riski'
            },
            {
                id: 'alternator-warning',
                name: 'Şarj Uyarı Lambası',
                severity: 'high',
                description: 'Akü/şarj uyarı lambası yanıyor',
                commonCauses: [
                    'Alternatör arızası',
                    'Alternatör kayışı kopuk',
                    'Voltaj regülatörü arızası',
                    'Akü bağlantısı gevşek',
                    'Şarj sistemi kablosu hasarlı'
                ],
                estimatedCost: '800 - 4.500 TL',
                urgency: 'Yüksek - Akü bitebilir, yolda kalabilirsiniz'
            },
            {
                id: 'electrical-accessories-fail',
                name: 'Elektrikli Aksesuarlar Çalışmıyor',
                severity: 'low',
                description: 'Camlar, aynalar, klima veya radyo çalışmıyor',
                commonCauses: [
                    'Sigorta atmış',
                    'Anahtar arızası',
                    'Motor arızası',
                    'Kablo bağlantısı sorunu',
                    'Kontrol modülü arızası'
                ],
                estimatedCost: '200 - 3.000 TL',
                urgency: 'Düşük - Konfor sorunu'
            }
        ]
    },

    transmission: {
        name: 'Şanzıman',
        icon: 'sanziman',
        color: 'purple',
        symptoms: [
            {
                id: 'slipping-gears',
                name: 'Vites Kayması',
                severity: 'high',
                description: 'Vitesler kendiliğinden değişiyor veya kayıyor',
                commonCauses: [
                    'Şanzıman yağı seviyesi düşük',
                    'Debriyaj diski aşınmış',
                    'Şanzıman yağı eski',
                    'Hidrolik sistem arızası',
                    'Şanzıman içi aşınma'
                ],
                estimatedCost: '1.500 - 15.000 TL',
                urgency: 'Yüksek - Büyük hasara yol açabilir'
            },
            {
                id: 'hard-shifting',
                name: 'Sert Vites Değişimi',
                severity: 'medium',
                description: 'Vitesler zor geçiyor veya sert geçiyor',
                commonCauses: [
                    'Debriyaj ayarı bozuk',
                    'Şanzıman yağı eski',
                    'Senkromeç aşınmış',
                    'Vites linkajı sorunu',
                    'Hidrolik sistem havası almış'
                ],
                estimatedCost: '800 - 8.000 TL',
                urgency: 'Orta - Kötüleşmeden kontrol ettirin'
            },
            {
                id: 'transmission-fluid-leak',
                name: 'Şanzıman Yağı Sızıntısı',
                severity: 'high',
                description: 'Araç altında kırmızı yağ sızıntısı',
                commonCauses: [
                    'Conta eskimiş',
                    'Yağ karteri hasarlı',
                    'Soğutucu hortumu sızdırıyor',
                    'Aksiyel hasarlı',
                    'Vites kutusu çatlak'
                ],
                estimatedCost: '500 - 5.000 TL',
                urgency: 'Yüksek - Yağ biterse büyük hasar olur'
            },
            {
                id: 'burning-smell',
                name: 'Yanık Kokusu',
                severity: 'high',
                description: 'Şanzımandan yanık kokusu geliyor',
                commonCauses: [
                    'Şanzıman aşırı ısınıyor',
                    'Debriyaj yanıyor',
                    'Şanzıman yağı yanmış',
                    'Fren sıkışmış',
                    'Hidrolik sistem arızası'
                ],
                estimatedCost: '1.000 - 12.000 TL',
                urgency: 'Acil - Hemen durdurun'
            }
        ]
    },

    cooling: {
        name: 'Soğutma Sistemi',
        icon: 'klima',
        color: 'cyan',
        symptoms: [
            {
                id: 'coolant-leak',
                name: 'Soğutma Suyu Sızıntısı',
                severity: 'high',
                description: 'Araç altında yeşil/turuncu sıvı sızıntısı',
                commonCauses: [
                    'Radyatör sızıntısı',
                    'Hortum çatlak',
                    'Su pompası sızdırıyor',
                    'Termostat kapağı gevşek',
                    'Silindir kapak contası yanmış'
                ],
                estimatedCost: '300 - 6.000 TL',
                urgency: 'Yüksek - Motor aşırı ısınabilir'
            },
            {
                id: 'heater-not-working',
                name: 'Kalorifer Çalışmıyor',
                severity: 'low',
                description: 'Araç içi ısıtma sistemi soğuk üflüyor',
                commonCauses: [
                    'Termostat arızası',
                    'Kalorifer radyatörü tıkalı',
                    'Soğutma suyu seviyesi düşük',
                    'Hava kabarcığı',
                    'Kalorifer vanası arızası'
                ],
                estimatedCost: '400 - 2.500 TL',
                urgency: 'Düşük - Konfor sorunu'
            }
        ]
    },

    fuel: {
        name: 'Yakıt Sistemi',
        icon: 'motor',
        color: 'green',
        symptoms: [
            {
                id: 'poor-fuel-economy',
                name: 'Yüksek Yakıt Tüketimi',
                severity: 'low',
                description: 'Araç normalden çok daha fazla yakıt tüketiyor',
                commonCauses: [
                    'Oksijen sensörü arızası',
                    'Hava filtresi tıkalı',
                    'Bujiler eskimiş',
                    'Yakıt enjektörü kirli',
                    'Lastik basıncı düşük'
                ],
                estimatedCost: '300 - 3.000 TL',
                urgency: 'Düşük - Ekonomik kayıp'
            },
            {
                id: 'fuel-smell',
                name: 'Yakıt Kokusu',
                severity: 'high',
                description: 'Araç içinde veya dışında yakıt kokusu',
                commonCauses: [
                    'Yakıt hattı sızıntısı',
                    'Yakıt tankı hasarlı',
                    'Enjektör sızdırıyor',
                    'Yakıt pompası sızdırıyor',
                    'Buharlaşma sistemi arızası'
                ],
                estimatedCost: '500 - 4.000 TL',
                urgency: 'Acil - Yangın riski!'
            },
            {
                id: 'engine-stalling',
                name: 'Motor Duruyor',
                severity: 'high',
                description: 'Motor çalışırken aniden duruyor',
                commonCauses: [
                    'Yakıt pompası arızası',
                    'Yakıt filtresi tıkalı',
                    'Rölanti ayarı bozuk',
                    'Hava akış sensörü arızası',
                    'Ateşleme sistemi sorunu'
                ],
                estimatedCost: '400 - 4.500 TL',
                urgency: 'Yüksek - Trafik güvenliği riski'
            }
        ]
    }
};

// Tüm belirtileri düz liste olarak
export const allSymptoms = Object.values(symptomDatabase).flatMap(category =>
    category.symptoms.map(symptom => ({
        ...symptom,
        category: category.name,
        categoryIcon: category.icon,
        categoryColor: category.color
    }))
);

// Aciliyet seviyesine göre belirtiler
export const urgentSymptoms = allSymptoms.filter(s => s.severity === 'high');

// Popüler aramalar
export const popularSearches = [
    'Check Engine Lambası',
    'Fren Sesi',
    'Motor Titriyor',
    'Yakıt Tüketimi',
    'Akü Bitti',
    'Motor Aşırı Isınıyor',
    'Vites Kayması',
    'Fren Pedalı Yumuşak'
];
