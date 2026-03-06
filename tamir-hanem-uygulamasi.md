# TamirHanem: 12 Haftalık MVP Uygulama Rehberi

**Version:** 1.0
**Başlangıç:** Pazartesi, Aralık 23, 2025
**Bitiş:** Cuma, Mart 14, 2026

---

## I. HAFTA BAZLI GÖREVLER

### HAFTA 1-2: Temel Altyapı (Hazırlık)

#### ✅ Backend

**Görev 1: Database Şeması**
```sql
-- Araç Profilleri
CREATE TABLE vehicles (
  id UUID PRIMARY KEY,
  user_id UUID,
  plate VARCHAR(8) UNIQUE,
  chassis_number VARCHAR(17),
  brand VARCHAR(50),
  model VARCHAR(50),
  year INT,
  color VARCHAR(50),
  vehicle_type ENUM('hususi', 'ticari', 'kamyonet'),
  first_registration DATE,
  mileage INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Bakım Geçmişi
CREATE TABLE maintenance_records (
  id UUID PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles,
  service_id UUID REFERENCES services,
  service_type VARCHAR(100),
  cost DECIMAL(10, 2),
  mileage INT,
  date DATE,
  notes TEXT,
  images VARCHAR[],
  created_at TIMESTAMP
);

-- Muayene Tarihleri (TÜVTÜRK)
CREATE TABLE inspection_reminders (
  id UUID PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles,
  scheduled_date DATE,
  notification_sent BOOLEAN,
  status ENUM('pending', 'completed', 'overdue'),
  created_at TIMESTAMP
);

-- Servis İşletmeleri
CREATE TABLE services (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  phone VARCHAR(15),
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  city VARCHAR(50),
  opening_hours JSON,
  rating DECIMAL(3, 2),
  service_types VARCHAR[],
  created_at TIMESTAMP
);

-- Yorumlar
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  service_id UUID REFERENCES services,
  user_id UUID,
  rating INT,
  comment TEXT,
  service_type VARCHAR(100),
  photos VARCHAR[],
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP
);
```

**Dosya Konumu:** `/backend/db/schema.sql`
**Zaman:** 2 saat
**Kontrol:** ERD diyagramı (Lucidchart)

---

**Görev 2: API Yapısı (Express.js)**
```typescript
// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import vehicleRoutes from './routes/vehicles';
import serviceRoutes from './routes/services';
import maintenanceRoutes from './routes/maintenance';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/maintenance', maintenanceRoutes);

app.listen(3000, () => {
  console.log('TamirHanem API başladı: http://localhost:3000');
});
```

**Dosya Konumu:** `/backend/src/server.ts`
**Zaman:** 2 saat
**Framework:** Express.js + TypeScript

---

#### ✅ Frontend

**Görev 3: React Project Kurulması**
```bash
npm create vite@latest tamir-hanem-frontend -- --template react-ts
cd tamir-hanem-frontend
npm install
npm install react-router-dom axios zustand leaflet react-leaflet
npm run dev
```

**Dosya Konumu:** `/frontend/`
**Zaman:** 1 saat

---

**Görev 4: Component Yapısı**
```
frontend/src/
├── components/
│   ├── VehicleForm.tsx          (Araç ekleme)
│   ├── VehicleList.tsx          (Araçlarım listesi)
│   ├── MaintenanceCalendar.tsx  (Bakım takvimi)
│   ├── ServiceMap.tsx           (Servis haritası)
│   └── ReviewSection.tsx        (Yorumlar)
├── pages/
│   ├── Dashboard.tsx
│   ├── Services.tsx
│   ├── Maintenance.tsx
│   └── Settings.tsx
├── hooks/
│   ├── useVehicles.ts
│   ├── useServices.ts
│   └── useMaintenance.ts
├── store/
│   └── appStore.ts              (Zustand)
└── styles/
    └── global.css               (Tailwind)
```

**Dosya Konumu:** `/frontend/src/`
**Zaman:** 2 saat

---

#### ✅ DevOps

**Görev 5: Docker & .env**
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

```bash
# .env.example
DATABASE_URL=postgresql://user:password@localhost:5432/tamir_hanem
API_PORT=3000
FRONTEND_PORT=5173
GOOGLE_MAPS_API_KEY=xxx
JWT_SECRET=xxx
```

**Dosya Konumu:** `/Dockerfile`, `/.env.example`
**Zaman:** 1 saat

---

#### 📋 Hafta 1-2 Tamamlanma Kontrol Listesi

```
BACKEND:
[ ] PostgreSQL kurulu ve çalışıyor
[ ] Database şeması oluşturuldu
[ ] API sunucusu başlıyor (localhost:3000)
[ ] CORS konfigürasyonu yapıldı
[ ] JWT auth yapısı hazır (placeholder)

FRONTEND:
[ ] Vite + React + TypeScript kuruldu
[ ] Components klasörü oluşturuldu
[ ] Zustand store hazır
[ ] Tailwind CSS entegre
[ ] npm run dev çalışıyor

DEVOPS:
[ ] Docker compose yazıldı
[ ] .env dosyası örneği oluşturuldu
[ ] Git repo hazırlandı
[ ] README.md yazıldı
```

---

### HAFTA 3-4: İlk Feature - Araç Profili + Muayene Hatırlatması

#### ✅ Backend

**Görev 1: Vehicle Controller**
```typescript
// backend/src/controllers/vehicleController.ts
import { Request, Response } from 'express';
import Vehicle from '../models/Vehicle';

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const { userId, plate, chassisNumber, brand, model, year } = req.body;

    const vehicle = await Vehicle.create({
      user_id: userId,
      plate,
      chassis_number: chassisNumber,
      brand,
      model,
      year,
      first_registration: new Date(),
      mileage: 0
    });

    // TÜVTÜRK muayene takvimi hesapla
    const nextInspectionDate = calculateNextInspection(vehicle);

    res.status(201).json({
      success: true,
      data: vehicle,
      nextInspection: nextInspectionDate
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const calculateNextInspection = (vehicle: any) => {
  // Hususi araçlar: İlk 3 yıl muaf, sonra 2 yılda 1
  const years = new Date().getFullYear() - vehicle.year;

  if (years <= 3) {
    return new Date(vehicle.first_registration).addYears(3);
  } else {
    // Periyodik
    const lastInspection = vehicle.last_inspection_date || vehicle.first_registration;
    return new Date(lastInspection).addYears(2);
  }
};

export const getVehicles = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const vehicles = await Vehicle.findAll({ where: { user_id: userId } });
  res.json({ success: true, data: vehicles });
};

export const updateVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await Vehicle.update(req.body, { where: { id } });
  res.json({ success: true, data: updated });
};

export const deleteVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Vehicle.destroy({ where: { id } });
  res.json({ success: true, message: 'Araç silindi' });
};
```

**Dosya Konumu:** `/backend/src/controllers/vehicleController.ts`
**Zaman:** 4 saat
**Test:** Postman koleksiyonu

---

**Görev 2: Muayene Hatırlatması Service**
```typescript
// backend/src/services/inspectionService.ts
import cron from 'node-cron';
import nodemailer from 'nodemailer';

export const scheduleInspectionReminders = () => {
  // Her gün saat 08:00 kontrol et
  cron.schedule('0 8 * * *', async () => {
    try {
      const reminders = await InspectionReminder.findAll({
        where: {
          scheduled_date: new Date(),
          notification_sent: false
        }
      });

      for (const reminder of reminders) {
        const vehicle = await Vehicle.findByPk(reminder.vehicle_id);
        const user = await User.findByPk(vehicle.user_id);

        // SMS Gönder (Twilio)
        await sendSMS(
          user.phone,
          `${vehicle.brand} ${vehicle.model} muayene tarihi yaklaştı. Randevu al: tamir-hanem.com`
        );

        // Email Gönder
        await sendEmail(
          user.email,
          'Araç Muayene Hatırlatması',
          `Aracınız muayenesi gerekiyor. Platform üzerinden servis bulun.`
        );

        // Bildirim güncelle
        await reminder.update({ notification_sent: true });
      }
    } catch (error) {
      console.error('Muayene hatırlatması hatası:', error);
    }
  });
};

async function sendSMS(phone: string, message: string) {
  const twilio = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  await twilio.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to: phone
  });
}

async function sendEmail(email: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: 'noreply@tamir-hanem.com',
    to: email,
    subject,
    html
  });
}
```

**Dosya Konumu:** `/backend/src/services/inspectionService.ts`
**Zaman:** 3 saat
**Kütüphane:** node-cron, twilio, nodemailer

---

#### ✅ Frontend

**Görev 3: Araç Ekleme Formu**
```typescript
// frontend/src/components/VehicleForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useVehicleStore } from '../store/appStore';

export const VehicleForm: React.FC = () => {
  const [formData, setFormData] = useState({
    plate: '',
    chassisNumber: '',
    brand: '',
    model: '',
    year: new Date().getFullYear()
  });

  const { addVehicle } = useVehicleStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/vehicles', {
        userId: localStorage.getItem('userId'),
        ...formData
      });

      if (response.data.success) {
        addVehicle(response.data.data);
        setFormData({
          plate: '',
          chassisNumber: '',
          brand: '',
          model: '',
          year: new Date().getFullYear()
        });
        alert('Araç eklendi! Muayene tarihi: ' + response.data.nextInspection);
      }
    } catch (error) {
      alert('Hata: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Araç Ekle</h2>

      <input
        type="text"
        placeholder="Plaka (e.g., 34ABC123)"
        value={formData.plate}
        onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
        className="w-full p-2 border rounded mb-3"
        required
      />

      <input
        type="text"
        placeholder="Şasi Numarası"
        value={formData.chassisNumber}
        onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
        className="w-full p-2 border rounded mb-3"
      />

      <input
        type="text"
        placeholder="Marka (e.g., Toyota)"
        value={formData.brand}
        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
        className="w-full p-2 border rounded mb-3"
        required
      />

      <input
        type="text"
        placeholder="Model (e.g., Corolla)"
        value={formData.model}
        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
        className="w-full p-2 border rounded mb-3"
        required
      />

      <input
        type="number"
        placeholder="Üretim Yılı"
        value={formData.year}
        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
        className="w-full p-2 border rounded mb-3"
        min="1990"
        max={new Date().getFullYear()}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700"
      >
        Araç Ekle
      </button>
    </form>
  );
};
```

**Dosya Konumu:** `/frontend/src/components/VehicleForm.tsx`
**Zaman:** 3 saat
**Test:** Formu doldur, veritabanına kaydedil

---

**Görev 4: Bakım Takvimi Görünümü**
```typescript
// frontend/src/components/MaintenanceCalendar.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface InspectionReminder {
  id: string;
  vehicle_id: string;
  scheduled_date: string;
  status: 'pending' | 'completed' | 'overdue';
  vehicle: {
    brand: string;
    model: string;
  };
}

export const MaintenanceCalendar: React.FC = () => {
  const [reminders, setReminders] = useState<InspectionReminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`/api/maintenance/reminders/${userId}`);
        setReminders(response.data.data);
      } catch (error) {
        console.error('Hatırlatmaları yüklerken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Bakım Takvimi</h2>

      {reminders.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded text-center">
          <p>Kayıtlı araçınız yok. Araç ekleyin.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reminders.map((reminder) => {
            const date = new Date(reminder.scheduled_date);
            const today = new Date();
            const daysLeft = Math.ceil(
              (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );

            let statusColor = 'green';
            if (daysLeft < 0) statusColor = 'red';
            if (daysLeft < 30) statusColor = 'yellow';

            return (
              <div
                key={reminder.id}
                className={`p-4 rounded border-l-4 border-${statusColor}-500 bg-${statusColor}-50`}
              >
                <h3 className="font-bold">
                  {reminder.vehicle.brand} {reminder.vehicle.model}
                </h3>
                <p className="text-sm text-gray-600">
                  Muayene Tarihi: {date.toLocaleDateString('tr-TR')}
                </p>
                <p className={`text-sm font-bold text-${statusColor}-600`}>
                  {daysLeft > 0 ? `${daysLeft} gün kaldı` : `${Math.abs(daysLeft)} gün gecikti`}
                </p>
                <button className="mt-2 bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700">
                  Servis Bul
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
```

**Dosya Konumu:** `/frontend/src/components/MaintenanceCalendar.tsx`
**Zaman:** 3 saat

---

#### 📋 Hafta 3-4 Tamamlanma Kontrol Listesi

```
BACKEND:
[ ] Vehicle controller yazıldı (CRUD)
[ ] Vehicle routes tanımlandı
[ ] Muayene tarihi hesaplama algoritması çalışıyor
[ ] InspectionService cron job kuruldu
[ ] SMS/Email gönderimi test edildi
[ ] API Postman'de test edildi

FRONTEND:
[ ] VehicleForm component yazıldı
[ ] MaintenanceCalendar component yazıldı
[ ] Zustand store entegre
[ ] Form submission çalışıyor
[ ] Muayene listesi görüntüleniyor
[ ] Responsif tasarım uygulandı

ENTEGRASYON:
[ ] Frontend -> Backend bağlantısı çalışıyor
[ ] Veritabanı kayıtları oluşturuluyor
[ ] Muayene hatırlatma zamanlandı
[ ] QA test edildi
```

---

### HAFTA 5-6: Servis Bulma + Harita

#### ✅ Backend

**Görev 1: Servis Controller + Harita API**
```typescript
// backend/src/controllers/serviceController.ts
import { Request, Response } from 'express';
import Service from '../models/Service';
import { sequelize } from '../db';

export const searchServices = async (req: Request, res: Response) => {
  try {
    const {
      latitude,
      longitude,
      radius = 5, // km
      serviceType,
      minRating = 0
    } = req.query;

    // Harita sorgusu (PostGIS yakınlığı)
    const services = await sequelize.query(`
      SELECT
        *,
        ST_Distance(
          location,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)
        ) * 111 AS distance_km
      FROM services
      WHERE
        ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint($1, $2), 4326),
          $3 / 111.0
        )
        AND rating >= $4
        ${serviceType ? 'AND service_types @> ARRAY[$5]' : ''}
      ORDER BY distance_km ASC
      LIMIT 50
    `, {
      bind: [longitude, latitude, radius, minRating, ...(serviceType ? [serviceType] : [])]
    });

    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getServiceDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id, {
      include: ['reviews']
    });

    if (!service) {
      return res.status(404).json({ success: false, error: 'Servis bulunamadı' });
    }

    res.json({
      success: true,
      data: service,
      avgRating: service.reviews?.reduce((sum, r) => sum + r.rating, 0) / service.reviews?.length || 0
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

**Dosya Konumu:** `/backend/src/controllers/serviceController.ts`
**Zaman:** 3 saat
**Kütüphane:** PostGIS (PostgreSQL uzantısı)

---

**Görev 2: Servis Verisi Import**
```typescript
// backend/scripts/importServices.ts
import axios from 'axios';
import Service from '../models/Service';

export const importServicesFromArmut = async () => {
  // Armut'tan web scraping veya API'den veriler çek
  // (Redacted: Yasalı veri toplama yöntemi gereklidir)

  const manualServices = [
    {
      name: 'ABC Oto Servis',
      address: 'Şişli, İstanbul',
      latitude: 41.0846,
      longitude: 28.9953,
      phone: '0212 XXX XXXX',
      city: 'İstanbul',
      serviceTypes: ['Motor yağı', 'Fren', 'Lastik'],
      openingHours: { mon: '08:00-18:00', tue: '08:00-18:00' }
    },
    // ... 500+ daha fazla
  ];

  for (const svc of manualServices) {
    await Service.create({
      ...svc,
      location: sequelize.where(
        sequelize.fn(
          'ST_GeomFromText',
          `POINT(${svc.longitude} ${svc.latitude})`,
          4326
        )
      )
    });
  }

  console.log('Servisler içe aktarıldı');
};

// SEED DATA: İlk 5 test şehir
const testServices = [
  // İstanbul
  { name: 'Kartal Oto', city: 'İstanbul', lat: 40.9, lng: 29.1 },
  // Ankara
  { name: 'Ankara Servis', city: 'Ankara', lat: 39.9, lng: 32.8 },
  // İzmir
  { name: 'İzmir Bakım', city: 'İzmir', lat: 38.4, lng: 27.1 },
  // Bursa
  { name: 'Bursa Oto', city: 'Bursa', lat: 40.2, lng: 29.0 },
  // Gaziantep
  { name: 'Gaziantep Servis', city: 'Gaziantep', lat: 37.0, lng: 37.3 }
];
```

**Dosya Konumu:** `/backend/scripts/importServices.ts`
**Zaman:** 4 saat
**Not:** Yasalı veri kaynakları (Armut API, manuel giriş)

---

#### ✅ Frontend

**Görev 3: Servis Harita Görünümü**
```typescript
// frontend/src/components/ServiceMap.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

interface Service {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  phone: string;
  address: string;
  rating: number;
  distance: number;
}

export const ServiceMap: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number]>([41.0, 29.0]);
  const [serviceType, setServiceType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/services/search', {
        params: {
          latitude: userLocation[0],
          longitude: userLocation[1],
          serviceType,
          radius: 10
        }
      });
      setServices(response.data.data);
    } catch (error) {
      console.error('Servis araması hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    popupAnchor: [1, -34]
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 flex gap-2">
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="flex-1 p-2 border rounded"
        >
          <option value="">Hizmet Türü Seç</option>
          <option value="Motor yağı">Motor yağı değişimi</option>
          <option value="Fren">Fren servisi</option>
          <option value="Lastik">Lastik değişimi</option>
          <option value="Genel bakım">Genel bakım</option>
        </select>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Aranıyor...' : 'Bul'}
        </button>
      </div>

      <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Kullanıcı konumu */}
        <Marker position={userLocation} icon={customIcon}>
          <Popup>Benim Konumum</Popup>
        </Marker>

        {/* Servisler */}
        {services.map((service) => (
          <Marker key={service.id} position={[service.latitude, service.longitude]}>
            <Popup>
              <div className="text-sm">
                <h4 className="font-bold">{service.name}</h4>
                <p className="text-gray-600">{service.distance.toFixed(2)} km uzak</p>
                <p className="text-yellow-500">★ {service.rating.toFixed(1)}</p>
                <p className="text-gray-600">{service.address}</p>
                <a href={`tel:${service.phone}`} className="text-blue-600 underline block mt-1">
                  {service.phone}
                </a>
                <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                  Randevu Al
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Yakındaki Servisler ({services.length})</h3>
        <div className="space-y-2">
          {services.slice(0, 10).map((service) => (
            <div key={service.id} className="p-3 bg-white border rounded hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold">{service.name}</h4>
                  <p className="text-sm text-gray-600">{service.address}</p>
                  <p className="text-sm text-yellow-500">★ {service.rating.toFixed(1)}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600 font-bold">{service.distance.toFixed(2)} km</p>
                  <a href={`tel:${service.phone}`} className="text-blue-600 text-sm">
                    Ara
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

**Dosya Konumu:** `/frontend/src/components/ServiceMap.tsx`
**Zaman:** 4 saat
**Kütüphane:** react-leaflet, leaflet

---

**Görev 4: Servis Detay Sayfası**
```typescript
// frontend/src/pages/ServiceDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface ServiceDetail {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  reviews: any[];
  openingHours: any;
}

export const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`/api/services/${serviceId}`);
        setService(response.data.data);
      } catch (error) {
        console.error('Servis yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  if (loading) return <div>Yükleniyor...</div>;
  if (!service) return <div>Servis bulunamadı</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
      <p className="text-gray-600 mb-4">{service.address}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-sm text-gray-600">Puanı</p>
          <p className="text-2xl font-bold text-yellow-500">★ {service.rating.toFixed(1)}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-sm text-gray-600">Yorum Sayısı</p>
          <p className="text-2xl font-bold">{service.reviews?.length || 0}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Açılış Saatleri</h2>
        <ul className="text-sm space-y-1">
          {Object.entries(service.openingHours || {}).map(([day, hours]) => (
            <li key={day}>
              <span className="capitalize font-semibold">{day}:</span> {hours as string}
            </li>
          ))}
        </ul>
      </div>

      <a
        href={`tel:${service.phone}`}
        className="w-full bg-green-600 text-white py-3 rounded font-bold text-center hover:bg-green-700 inline-block"
      >
        {service.phone} - ARA
      </a>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Müşteri Yorumları</h2>
        {service.reviews && service.reviews.length > 0 ? (
          <div className="space-y-4">
            {service.reviews.map((review) => (
              <div key={review.id} className="border rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold">{review.user?.name || 'Anonim'}</p>
                  <p className="text-yellow-500">★ {review.rating}/5</p>
                </div>
                <p className="text-sm text-gray-600">{review.service_type}</p>
                <p className="text-sm mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Henüz yorum yok</p>
        )}
      </div>
    </div>
  );
};
```

**Dosya Konumu:** `/frontend/src/pages/ServiceDetail.tsx`
**Zaman:** 3 saat

---

#### 📋 Hafta 5-6 Tamamlanma Kontrol Listesi

```
BACKEND:
[ ] Service controller yazıldı (search, detail)
[ ] PostGIS harita sorgusu çalışıyor
[ ] Service importları tamamlandı (5 şehir)
[ ] Routes tanımlandı
[ ] API test edildi

FRONTEND:
[ ] ServiceMap component yazıldı
[ ] Leaflet harita entegre
[ ] Servis arama çalışıyor
[ ] ServiceDetail sayfası hazır
[ ] Randevu al buttonu (placeholder)
[ ] Responsif tasarım

ENTEGRASYON:
[ ] Harita gerçek verileri gösteriyor
[ ] Yakındaki servisler listesi gösteriliyor
[ ] Telefon araması çalışıyor
[ ] QA test edildi
```

---

## II. HAFTA 7-8: Yorum Sistemi

### ✅ Backend

**Görev 1: Review Controller**
```typescript
// backend/src/controllers/reviewController.ts
export const createReview = async (req: Request, res: Response) => {
  try {
    const { serviceId, userId, rating, comment, serviceType, photos } = req.body;

    const review = await Review.create({
      service_id: serviceId,
      user_id: userId,
      rating,
      comment,
      service_type: serviceType,
      photos: photos || [],
      helpful_count: 0
    });

    // Servis puanını güncelle
    await updateServiceRating(serviceId);

    res.status(201).json({
      success: true,
      data: review,
      message: 'Yorum başarıyla eklendi'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

async function updateServiceRating(serviceId: string) {
  const reviews = await Review.findAll({ where: { service_id: serviceId } });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await Service.update(
    { rating: Math.round(avgRating * 10) / 10 },
    { where: { id: serviceId } }
  );
}
```

---

### ✅ Frontend

**Görev 2: Review Component**
```typescript
// frontend/src/components/ReviewSection.tsx
export const ReviewSection: React.FC<{ serviceId: string }> = ({ serviceId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [reviews, setReviews] = useState([]);

  const handleSubmit = async () => {
    await axios.post('/api/reviews', {
      serviceId,
      userId: localStorage.getItem('userId'),
      rating,
      comment,
      serviceType
    });
    setComment('');
    setRating(5);
    // Yorum listesini yenile
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Yorum Yaz</h2>
      {/* Form */}
      <div className="bg-white p-4 rounded border mb-6">
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="">Hizmet Türü Seç</option>
          <option value="Motor yağı">Motor yağı değişimi</option>
          <option value="Fren">Fren servisi</option>
          <option value="Lastik">Lastik değişimi</option>
        </select>

        <div className="mb-3">
          <label className="block text-sm font-bold mb-2">Puanla (1-5)</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                onClick={() => setRating(r)}
                className={`w-10 h-10 rounded ${
                  rating >= r ? 'bg-yellow-500' : 'bg-gray-200'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Deneyiminizi anlatın..."
          className="w-full p-2 border rounded mb-3"
          rows={4}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Yorum Gönder
        </button>
      </div>

      {/* Yorum Listesi */}
      {reviews.map((review) => (
        <div key={review.id} className="border rounded p-4 mb-3">
          <div className="flex justify-between mb-2">
            <p className="font-semibold">{review.user.name}</p>
            <p className="text-yellow-500">★ {review.rating}/5</p>
          </div>
          <p className="text-sm text-gray-600 mb-2">{review.service_type}</p>
          <p className="text-sm mb-2">{review.comment}</p>
          <button className="text-sm text-blue-600">
            👍 Faydalı ({review.helpful_count})
          </button>
        </div>
      ))}
    </div>
  );
};
```

---

#### 📋 Hafta 7-8 Tamamlanma Kontrol Listesi

```
BACKEND:
[ ] Review controller yazıldı
[ ] Moderasyon sistemi (placeholder)
[ ] Fake review detection başlandı
[ ] Routes tanımlandı
[ ] API test edildi

FRONTEND:
[ ] ReviewSection component yazıldı
[ ] Rating seçimi çalışıyor
[ ] Form submission çalışıyor
[ ] Yorum listesi gösteriliyor
[ ] Yardımcı butonu (upvote) çalışıyor

QA:
[ ] Yorum oluşturulabiliyor
[ ] Servis puanı güncelleniyor
[ ] Moderasyon kontrolü yapılıyor
```

---

## III. HAFTA 9-10: Servis Dashboard (Backend Revenue)

### ✅ Backend

**Görev 1: Servis Auth + Dashboard**
```typescript
// backend/src/controllers/serviceAuthController.ts
export const registerService = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, latitude, longitude, city, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const service = await Service.create({
      name,
      email,
      phone,
      address,
      latitude,
      longitude,
      city,
      password: hashedPassword,
      status: 'pending' // Admin onayı bekle
    });

    const token = jwt.sign({ serviceId: service.id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(201).json({
      success: true,
      data: service,
      token,
      message: 'Profil oluşturuldu, yönetici onayı bekleniyoruz'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getServiceDashboard = async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findByPk(serviceId, {
      include: [
        { association: 'demands', include: ['vehicle', 'user'] },
        { association: 'reviews' }
      ]
    });

    const thisMonth = new Date();
    thisMonth.setDate(1);

    const demandStats = {
      thisMonth: service.demands.filter(
        (d) => new Date(d.created_at) >= thisMonth
      ).length,
      thisWeek: service.demands.filter(
        (d) => new Date(d.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      total: service.demands.length
    };

    const revenue = service.subscription_plan ? {
      plan: service.subscription_plan,
      cost: { free: 0, premium: 299, super_premium: 499 }[service.subscription_plan],
      renewalDate: new Date(service.subscription_renewal)
    } : null;

    res.json({
      success: true,
      data: {
        service,
        demands: service.demands,
        stats: demandStats,
        rating: service.rating,
        reviews: service.reviews,
        revenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateServiceProfile = async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;
    const { name, phone, address, openingHours, serviceTypes } = req.body;

    const updated = await Service.update(
      { name, phone, address, opening_hours: openingHours, service_types: serviceTypes },
      { where: { id: serviceId }, returning: true }
    );

    res.json({ success: true, data: updated[1][0] });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
```

---

#### 📋 Hafta 9-10 Tamamlanma Kontrol Listesi

```
BACKEND:
[ ] Service auth yazıldı (register/login)
[ ] JWT token oluşturuluyor
[ ] Dashboard API hazır (stats, demands)
[ ] Profile update endpoint
[ ] Subscription yönetimi (placeholder)

QA:
[ ] Servis kaydı çalışıyor
[ ] Login işlemi başarılı
[ ] Dashboard verileri görüntüleniyor
```

---

## IV. HAFTA 11-12: Ön Lansman + İlk Kullanıcılar

### ✅ Marketing

**Görev 1: Landing Page**
```typescript
// frontend/src/pages/Landing.tsx
export const Landing: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-900 text-white">
      <header className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-4">TamirHanem</h1>
        <p className="text-xl mb-8">Aracınızın sağlığını takip edin, güvenilir servisleri bulun</p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
          Hemen Başla
        </button>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-3 gap-6">
        <div className="bg-white text-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Bakım Takibi</h3>
          <p>Tüm bakım geçmişi ve muayene tarihleri otomatik olarak hatırlatılır</p>
        </div>
        <div className="bg-white text-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Servis Bulma</h3>
          <p>Harita üzerinde yakındaki güvenilir servisleri bulun ve yorum okuyun</p>
        </div>
        <div className="bg-white text-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Adil Fiyat</h3>
          <p>Servis fiyatlarının adil olup olmadığını anında kontrol edin</p>
        </div>
      </section>
    </div>
  );
};
```

---

**Görev 2: İlk 100 Servis Kazanımı**
- WhatsApp: "TamirHanem'e katıl, 3 ay ücretsiz"
- Instagram: İlk 5 post (araç bakım ipuçları)
- Facebook Ads: ₺5.000 bütçe

---

## V. KRİTİK BAŞARIŞIZLIK KONTROL LİSTESİ

```
YAPILMAMASI GEREKENLER:

[ ] Rabam'ı kopyalamak (pickup/dropoff)
    ✓ Marketplace finder kalın (Armut-style)

[ ] Hiç fiyat modeli olmaksızın başlamak
    ✓ Servisler: Premium ₺299/ay

[ ] Fake yorum izni
    ✓ Moderasyon team oluştur (haftalık)

[ ] Veri gizliliği ihlaline gelmek
    ✓ KVKK compliance (bkz. legal/privacy.md)

[ ] Coğrafi sınırlama (sadece İstanbul)
    ✓ 5 şehir MVP, haftalık birer ekle
```

---

## VI. MVP BAŞARISI KRİTERLERİ

**Hafta 12'nin Sonunda (Mart 14, 2026)**

```
KULLANICILAR:
├─ Kaydı yapan araç sahiplerine: 5.000+
├─ Aktif araçlar: 3.000+
├─ Muayene hatırlatmaları gönderilen: 1.000+
└─ NPS: 50+

SERVİSLER:
├─ Kayıtlı servisler: 500+
├─ Premium abonelik başlayan: 50+ (10%)
├─ Talep alan servisler: 200+
└─ Ortalama yorum puanı: 4.2/5

İŞLEMLER:
├─ Aylık aktif işlemler: 1.500+
├─ Servis harita araması: 3.000+/ay
├─ Muayene hatırlatması tıklanması: 500+/ay
└─ İlk randevu: 100+

GELİR:
├─ Abonelik geliri (Premium): ₺15.000/ay
├─ Lead kesintisi: ₺5.000/ay
├─ Reklam: ₺2.000/ay
└─ Toplam: ₺22.000/ay

---

SONRAKI ADIMlar (13-26. Hafta):
├─ Fiyat Estimatörü
├─ OBD entegrasyonu
├─ DIY content
└─ Series A hazırlığı
```

---

**BAŞLAMAYA HAZIR!**

1. Bu rehberi ekibe dağıt
2. Haftalık senkronizasyonlar planla
3. İlk veritabanı migration'ını çalıştır
4. Landing page'i canlıya al
5. İlk 20 servis ile iletişime geç

**Şanslar senin tarafında, başla!** 🚀

