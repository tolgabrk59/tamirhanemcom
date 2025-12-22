'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// Warning light data with SVG paths
const warningLights = [
  // RED - URGENT
  {
    id: 'engine-oil',
    name: 'Motor Yağı Basıncı',
    category: 'red',
    description: 'Motor yağı basıncının düşük olduğunu gösterir. Düşük yağ seviyesi, sızıntı veya yağ pompası arızası olabilir.',
    action: 'Aracı hemen durdurun ve yağ seviyesini kontrol edin. Yağ varsa bile lambası yanıyorsa servise çağrı yapın.',
    icon: 'oil',
  },
  {
    id: 'brake-system',
    name: 'Fren Sistemi',
    category: 'red',
    description: 'Fren hidroliği düşük, fren balataları aşınmış veya fren sisteminde bir sorun var.',
    action: 'El freni kapalıysa ve lamba yanıyorsa hemen en yakın servise gidin. Fren performansı azalmış olabilir.',
    icon: 'brake',
  },
  {
    id: 'engine-temp',
    name: 'Motor Sıcaklığı',
    category: 'red',
    description: 'Motor aşırı ısınıyor. Düşük antifriz seviyesi, soğutma sistemi sızıntısı veya termostat arızası olabilir.',
    action: 'Aracı güvenli bir yere çekin ve motoru kapatın. Soğumasını bekleyin ve antifriz seviyesini kontrol edin.',
    icon: 'temperature',
  },
  {
    id: 'battery',
    name: 'Akü / Şarj Sistemi',
    category: 'red',
    description: 'Şarj sisteminde sorun var, akü düzgün şarj olmuyor. Alternatör veya akü arızası olabilir.',
    action: 'Gereksiz elektrikli cihazları kapatın ve en yakın servise gidin. Uzun mesafe gitmeyin.',
    icon: 'battery',
  },
  {
    id: 'airbag',
    name: 'Airbag / SRS',
    category: 'red',
    description: 'Hava yastığı sisteminde arıza tespit edildi. Kaza anında hava yastıkları açılmayabilir.',
    action: 'Güvenliğiniz için en kısa sürede servise götürün ve sistemi kontrol ettirin.',
    icon: 'airbag',
  },
  {
    id: 'power-steering',
    name: 'Direksiyon Sistemi',
    category: 'red',
    description: 'Hidrolik veya elektrikli direksiyon sisteminde arıza. Direksiyon ağırlaşabilir.',
    action: 'Dikkatli sürün ve en yakın servise gidin. Elektrikli sistemlerde yeniden başlatma sorunu çözebilir.',
    icon: 'steering',
  },
  {
    id: 'seatbelt',
    name: 'Emniyet Kemeri',
    category: 'red',
    description: 'Sürücü veya yolcuların emniyet kemeri takılı değil.',
    action: 'Tüm yolcuların emniyet kemerlerini taktığından emin olun.',
    icon: 'seatbelt',
  },
  {
    id: 'door-open',
    name: 'Kapı Açık',
    category: 'red',
    description: 'Bir veya daha fazla kapı tam kapatılmamış.',
    action: 'Tüm kapıların düzgün kapandığından emin olun.',
    icon: 'door',
  },
  {
    id: 'trunk-open',
    name: 'Bagaj Açık',
    category: 'red',
    description: 'Bagaj kapağı tam kapatılmamış.',
    action: 'Bagaj kapağının düzgün kapandığından emin olun.',
    icon: 'trunk',
  },
  {
    id: 'hood-open',
    name: 'Motor Kapağı Açık',
    category: 'red',
    description: 'Motor kapağı (kaput) tam kapatılmamış.',
    action: 'Motor kapağının düzgün kapandığından ve kilitlendiğinden emin olun.',
    icon: 'hood',
  },
  {
    id: 'parking-brake',
    name: 'El Freni / Park Freni',
    category: 'red',
    description: 'El freni (park freni) çekili durumda veya park freni sisteminde sorun var.',
    action: 'El frenini indirin. İndirdikten sonra yanmaya devam ederse fren sistemini kontrol ettirin.',
    icon: 'parkingbrake',
  },
  {
    id: 'coolant-level',
    name: 'Antifriz Seviyesi',
    category: 'red',
    description: 'Motor soğutma sıvısı (antifriz) seviyesi çok düşük.',
    action: 'Motoru durdurun, soğumasını bekleyin ve antifriz seviyesini kontrol edin. Eksikse doldurun.',
    icon: 'coolant',
  },
  {
    id: 'transmission-temp',
    name: 'Şanzıman Sıcaklığı',
    category: 'red',
    description: 'Otomatik şanzıman aşırı ısınmış. Uzun süreli ağır yük veya şanzıman yağı problemi olabilir.',
    action: 'Aracı durdurun ve şanzımanın soğumasını bekleyin. Devam ederse servise götürün.',
    icon: 'transmission',
  },
  {
    id: 'security-alarm',
    name: 'Güvenlik / Alarm',
    category: 'red',
    description: 'Araç güvenlik sisteminde sorun var veya alarm aktif.',
    action: 'Aracı kilidini açıp tekrar kilitleyin. Devam ederse immobilizer sistemini kontrol ettirin.',
    icon: 'security',
  },

  // YELLOW/ORANGE - CAUTION
  {
    id: 'check-engine',
    name: 'Motor Arıza (Check Engine)',
    category: 'yellow',
    description: 'Motor veya emisyon sisteminde sorun algılandı. Gevşek yakıt kapağından ciddi motor arızasına kadar birçok neden olabilir.',
    action: 'Yanıp sönüyorsa acil, sabit yanıyorsa yakın zamanda servise gidin. OBD-II ile hata kodunu okutun.',
    icon: 'engine',
  },
  {
    id: 'tpms',
    name: 'Lastik Basıncı (TPMS)',
    category: 'yellow',
    description: 'Bir veya daha fazla lastik basıncı önerilen seviyenin altında.',
    action: 'Lastik basınçlarını kontrol edin ve önerilen seviyeye getirin. Delik olup olmadığını kontrol edin.',
    icon: 'tire',
  },
  {
    id: 'abs',
    name: 'ABS (Kilitlenme Önleyici)',
    category: 'yellow',
    description: 'ABS sisteminde arıza var. Normal fren çalışır ama kilitlenme önleme özelliği devre dışı.',
    action: 'Dikkatli sürün, özellikle kaygan zeminlerde. En kısa sürede servise götürün.',
    icon: 'abs',
  },
  {
    id: 'traction-control',
    name: 'Traction Control / ESP',
    category: 'yellow',
    description: 'Traksiyon veya stabilite kontrol sisteminde sorun. Yanıp sönüyorsa sistem aktif çalışıyor.',
    action: 'Sabit yanıyorsa sistem devre dışı. "OFF" yazısıyla yanıyorsa manuel kapatılmış olabilir.',
    icon: 'traction',
  },
  {
    id: 'dpf',
    name: 'DPF (Dizel Partikül Filtresi)',
    category: 'yellow',
    description: 'Dizel araçlarda partikül filtresi kurum ile tıkanmış, rejenerasyon gerekli.',
    action: 'Yüksek devirde uzun yol yaparak filtrenin temizlenmesini sağlayın veya servise götürün.',
    icon: 'dpf',
  },
  {
    id: 'fuel-low',
    name: 'Düşük Yakıt',
    category: 'yellow',
    description: 'Yakıt deposu düşük seviyede, yakıt ikmali gerekiyor.',
    action: 'En yakın benzin istasyonunda yakıt doldurun.',
    icon: 'fuel',
  },
  {
    id: 'washer-fluid',
    name: 'Cam Suyu',
    category: 'yellow',
    description: 'Cam suyu haznesinin seviyesi düşük.',
    action: 'Cam suyu haznesine uygun sıvı ekleyin.',
    icon: 'washer',
  },
  {
    id: 'glow-plug',
    name: 'Kızdırma Bujisi (Dizel)',
    category: 'yellow',
    description: 'Dizel motorlarda ön ısıtma sistemi. Yandığında motor çalıştırmadan önce bekleyin.',
    action: 'Lamba sönene kadar bekleyin, ardından motoru çalıştırın. Sabit kalırsa servise götürün.',
    icon: 'glow',
  },
  {
    id: 'service',
    name: 'Servis Uyarısı',
    category: 'yellow',
    description: 'Planlı bakım zamanı geldi veya bakım gerekiyor.',
    action: 'Araç bakım planını kontrol edin ve gerekli bakımları yaptırın.',
    icon: 'service',
  },
  {
    id: 'lane-departure',
    name: 'Şerit Takip Uyarısı',
    category: 'yellow',
    description: 'Araç sinyal vermeden şeridinden çıkmak üzere veya sistemde arıza var.',
    action: 'Yanıp sönüyorsa şeritte kalın. Sabit yanıyorsa sistem arızalı olabilir.',
    icon: 'lane',
  },
  {
    id: 'blind-spot',
    name: 'Kör Nokta Uyarısı',
    category: 'yellow',
    description: 'Kör noktada başka bir araç tespit edildi veya sistemde arıza var.',
    action: 'Şerit değiştirmeden önce dikkatli olun. Sabit yanıyorsa sensörleri kontrol ettirin.',
    icon: 'blindspot',
  },
  {
    id: 'forward-collision',
    name: 'Ön Çarpışma Uyarısı',
    category: 'yellow',
    description: 'Öndeki araca çok yaklaştınız veya çarpışma riski var.',
    action: 'Takip mesafesini artırın ve hızınızı düşürün.',
    icon: 'collision',
  },
  {
    id: 'adblue',
    name: 'AdBlue / DEF Seviyesi',
    category: 'yellow',
    description: 'AdBlue (Dizel Emisyon Sıvısı) seviyesi düşük. Dizel araçlarda emisyon kontrolü için gerekli.',
    action: 'AdBlue dolumu yapın. Biterse araç çalışmayabilir.',
    icon: 'adblue',
  },
  {
    id: 'catalytic',
    name: 'Katalitik Konvertör',
    category: 'yellow',
    description: 'Katalitik konvertör aşırı ısınmış veya arızalı. Emisyon sistemi sorunu.',
    action: 'Aracı durdurup soğumasını bekleyin. Devam ederse servise götürün.',
    icon: 'catalytic',
  },
  {
    id: 'reduced-power',
    name: 'Güç Azaltma Modu',
    category: 'yellow',
    description: 'Motor bilgisayarı güç çıkışını sınırladı. Genellikle koruma amaçlı.',
    action: 'Aracı yeniden başlatmayı deneyin. Devam ederse servise götürün.',
    icon: 'reducedpower',
  },
  {
    id: 'immobilizer',
    name: 'İmmobilizer / Anahtar',
    category: 'yellow',
    description: 'Anahtar tanınmadı veya immobilizer sisteminde sorun var.',
    action: 'Anahtarı çıkarıp tekrar takın. Yedek anahtarı deneyin veya servise başvurun.',
    icon: 'key',
  },
  {
    id: 'oil-change',
    name: 'Yağ Değişimi',
    category: 'yellow',
    description: 'Motor yağı değişim zamanı geldi.',
    action: 'Motor yağı ve yağ filtresi değişimi yaptırın.',
    icon: 'oilchange',
  },
  {
    id: 'bulb-failure',
    name: 'Ampul Arızası',
    category: 'yellow',
    description: 'Bir veya daha fazla dış aydınlatma lambası yanmıyor.',
    action: 'Tüm dış lambaları kontrol edin ve yanmayan ampulü değiştirin.',
    icon: 'bulb',
  },

  // GREEN/BLUE - INFORMATIONAL
  {
    id: 'headlights',
    name: 'Kısa Farlar',
    category: 'green',
    description: 'Düşük farlar (kısa farlar) açık.',
    action: 'Bilgilendirme amaçlı - farlarınız açık.',
    icon: 'headlight',
  },
  {
    id: 'high-beam',
    name: 'Uzun Far',
    category: 'blue',
    description: 'Uzun farlar (yüksek huzme) aktif.',
    action: 'Karşı trafikte veya öndeki araca yaklaştığında kapatmayı unutmayın.',
    icon: 'highbeam',
  },
  {
    id: 'turn-signal',
    name: 'Sinyal Lambası',
    category: 'green',
    description: 'Sağ veya sol dönüş sinyali aktif.',
    action: 'Normal kullanım - dönüş veya şerit değiştirme sinyali.',
    icon: 'signal',
  },
  {
    id: 'cruise-control',
    name: 'Hız Sabitleyici',
    category: 'green',
    description: 'Cruise control sistemi aktif ve sabit hızda seyir ediyorsunuz.',
    action: 'Fren veya debriyaja basarak sistemi devre dışı bırakabilirsiniz.',
    icon: 'cruise',
  },
  {
    id: 'adaptive-cruise',
    name: 'Adaptif Hız Sabitleyici',
    category: 'green',
    description: 'Adaptif cruise control aktif, öndeki araca göre hız ve mesafe ayarlanıyor.',
    action: 'Sistem otomatik olarak hız ve mesafeyi ayarlayacak.',
    icon: 'adaptivecruise',
  },
  {
    id: 'fog-lights',
    name: 'Ön Sis Farları',
    category: 'green',
    description: 'Ön sis farları açık.',
    action: 'Sisli hava dışında kullanmayın, karşı trafiği rahatsız edebilir.',
    icon: 'fog',
  },
  {
    id: 'rear-fog',
    name: 'Arka Sis Lambası',
    category: 'yellow',
    description: 'Arka sis lambası açık.',
    action: 'Sisli hava dışında kapatın, arkadan gelen sürücüleri rahatsız edebilir.',
    icon: 'rearfog',
  },
  {
    id: 'parking-lights',
    name: 'Park Lambaları',
    category: 'green',
    description: 'Park lambaları (yan lambalar) açık.',
    action: 'Bilgilendirme amaçlı.',
    icon: 'parking',
  },
  {
    id: 'eco-mode',
    name: 'Eco Modu',
    category: 'green',
    description: 'Ekonomik sürüş modu aktif, yakıt tasarrufu sağlanıyor.',
    action: 'Normal sürüş için modu kapatabilirsiniz.',
    icon: 'eco',
  },
  {
    id: 'sport-mode',
    name: 'Sport Modu',
    category: 'yellow',
    description: 'Sportif sürüş modu aktif, performans artırılmış.',
    action: 'Daha fazla yakıt tüketir. Normal sürüş için modu kapatabilirsiniz.',
    icon: 'sport',
  },
  {
    id: 'start-stop',
    name: 'Start/Stop Sistemi',
    category: 'green',
    description: 'Otomatik motor durdurma/çalıştırma sistemi aktif.',
    action: 'Trafik ışıklarında motor otomatik olarak duracak ve debriyaj/frenden ayak çekince çalışacak.',
    icon: 'startstop',
  },
  {
    id: '4wd',
    name: '4WD / AWD Göstergesi',
    category: 'green',
    description: 'Dört tekerlekten çekiş sistemi aktif.',
    action: 'Bilgilendirme amaçlı - 4x4 veya AWD sistemi devrede.',
    icon: 'fourwd',
  },
  {
    id: 'hill-assist',
    name: 'Yokuş Kalkış Desteği',
    category: 'green',
    description: 'Yokuş kalkış destek sistemi aktif, araç yokuşta geriye kaymayacak.',
    action: 'Bilgilendirme amaçlı - sistem freni kısa süre tutacak.',
    icon: 'hillassist',
  },
  {
    id: 'auto-hold',
    name: 'Auto Hold',
    category: 'green',
    description: 'Otomatik fren tutma sistemi aktif.',
    action: 'Duruşlarda fren pedalına basmaya gerek kalmadan araç yerinde duracak.',
    icon: 'autohold',
  },
  {
    id: 'ev-battery',
    name: 'Elektrikli Araç Akü',
    category: 'green',
    description: 'Elektrikli veya hibrit araç batarya durumu göstergesi.',
    action: 'Batarya seviyesini takip edin ve gerektiğinde şarj edin.',
    icon: 'evbattery',
  },
  {
    id: 'ev-charging',
    name: 'Şarj Göstergesi',
    category: 'green',
    description: 'Elektrikli araç şarj oluyor.',
    action: 'Şarj tamamlanana kadar bekleyin.',
    icon: 'charging',
  },
  {
    id: 'ready-drive',
    name: 'Ready / Hazır',
    category: 'green',
    description: 'Hibrit veya elektrikli araç sürüşe hazır.',
    action: 'Araç hareket etmeye hazır, vitesi takabilirsiniz.',
    icon: 'ready',
  },
];


// SVG Icon components
const WarningIcon = ({ type, className = "" }: { type: string; className?: string }) => {
  const iconClass = `w-12 h-12 ${className}`;
  
  switch (type) {
    case 'oil':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 10.5c0-3.58-3.12-6.5-7-6.5-1.3 0-2.52.35-3.57.95L12 9l-4 4 5 3 1.43-5.72c.77.52 1.37 1.25 1.74 2.09.19.42.33.87.43 1.33-.27-.08-.54-.15-.82-.2-1.11-.22-2.3.22-3.13 1.18-.73.85-.75 2.16-.05 3.04.3.38.7.69 1.16.9.46.21.97.33 1.5.33 1.93 0 3.56-1.45 3.73-3.39.08-.94-.14-1.84-.65-2.57l-.17-.24c.3-.03.59-.05.88-.05.97 0 1.91.18 2.78.5.17-.51.27-1.04.27-1.6 0-.94-.26-1.81-.72-2.55z"/>
        </svg>
      );
    case 'brake':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2v-2zm0-8h2v6h-2V8z"/>
        </svg>
      );
    case 'temperature':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1h-1v1h1v2h-1v1h1v2h-2V5z"/>
        </svg>
      );
    case 'battery':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM13 18h-2v-2h2v2zm0-4h-2V9h2v5z"/>
        </svg>
      );
    case 'airbag':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 5h2v2h-2V7zm4 10c0 .55-.45 1-1 1H9c-.55 0-1-.45-1-1v-1c0-.55.45-1 1-1h1v-3H9v-1c0-.55.45-1 1-1h2c.55 0 1 .45 1 1v4h1c.55 0 1 .45 1 1v1z"/>
        </svg>
      );
    case 'steering':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-11h2v3h-2V9zm0 4h2v3h-2v-3z"/>
        </svg>
      );
    case 'seatbelt':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm5 9.5V12c0-2.76-2.24-5-5-5s-5 2.24-5 5v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V12c0-1.1.9-2 2-2s2 .9 2 2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5zM12 22c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z"/>
        </svg>
      );
    case 'door':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 19V5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v14H3v2h18v-2h-2zm-8-6H9v-2h2v2z"/>
        </svg>
      );
    case 'engine':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 15h4v4H7zm0-8h4v4H7zM3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2zm18 14H3V5h18v14zm-4-6h-3v3h3v-3zm0-6h-3v3h3V7zm-1 1.5l1.5 1.5-1.5 1.5-1.5-1.5 1.5-1.5z"/>
        </svg>
      );
    case 'tire':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
        </svg>
      );
    case 'abs':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <text x="3" y="17" fontSize="10" fontWeight="bold">ABS</text>
        </svg>
      );
    case 'traction':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          <path d="M7 7l2 2M17 7l-2 2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      );
    case 'dpf':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
        </svg>
      );
    case 'fuel':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z"/>
        </svg>
      );
    case 'washer':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.5 2h-13c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6.5 15c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zM8 5h8v2H8V5z"/>
        </svg>
      );
    case 'glow':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
          <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M5.64 18.36l1.41-1.41M16.95 7.05l1.41-1.41"/>
        </svg>
      );
    case 'service':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
        </svg>
      );
    case 'headlight':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 3H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 6H5V5h4v4zm10-6h-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 6h-4V5h4v4zM8 14H4v2h4v-2zm0 3H4v2h4v-2zm8-3h-4v2h4v-2zm0 3h-4v2h4v-2z"/>
        </svg>
      );
    case 'highbeam':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zM2 12l3-3v2h4v2H5v2l-3-3zm17 3l3-3-3-3v2h-4v2h4v2z"/>
        </svg>
      );
    case 'signal':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.5 16.5L3 10l6.5-6.5v4H15v5h-5.5v4zm5-9L21 14l-6.5 6.5v-4H9v-5h5.5v-4z"/>
        </svg>
      );
    case 'cruise':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
        </svg>
      );
    case 'fog':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zM3 17h4v2H3v-2zm6 0h4v2H9v-2zm6 0h4v2h-4v-2z"/>
        </svg>
      );
    case 'parking':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z"/>
        </svg>
      );
    case 'eco':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.05 8.05c-2.73 2.73-2.73 7.15-.02 9.88 1.47-3.4 4.09-6.24 7.36-7.93-2.77 2.34-4.71 5.61-5.39 9.32 2.6 1.23 5.8.78 7.95-1.37 2.99-2.99 3.83-11.14 4.01-13.38l-.02-.02c-2.24.18-10.39 1.02-13.89 3.5z"/>
        </svg>
      );
    case 'trunk':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM5 11l1.5-4.5h11L19 11H5zm2.5 5c-.83 0-1.5-.67-1.5-1.5S6.67 13 7.5 13s1.5.67 1.5 1.5S8.33 16 7.5 16zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          <path d="M7 2h10v3H7z" opacity="0.6"/>
        </svg>
      );
    case 'hood':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM5 11l1.5-4.5h11L19 11H5z"/>
          <path d="M8 7h8l-1 -4H9z" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
      );
    case 'parkingbrake':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/>
          <text x="8" y="16" fontSize="10" fontWeight="bold">P</text>
        </svg>
      );
    case 'coolant':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3c-1.1 0-2 .9-2 2v6.5c-1.2.7-2 2-2 3.5 0 2.2 1.8 4 4 4s4-1.8 4-4c0-1.5-.8-2.8-2-3.5V5c0-1.1-.9-2-2-2zm0 2h0v7l.5.3c.8.5 1.5 1.4 1.5 2.7 0 1.1-.9 2-2 2s-2-.9-2-2c0-1.3.7-2.2 1.5-2.7l.5-.3V5z"/>
          <path d="M7 19h2v2H7zM15 19h2v2h-2zM11 19h2v2h-2z"/>
        </svg>
      );
    case 'transmission':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4z"/>
          <text x="9" y="16" fontSize="8" fill="white" fontWeight="bold">A</text>
        </svg>
      );
    case 'security':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
        </svg>
      );
    case 'lane':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM5 11l1.5-4.5h11L19 11H5z"/>
          <path d="M2 3v18M22 3v18" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" fill="none"/>
        </svg>
      );
    case 'blindspot':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM5 11l1.5-4.5h11L19 11H5z"/>
          <circle cx="20" cy="8" r="3" fill="currentColor"/>
        </svg>
      );
    case 'collision':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM5 11l1.5-4.5h11L19 11H5z"/>
          <path d="M12 2l-2 3h4l-2-3z" fill="currentColor"/>
          <path d="M10 2h4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case 'adblue':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z"/>
          <text x="8" y="16" fontSize="6" fontWeight="bold">DEF</text>
        </svg>
      );
    case 'catalytic':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 10h4v4H3v-4zm14 0h4v4h-4v-4zM9 10h6v4H9v-4z"/>
          <path d="M1 12h2M21 12h2" stroke="currentColor" strokeWidth="2"/>
          <path d="M5 8l2 4-2 4M19 8l-2 4 2 4" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
      );
    case 'reducedpower':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <path d="M12 6l-4 6h3v6l4-6h-3V6z"/>
        </svg>
      );
    case 'key':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
        </svg>
      );
    case 'oilchange':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 10.5c0-3.58-3.12-6.5-7-6.5-1.3 0-2.52.35-3.57.95L12 9l-4 4 5 3 1.43-5.72c.77.52 1.37 1.25 1.74 2.09.19.42.33.87.43 1.33-.27-.08-.54-.15-.82-.2-1.11-.22-2.3.22-3.13 1.18-.73.85-.75 2.16-.05 3.04.3.38.7.69 1.16.9.46.21.97.33 1.5.33 1.93 0 3.56-1.45 3.73-3.39.08-.94-.14-1.84-.65-2.57l-.17-.24c.3-.03.59-.05.88-.05.97 0 1.91.18 2.78.5.17-.51.27-1.04.27-1.6 0-.94-.26-1.81-.72-2.55z"/>
          <path d="M3 17h3v4H3z"/>
          <path d="M4.5 21l1.5-2" stroke="currentColor" strokeWidth="1"/>
        </svg>
      );
    case 'bulb':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 017 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
        </svg>
      );
    case 'rearfog':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
          <path d="M17 17h4v2h-4v-2zm-6 0h4v2h-4v-2zm-8 0h4v2H3v-2z"/>
        </svg>
      );
    case 'sport':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <text x="7" y="16" fontSize="8" fontWeight="bold">S</text>
        </svg>
      );
    case 'startstop':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <text x="6" y="16" fontSize="8" fontWeight="bold">A</text>
          <path d="M16 8v8" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case 'fourwd':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          <text x="8" y="12" fontSize="6" fontWeight="bold">4WD</text>
        </svg>
      );
    case 'hillassist':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
          <path d="M2 20l6-8" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 20l6-8" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case 'autohold':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/>
          <text x="5" y="16" fontSize="8" fontWeight="bold">A</text>
          <text x="12" y="16" fontSize="8" fontWeight="bold">H</text>
        </svg>
      );
    case 'evbattery':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
          <path d="M12 8l-3 5h2v4l3-5h-2V8z" fill="white"/>
        </svg>
      );
    case 'charging':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM13 18h-2v-2h2v2zm0-4h-2V9h2v5z"/>
          <path d="M18 10h3v4h-3z"/>
          <path d="M21 11v2" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case 'ready':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <path d="M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
        </svg>
      );
    case 'adaptivecruise':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <path d="M12 6v6l4 2"/>
          <path d="M18 12h3M3 12h3" stroke="currentColor" strokeWidth="1" strokeDasharray="2,1"/>
        </svg>
      );
    default:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      );
  }
};

const categoryInfo = {
  red: {
    name: 'Kırmızı - Acil Dikkat Gerektiren',
    description: 'Bu lambalar ciddi ve potansiyel olarak tehlikeli sorunları gösterir. Aracı güvenli bir yerde durdurun ve profesyonel yardım alın.',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    badgeColor: 'bg-red-100 text-red-700',
  },
  yellow: {
    name: 'Sarı/Turuncu - Dikkat Gerektirir',
    description: 'Bu lambalar acil olmayan ama yakında kontrol edilmesi gereken sorunları gösterir. Dikkatli sürün ve en kısa sürede servise gidin.',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-600',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  green: {
    name: 'Yeşil - Bilgilendirme',
    description: 'Bu lambalar bir sistemin düzgün çalıştığını veya aktif olduğunu gösterir. Sorun bildirmezler.',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    badgeColor: 'bg-green-100 text-green-700',
  },
  blue: {
    name: 'Mavi - Bilgilendirme',
    description: 'Bu lambalar belirli bir özelliğin aktif olduğunu gösterir. Genellikle uzun far gibi fonksiyonlar için kullanılır.',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
};

export default function ArizaLambalariPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredLights = useMemo(() => {
    return warningLights.filter((light) => {
      const matchesSearch =
        light.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        light.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || light.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const groupedLights = useMemo(() => {
    const groups: Record<string, typeof warningLights> = {
      red: [],
      yellow: [],
      green: [],
      blue: [],
    };
    filteredLights.forEach((light) => {
      if (groups[light.category]) {
        groups[light.category].push(light);
      }
    });
    return groups;
  }, [filteredLights]);

  return (
    <div className="bg-secondary-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden" style={{ backgroundColor: '#454545' }}>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/10 rounded-full blur-2xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <Link href="#" className="hover:text-white transition-colors">
              Aracınız
            </Link>
            <span>/</span>
            <span className="text-white">Arıza Lambaları</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Araç Arıza Lambaları
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mb-8">
            Gösterge panelindeki uyarı lambalarının anlamlarını öğrenin. Her sembolün ne anlama geldiğini 
            ve ne yapmanız gerektiğini keşfedin.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Lamba adı veya açıklama ile ara..."
                className="w-full px-6 py-4 pr-12 rounded-xl text-secondary-900 placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-xl text-lg"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                !selectedCategory
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setSelectedCategory('red')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                selectedCategory === 'red'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              Kırmızı (Acil)
            </button>
            <button
              onClick={() => setSelectedCategory('yellow')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                selectedCategory === 'yellow'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              Sarı/Turuncu
            </button>
            <button
              onClick={() => setSelectedCategory('green')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                selectedCategory === 'green'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              Yeşil
            </button>
            <button
              onClick={() => setSelectedCategory('blue')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                selectedCategory === 'blue'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              Mavi
            </button>
          </div>
        </div>
      </section>

      {/* Color Guide */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: '#454545' }}>
            Renk Kodları Rehberi
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(categoryInfo).map(([key, info]) => (
              <div
                key={key}
                className={`${info.bgColor} ${info.borderColor} border-2 rounded-xl p-6 text-center`}
              >
                <div className={`w-16 h-16 ${info.iconColor} mx-auto mb-4 flex items-center justify-center`}>
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2" style={{ color: '#454545' }}>{info.name.split(' - ')[0]}</h3>
                <p className="text-sm text-secondary-600">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warning Lights Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredLights.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-secondary-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Sonuç Bulunamadı</h3>
              <p className="text-secondary-600">"{searchQuery}" için arıza lambası bulunamadı.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedLights).map(([category, lights]) => {
                if (lights.length === 0) return null;
                const info = categoryInfo[category as keyof typeof categoryInfo];
                
                return (
                  <div key={category}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-4 h-4 rounded-full ${
                        category === 'red' ? 'bg-red-500' :
                        category === 'yellow' ? 'bg-amber-500' :
                        category === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <h2 className="text-2xl font-bold" style={{ color: '#454545' }}>
                        {info.name}
                      </h2>
                      <span className={`${info.badgeColor} px-3 py-1 rounded-full text-sm font-medium`}>
                        {lights.length} lamba
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {lights.map((light) => (
                        <div
                          key={light.id}
                          className={`${info.bgColor} ${info.borderColor} border rounded-xl p-6 hover:shadow-lg transition-all duration-300`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`${info.iconColor} flex-shrink-0`}>
                              <WarningIcon type={light.icon} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-2" style={{ color: '#454545' }}>
                                {light.name}
                              </h3>
                              <p className="text-secondary-600 text-sm mb-4">
                                {light.description}
                              </p>
                              <div className={`${info.badgeColor} rounded-lg p-3`}>
                                <p className="text-sm font-medium flex items-start gap-2">
                                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{light.action}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Arıza Lambanız mı Yandı?
          </h2>
          <p className="text-primary-100 mb-6">
            Uyarı lambası yanan aracınız için hemen randevu alın ve profesyonel servis hizmeti alın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/randevu-al"
              className="inline-flex items-center justify-center bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
            >
              Randevu Al
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/obd"
              className="inline-flex items-center justify-center bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors"
            >
              OBD Kodlarını İncele
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: '#454545' }}>
            Sıkça Sorulan Sorular
          </h2>
          
          <div className="space-y-6">
            <div className="bg-secondary-50 rounded-xl p-6">
              <h3 className="font-bold mb-2" style={{ color: '#454545' }}>
                Arıza lambası yandığında ne yapmalıyım?
              </h3>
              <p className="text-secondary-600">
                Öncelikle lambanın rengine bakın. Kırmızı ise aracı güvenli bir yerde durdurun. Sarı/turuncu ise dikkatli sürmeye devam edip en kısa sürede servise gidin. Yeşil veya mavi lambalar bilgilendirme amaçlıdır.
              </p>
            </div>
            
            <div className="bg-secondary-50 rounded-xl p-6">
              <h3 className="font-bold mb-2" style={{ color: '#454545' }}>
                Check Engine lambası yanıp sönüyorsa ne anlama gelir?
              </h3>
              <p className="text-secondary-600">
                Yanıp sönen Check Engine lambası genellikle motor ateşlemesinde ciddi bir sorun olduğunu gösterir. Bu durumda aracı sert kullanmayın ve en kısa sürede servise ulaşın. Katalitik konvertör hasar görebilir.
              </p>
            </div>
            
            <div className="bg-secondary-50 rounded-xl p-6">
              <h3 className="font-bold mb-2" style={{ color: '#454545' }}>
                Birden fazla lamba aynı anda yanarsa ne yapmalıyım?
              </h3>
              <p className="text-secondary-600">
                Birden fazla uyarı lambası aynı anda yanıyorsa, bu genellikle elektrik sistemi veya akü ile ilgili bir soruna işaret eder. Aracı güvenli bir yere çekin ve çekici çağırın. Aracı zorlamayın.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
