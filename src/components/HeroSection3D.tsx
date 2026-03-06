'use client';

import { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, useGLTF, Center, Html } from '@react-three/drei';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
// Optimized Three.js imports - only import what's needed for tree-shaking
import { Group } from 'three';
import type { Group as GroupType } from 'three';
import { Icon } from './ui/Icons';

// Parça verileri
interface CarPart {
  id: string;
  name: string;
  description: string;
  href: string;
  color: string;
  icon: string;
  details: string[];
  priceRange: string;
}

// Site's primary yellow color
const SITE_YELLOW = '#FBC91D';

const carParts: CarPart[] = [
  {
    id: 'motor',
    name: 'Motor',
    description: 'Motor bakım & onarım',
    href: '/servisler?category=motor-bakim',
    color: SITE_YELLOW,
    icon: 'motor',
    details: ['Yağ değişimi', 'Triger kayışı', 'Motor revizyonu', 'Conta değişimi'],
    priceRange: '',
  },
  {
    id: 'fren',
    name: 'Fren',
    description: 'Fren sistemi servisi',
    href: '/servisler?category=fren',
    color: SITE_YELLOW,
    icon: 'fren',
    details: ['Balata değişimi', 'Disk tornalama', 'Fren hidroliği', 'ABS tamiri'],
    priceRange: '',
  },
  {
    id: 'lastik',
    name: 'Lastik',
    description: 'Lastik değişim & balans',
    href: '/servisler?category=lastik',
    color: SITE_YELLOW,
    icon: 'lastik',
    details: ['Lastik değişimi', 'Balans ayarı', 'Rot balans', 'Jant düzeltme'],
    priceRange: '',
  },
  {
    id: 'elektrik',
    name: 'Far & Elektrik',
    description: 'Elektrik & aydınlatma',
    href: '/servisler?category=elektrik',
    color: SITE_YELLOW,
    icon: 'elektrik',
    details: ['Akü değişimi', 'Far ayarı', 'Kablo tamiri', 'Sensör değişimi'],
    priceRange: '',
  },
  {
    id: 'karoser',
    name: 'Kaporta & Boya',
    description: 'Boya & kaporta',
    href: '/servisler?category=kaporta',
    color: SITE_YELLOW,
    icon: 'karoser',
    details: ['Boya işlemi', 'Göçük düzeltme', 'Çizik giderme', 'Parça değişimi'],
    priceRange: '',
  },
  {
    id: 'egzoz',
    name: 'Egzoz',
    description: 'Egzoz sistemi',
    href: '/servisler?category=egzoz',
    color: SITE_YELLOW,
    icon: 'egzoz',
    details: ['Egzoz değişimi', 'Susturucu tamiri', 'Katalitik konvertör', 'Sızıntı onarımı'],
    priceRange: '',
  },
  {
    id: 'cam',
    name: 'Cam',
    description: 'Oto cam servisi',
    href: '/servisler?category=cam',
    color: SITE_YELLOW,
    icon: 'cam',
    details: ['Ön cam değişimi', 'Cam filmi', 'Cam tamiri', 'Ayna değişimi'],
    priceRange: '',
  },
  {
    id: 'klima',
    name: 'Klima',
    description: 'Klima bakım & onarım',
    href: '/servisler?category=klima',
    color: SITE_YELLOW,
    icon: 'klima',
    details: ['Klima gazı dolumu', 'Klima temizliği', 'Kompresör tamiri', 'Kalorifer tamiri'],
    priceRange: '',
  },
  {
    id: 'suspansiyon',
    name: 'Süspansiyon',
    description: 'Amortisör & süspansiyon',
    href: '/servisler?category=suspansiyon',
    color: SITE_YELLOW,
    icon: 'suspansiyon',
    details: ['Amortisör değişimi', 'Helezon yay', 'Rotil değişimi', 'Salıncak tamiri'],
    priceRange: '',
  },
  {
    id: 'sanziman',
    name: 'Şanzıman',
    description: 'Vites & şanzıman',
    href: '/servisler?category=sanziman',
    color: SITE_YELLOW,
    icon: 'sanziman',
    details: ['Debriyaj seti', 'Şanzıman yağı', 'Vites tamiri', 'Diferansiyel'],
    priceRange: '',
  },
  {
    id: 'direksiyon',
    name: 'Direksiyon',
    description: 'Direksiyon sistemi',
    href: '/servisler?category=direksiyon',
    color: SITE_YELLOW,
    icon: 'direksiyon',
    details: ['Direksiyon kutusu', 'Hidrolik direksiyon', 'Rot kolu', 'Direksiyon pompası'],
    priceRange: '',
  },
  {
    id: 'icmekan',
    name: 'İç Mekan',
    description: 'İç temizlik & döşeme',
    href: '/servisler?category=ic-mekan',
    color: SITE_YELLOW,
    icon: 'icmekan',
    details: ['Detaylı temizlik', 'Koltuk döşeme', 'Tavan döşeme', 'Torpido tamiri'],
    priceRange: '',
  },
];

// Quick action buttons - from menu
const quickActions = [
  { id: 'servis', label: 'Servis Bul', icon: 'search', href: '/servisler', color: SITE_YELLOW },
  { id: 'randevu', label: 'Randevu Al', icon: 'calendar', href: '/randevu-al', color: '#3B82F6' },
  { id: 'fiyat', label: 'Fiyat Hesapla', icon: 'money', href: '/fiyat-hesapla', color: '#10B981' },
  { id: 'arac-deger', label: 'Araç Değeri', icon: 'car', href: '/arac-degeri', color: '#F59E0B' },
  { id: 'asistan', label: 'AI Asistan', icon: 'robot', href: '/ai/ariza-tespit', color: '#8B5CF6' },
  { id: 'sohbet', label: 'AI Sohbet', icon: 'chat', href: '/ai/sohbet', color: '#EC4899' },
  { id: 'obd', label: 'OBD Kodları', icon: 'chart', href: '/obd', color: '#06B6D4' },
  { id: 'karsilastir', label: 'Araç Karşılaştır', icon: 'compare', href: '/karsilastirma/olustur', color: '#EF4444' },
  { id: 'ariza-rehber', label: 'Arıza Rehberi', icon: 'wrench', href: '/ariza-rehberi', color: '#F97316' },
  { id: 'bakim', label: 'Bakım Planlama', icon: 'clipboard', href: '/bakim-planlama', color: '#84CC16' },
];

// Menu items from Header - Araç Bilgileri
const menuItemsArac = [
  { id: 'genel-bakis', label: 'Aracınıza Genel Bakış', icon: 'car', href: '/arac/genel-bakis', color: '#3B82F6' },
  { id: 'bakim-tavsiyeleri', label: 'Araç Bakımı Tavsiyeleri', icon: 'elektrik', href: '/arac/bakim-tavsiyeleri', color: '#10B981' },
  { id: 'ansiklopedi', label: 'Araç Ansiklopedisi', icon: 'book', href: '/arac/ansiklopedi', color: '#8B5CF6' },
  { id: 'yedek-parca', label: 'Parça Kütüphanesi', icon: 'bolt', href: '/arac/yedek-parca', color: '#F59E0B' },
  { id: 'lastik-secimi', label: 'Lastik Seçimi', icon: 'lastik', href: '/arac/lastik-secimi', color: '#6366F1' },
  { id: 'ariza-lambalari', label: 'Araç Arıza Lambaları', icon: 'alert', href: '/arac/ariza-lambalari', color: '#EF4444' },
  { id: 'kronik-sorunlar', label: 'Kronik Sorunlar', icon: 'warning', href: '/kronik-sorunlar', color: '#F97316' },
  { id: 'forum', label: 'Forum', icon: 'forum', href: '/forum', color: '#06B6D4' },
];

// Menu items from Header - Araç Rehberi
const menuItemsRehber = [
  { id: 'incelemeler', label: 'Araba İncelemeleri', icon: 'review', href: '/incelemeler', color: '#EC4899' },
  { id: 'karsilastirmalar', label: 'Önceki Karşılaştırmalar', icon: 'chart', href: '/karsilastirma', color: '#8B5CF6' },
  { id: 'guvenilirlik', label: 'Güvenilirlik Derecelendirmeleri', icon: 'star', href: '/guvenilirlik', color: '#F59E0B' },
  { id: 'workshop', label: 'Workshop Kılavuzları', icon: 'book', href: '/arac/workshop-kilavuzlari', color: '#3B82F6' },
  { id: 'videolar', label: 'Video İçerik Merkezi', icon: 'video', href: '/arac/videolar', color: '#EF4444' },
];

// SVG Icon component for hero services
const HeroServiceIcon = ({ id, color }: { id: string; color: string }) => {
  const icons: Record<string, JSX.Element> = {
    'periyodik-bakim': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    'yag-degisimi': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    'fren-sistemi': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2" />
      </svg>
    ),
    'lastik-servisi': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    'aku': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <rect x="6" y="7" width="12" height="13" rx="2" />
        <path strokeLinecap="round" d="M9 7V5h2M13 7V5h2M10 12h4M12 10v4" />
      </svg>
    ),
    'elektrik': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    'klima': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
    'egzoz': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h4l2-4 4 8 2-4h4" />
      </svg>
    ),
    'motor': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    'sanziman': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
        <circle cx="17" cy="12" r="2" />
      </svg>
    ),
    'suspansiyon': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <circle cx="12" cy="12" r="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9V4M12 20v-5M9 12H4M20 12h-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l3 3M18 6l-3 3M6 18l3-3M18 18l-3-3" />
      </svg>
    ),
    'kaporta': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    'cam': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 5l-2 6M14 5l2 6M8 14l4-3" />
      </svg>
    ),
    'diagnostik': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    'yakit': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12v6a2 2 0 01-2 2h-1.5a.5.5 0 01-.5-.5v-3a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5v3a.5.5 0 01-.5.5H6a2 2 0 01-2-2V6a2 2 0 012-2h8v13M16 4v8M16 4l-2 2M16 4l2 2" />
      </svg>
    ),
    'sogutma': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M10 8h4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4V2M12 22v-2" />
      </svg>
    ),
    'debriyaj': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    'oto-yikama': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12v4M16 12v4" />
      </svg>
    ),
    'aksesuar': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    'cekici': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    'lpg': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    'turbo': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    'hibrit': (
      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
      </svg>
    ),
  };
  
  return icons[id] || (
    <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
    </svg>
  );
};

// Hero services shown above car - main categories for navigation
const heroServices = [
  { id: 'periyodik-bakim', name: 'Bakım', category: 'Periyodik Bakım', color: SITE_YELLOW },
  { id: 'yag-degisimi', name: 'Yağ', category: 'Yağ Değişimi', color: SITE_YELLOW },
  { id: 'fren-sistemi', name: 'Fren', category: 'Fren Sistemi Onarımı', color: SITE_YELLOW },
  { id: 'lastik-servisi', name: 'Lastik', category: 'Lastik Servisi', color: SITE_YELLOW },
  { id: 'elektrik', name: 'Elektrik', category: 'Elektrik Sistemi Onarımı', color: SITE_YELLOW },
  { id: 'klima', name: 'Klima', category: 'Klima Bakımı ve Onarımı', color: SITE_YELLOW },
  { id: 'motor', name: 'Motor', category: 'Motor Onarımı', color: SITE_YELLOW },
  { id: 'sanziman', name: 'Şanzıman', category: 'Şanzıman Onarımı', color: SITE_YELLOW },
  { id: 'kaporta', name: 'Kaporta', category: 'Kaporta ve Boya', color: SITE_YELLOW },
  { id: 'diagnostik', name: 'Arıza', category: 'Diagnostik ve Arıza Tespiti', color: SITE_YELLOW },
  { id: 'oto-yikama', name: 'Yıkama', category: 'Oto Yıkama, İç Temizlik ve Detaylandırma', color: SITE_YELLOW },
  { id: 'cekici', name: 'Çekici', category: 'Çekici ve Yol Yardım', color: SITE_YELLOW },
];

// Stats interface
interface Stats {
  serviceCount: number;
  cityCount: number;
  customerCount: number;
}

// Sound effects disabled - was causing unwanted audio on part clicks
const useSoundEffects = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const playSound = (_partId: string) => {
    // Sound effects disabled
  };

  return { playSound };
};

// 3D Hotspot positions on the car (adjusted for car1.glb)
// X: sağ(+) / sol(-), Y: yukarı(+) / aşağı(-), Z: ön(+) / arka(-)
const hotspotPositions: { [key: string]: [number, number, number] } = {
  lastik: [0.74, -0.34, 1.25],    // Ön sağ lastik
  motor: [0.04, 0.03, 1.78],      // Motor kapağı (ön)
  fren: [0.81, -0.31, -0.71],     // Arka sağ fren
  elektrik: [0.70, 0.02, 1.69],   // Ön far
  karoser: [0.80, -0.05, 0.32],   // Sağ kapı
  egzoz: [0.80, -0.07, -1.53],    // Arka egzoz
  cam: [0.06, 0.40, 0.53],        // Ön cam
  suspansiyon: [0.74, -0.12, 0.90], // Süspansiyon
  icmekan: [0.61, 0.35, -0.24],   // İç mekan
};

// 3D Car Model Component
function CarModel({ onLoaded, onPartClick, hoveredPart, setHoveredPart }: {
  onLoaded: () => void;
  onPartClick: (partId: string) => void;
  hoveredPart: string | null;
  setHoveredPart: (partId: string | null) => void;
}) {
  const groupRef = useRef<GroupType>(null);
  const [gltf, setGltf] = useState<any>(null);

  useEffect(() => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      '/models/car1.glb',
      (loadedGltf) => {
        // Enable shadows
        loadedGltf.scene.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        setGltf(loadedGltf);
        onLoaded();
      },
      undefined,
      (error) => {
        console.error('[HeroSection3D] Error loading car model:', error);
      }
    );

    return () => {
      dracoLoader.dispose();
    };
  }, [onLoaded]);

  // Detect which part was clicked based on mesh name
  const handleMeshClick = (meshName: string) => {
    const name = meshName.toLowerCase();

    // Daha spesifik eşleştirme - öncelik sırasına göre
    if (name.includes('wheel') || name.includes('tire') || name.includes('tyre') || name.includes('rim')) {
      onPartClick('lastik');
    } else if (name.includes('hood') || name.includes('bonnet') || name.includes('engine')) {
      onPartClick('motor');
    } else if (name.includes('brake') || name.includes('caliper')) {
      onPartClick('fren');
    } else if (name.includes('headlight') || name.includes('taillight') || name.includes('lamp')) {
      onPartClick('elektrik');
    } else if (name.includes('exhaust') || name.includes('muffler')) {
      onPartClick('egzoz');
    } else if (name.includes('windshield') || name.includes('windscreen')) {
      onPartClick('cam');
    } else if (name.includes('seat') || name.includes('interior') || name.includes('dashboard')) {
      onPartClick('icmekan');
    } else if (name.includes('suspension') || name.includes('shock') || name.includes('spring')) {
      onPartClick('suspansiyon');
    } else if (name.includes('door')) {
      onPartClick('karoser');
    }
    // Eşleşme yoksa hiçbir şey yapma - sadece hotspot'lara tıklayınca açılsın
  };

  // Add click handlers to meshes
  useEffect(() => {
    if (!gltf) return;

    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.cursor = 'pointer';
      }
    });
  }, [gltf]);

  if (!gltf) return null;

  return (
    <group
      ref={groupRef}
      position={[0, 0.2, 0]}
      scale={0.95}
    >
      <primitive object={gltf.scene} />

      {/* Interactive Hotspots */}
      {Object.entries(hotspotPositions).map(([partId, position]) => {
        const part = carParts.find(p => p.id === partId);
        if (!part) return null;
        const isHovered = hoveredPart === partId;

        return (
          <Html
            key={partId}
            position={position}
            center
            sprite
            zIndexRange={[10, 0]}
            style={{ pointerEvents: 'auto' }}
          >
            <div
              className="relative cursor-pointer flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onPartClick(partId);
              }}
              onMouseEnter={() => setHoveredPart(partId)}
              onMouseLeave={() => setHoveredPart(null)}
            >
              {/* Pulse */}
              <span
                className="absolute w-6 h-6 rounded-full animate-ping opacity-25"
                style={{ backgroundColor: part.color }}
              />

              {/* Main dot */}
              <div
                className={`relative w-3 h-3 rounded-full border border-white/80 transition-all duration-300 ${isHovered ? 'scale-150' : 'scale-100'}`}
                style={{
                  background: part.color,
                  boxShadow: `0 0 ${isHovered ? '12px' : '6px'} ${part.color}`
                }}
              />

              {/* Label - always visible */}
              <div
                className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-medium whitespace-nowrap transition-all duration-300 ${isHovered ? 'opacity-100 scale-105' : 'opacity-80'}`}
                style={{
                  backgroundColor: `${part.color}CC`,
                  color: 'white',
                  boxShadow: isHovered ? `0 4px 12px ${part.color}50` : `0 2px 8px ${part.color}50`
                }}
              >
                {part.name}
              </div>
            </div>
          </Html>
        );
      })}
    </group>
  );
}

// Loading component - Skeleton Car
function LoadingScreen() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        {/* Skeleton Car Shape */}
        <div className="relative w-64 h-32">
          {/* Car body skeleton */}
          <div className="absolute bottom-4 left-4 right-4 h-12 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-lg animate-pulse" />
          {/* Car top skeleton */}
          <div className="absolute bottom-14 left-12 right-12 h-10 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-t-2xl animate-pulse" style={{ animationDelay: '0.1s' }} />
          {/* Wheels */}
          <div className="absolute bottom-0 left-8 w-10 h-10 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="absolute bottom-0 right-8 w-10 h-10 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
          {/* Headlights shimmer */}
          <div className="absolute bottom-6 left-2 w-3 h-2 bg-primary-500/50 rounded-full animate-ping" />
          <div className="absolute bottom-6 right-2 w-3 h-2 bg-red-500/50 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 rounded-full"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <p className="text-white/50 text-xs tracking-wider">3D MODEL YÜKLENİYOR</p>
      </div>
    </Html>
  );
}

// Particle Effect Component
// Car Brand Logos Background Animation
function CarBrandLogos() {
  const [activeLogos, setActiveLogos] = useState<{id: number; brand: string; x: number; y: number}[]>([]);
  const logoIdRef = useRef(0);
  
  const carBrands = [
    'BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Toyota', 'Honda', 'Ford', 
    'Renault', 'Peugeot', 'Fiat', 'Hyundai', 'Kia', 'Nissan', 'Mazda', 
    'Volvo', 'Skoda', 'Seat', 'Opel', 'Citroen', 'Dacia', 'Suzuki', 'Mitsubishi',
    'Alfa Romeo', 'Aston Martin', 'Bentley', 'BYD', 'Chery', 'Chevrolet',
    'Chrysler', 'Cupra', 'DS', 'Ferrari', 'Geely', 'Jaecoo', 'Jaguar', 'Jeep',
    'Lada', 'Lamborghini', 'Land Rover', 'Lexus', 'Maserati', 'MG', 'Mini',
    'Porsche', 'Range Rover', 'Seres', 'Skywell', 'Ssangyong', 'Subaru',
    'Tesla', 'Togg'
  ];

  useEffect(() => {
    const spawnLogo = () => {
      const randomBrand = carBrands[Math.floor(Math.random() * carBrands.length)];
      const newLogo = {
        id: logoIdRef.current++,
        brand: randomBrand,
        x: Math.random() * 70 + 15,
        y: Math.random() * 60 + 20,
      };
      setActiveLogos(prev => [...prev.slice(-3), newLogo]);
    };

    spawnLogo();
    const spawnInterval = setInterval(spawnLogo, 2500);
    return () => clearInterval(spawnInterval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      <AnimatePresence>
        {activeLogos.map((logo) => (
          <motion.div
            key={logo.id}
            className="absolute flex items-center justify-center"
            style={{
              left: `${logo.x}%`,
              top: `${logo.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.3, filter: 'blur(10px)' }}
            animate={{ 
              opacity: [0, 0.25, 0.25, 0],
              scale: [0.3, 1, 1, 0.7],
              filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(5px)'],
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ 
              duration: 5,
              times: [0, 0.15, 0.85, 1],
              ease: "easeInOut"
            }}
            onAnimationComplete={() => {
              setActiveLogos(prev => prev.filter(l => l.id !== logo.id));
            }}
          >
            <span 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-widest uppercase"
              style={{
                color: 'white',
                textShadow: '0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,255,255,0.3), 0 0 90px rgba(255,255,255,0.2)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '0.15em',
              }}
            >
              {logo.brand}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ParticleField() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary-400"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Glowing orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
            width: 6 + i * 2,
            height: 6 + i * 2,
            background: `radial-gradient(circle, rgba(251,201,29,0.3) 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 8 + i * 2,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}


// 3D Tire Model Component
function TireModel() {
  const groupRef = useRef<GroupType>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Tire rubber */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.4, 32, 64]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Tire treads */}
      {[...Array(24)].map((_, i) => (
        <mesh
          key={i}
          rotation={[Math.PI / 2, 0, (i / 24) * Math.PI * 2]}
          position={[
            Math.cos((i / 24) * Math.PI * 2) * 1,
            0,
            Math.sin((i / 24) * Math.PI * 2) * 1
          ]}
        >
          <boxGeometry args={[0.08, 0.45, 0.15]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
        </mesh>
      ))}

      {/* Rim outer */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.08, 16, 32]} />
        <meshStandardMaterial
          color="#c0c0c0"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Rim center */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.15, 32]} />
        <meshStandardMaterial
          color="#a0a0a0"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Rim spokes */}
      {[...Array(5)].map((_, i) => (
        <mesh
          key={i}
          rotation={[Math.PI / 2, 0, (i / 5) * Math.PI * 2]}
          position={[0, 0, 0]}
        >
          <boxGeometry args={[0.12, 0.12, 0.5]} />
          <meshStandardMaterial
            color="#b0b0b0"
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
      ))}

      {/* Center cap */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
        <meshStandardMaterial
          color="#808080"
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

// Custom Cursor Component
function CustomCursor({ isOverCar, hoveredPart }: { isOverCar: boolean; hoveredPart: string | null }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  const part = hoveredPart ? carParts.find(p => p.id === hoveredPart) : null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] hidden lg:flex items-center gap-2"
      style={{
        left: position.x,
        top: position.y,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={{ duration: 0.15 }}
    >
      {/* Main cursor circle */}
      <motion.div
        className="relative flex items-center justify-center -ml-4 -mt-4"
        animate={{
          width: part ? 'auto' : 32,
          height: 32,
          paddingLeft: part ? 10 : 0,
          paddingRight: part ? 10 : 0,
        }}
        style={{
          background: part
            ? `linear-gradient(135deg, ${part.color}90, ${part.color}60)`
            : 'rgba(251, 201, 29, 0.9)',
          borderRadius: 20,
          boxShadow: part
            ? `0 4px 20px ${part.color}80`
            : '0 4px 20px rgba(251, 201, 29, 0.5)',
        }}
      >
        {part ? (
          <>
            <span className="text-sm">{part.icon}</span>
            <span className="text-white text-xs font-bold ml-1.5">{part.name}</span>
          </>
        ) : (
          <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        )}
      </motion.div>

      {/* Ripple effect */}
      {!part && (
        <motion.div
          className="absolute -ml-6 -mt-6 w-12 h-12 border-2 border-primary-500/30 rounded-full"
          animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

// Main Hero Component
export default function HeroSection3D() {
  const [selectedPart, setSelectedPart] = useState<CarPart | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({ serviceCount: 500, cityCount: 81, customerCount: 50000 });
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOverCar, setIsOverCar] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [tourStep, setTourStep] = useState(0);
  const [showTour, setShowTour] = useState(false);
  
  // Rotating text for hero heading
  const heroWords = [
    'Dijital Servisi',
    'Güvenilir Ortağı',
    'Akıllı Rehberi',
    'Tek Adresi',
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  // Rotating placeholder texts for search
  const placeholderTexts = [
    'Servis Bul', 'Yağ Değişimi', 'Fren Bakımı', 'Lastik Değişimi',
    'Motor Bakımı', 'Klima Bakımı', 'Akü Değişimi', 'Balata Değişimi',
    'OBD Kodu Sorgula', 'Araç Değeri Hesapla', 'Randevu Al', 'Fiyat Hesapla',
    'Şarj İstasyonu Bul'
  ];
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  
  const { playSound } = useSoundEffects();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Rotating text animation for hero heading
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWordIndex(prev => (prev + 1) % heroWords.length);
    }, 2500); // Change word every 2.5 seconds
    return () => clearInterval(wordInterval);
  }, []);

  // Rotating placeholder text animation
  useEffect(() => {
    const placeholderInterval = setInterval(() => {
      setCurrentPlaceholderIndex(prev => (prev + 1) % placeholderTexts.length);
    }, 2000); // Change placeholder every 2 seconds
    return () => clearInterval(placeholderInterval);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Onboarding tour - show on first visit
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('tamirhanem-tour-seen');
    if (!hasSeenTour && !isMobile && isModelLoaded) {
      const timer = setTimeout(() => {
        setShowTour(true);
        setTourStep(1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, isModelLoaded]);

  const tourSteps = [
    {
      id: 1,
      title: "3D Araç Modeli",
      description: "Aracınızdaki parçalara tıklayarak ilgili servisleri keşfedin.",
      position: "right"
    },
    {
      id: 2,
      title: "Hizmet Noktaları",
      description: "Renkli noktalar farklı servis kategorilerini gösterir.",
      position: "right"
    },
    {
      id: 3,
      title: "Hızlı Arama",
      description: "Ctrl+K ile hızlıca arama yapabilirsiniz.",
      position: "left"
    }
  ];

  const handleTourNext = () => {
    if (tourStep < tourSteps.length) {
      setTourStep(tourStep + 1);
    } else {
      handleTourComplete();
    }
  };

  const handleTourComplete = () => {
    setShowTour(false);
    setTourStep(0);
    localStorage.setItem('tamirhanem-tour-seen', 'true');
  };

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const json = await res.json();
        if (json.success && json.data) {
          setStats({
            serviceCount: json.data.serviceCount || 500,
            cityCount: json.data.cityCount || 81,
            customerCount: json.data.customerCount || 50000
          });
        }
      } catch (error) {
        console.error('[HeroSection3D] Stats fetch error:', error);
      }
    };
    fetchStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return Math.floor(num / 1000) + 'K+';
    }
    return num + '+';
  };

  const handlePartClick = (partId: string) => {
    const part = carParts.find(p => p.id === partId);
    if (part) {
      playSound(partId);
      setSelectedPart(part);
    }
  };

  const handleModelLoaded = useCallback(() => {
    setIsModelLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden pt-8 lg:pt-12">
      {/* Background effects - Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Slow moving - back layer */}
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px]"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        {/* Medium speed - middle layer */}
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"
          style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        />
        {/* Faster - front layer */}
        <motion.div
          className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          animate={{
            x: [0, 50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Extra parallax orbs */}
        <div
          className="absolute top-1/2 left-1/3 w-[200px] h-[200px] bg-cyan-500/5 rounded-full blur-[80px]"
          style={{ transform: `translateY(${scrollY * -0.25}px) translateX(${scrollY * 0.05}px)` }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-[250px] h-[250px] bg-amber-500/5 rounded-full blur-[100px]"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
      </div>

      {/* Grid pattern - Parallax */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          transform: `translateY(${scrollY * 0.05}px)`
        }}
      />

      {/* Car Brand Logos Animation */}
      <CarBrandLogos />

      {/* Floating Stats Badges */}
      <div className="absolute top-20 lg:top-24 left-0 right-0 z-20 px-6 lg:px-12 xl:px-20">
        <div className="flex flex-wrap gap-3 lg:gap-4">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-primary-500/30 shadow-lg shadow-primary-500/5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05, borderColor: 'rgba(251,201,29,0.6)' }}
          >
            <span className="text-lg">🏆</span>
            <span className="text-white/90 text-sm font-medium">Türkiye'nin #1 Oto Servis Platformu</span>
          </motion.div>

          <motion.div
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-primary-500/30 shadow-lg shadow-primary-500/5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05, borderColor: 'rgba(251,201,29,0.6)' }}
          >
            <span className="text-lg">⚡</span>
            <span className="text-white/90 text-sm font-medium">{stats.serviceCount}+ Onaylı Servis</span>
          </motion.div>

          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-primary-500/30 shadow-lg shadow-primary-500/5 hidden sm:inline-flex"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ scale: 1.05, borderColor: 'rgba(251,201,29,0.6)' }}
          >
            <span className="text-lg">⭐</span>
            <span className="text-white/90 text-sm font-medium">4.8/5 Müşteri Memnuniyeti</span>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative min-h-screen flex flex-col lg:flex-row items-start lg:items-center pt-28 lg:pt-0">
        {/* Left panel - Info */}
        <div className="w-full lg:w-2/5 flex flex-col justify-start lg:justify-center px-6 lg:px-12 xl:px-20 py-4 lg:py-0 lg:-mt-40 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Heading */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Aracınızın
              </motion.span>
              <br />
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-yellow-400 to-primary-500 inline-flex"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ backgroundSize: '200% auto' }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWordIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="inline-block"
                  >
                    {heroWords[currentWordIndex]}
                  </motion.span>
                </AnimatePresence>
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-white/50 text-lg mb-10 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Aracınız için en uygun servisi bulun, fiyat karşılaştırın ve randevunuzu hemen oluşturun.
            </motion.p>

            {/* Command Palette Trigger */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-10"
            >
              <motion.button
                onClick={() => setCommandOpen(true)}
                className="group flex items-center gap-3 w-full max-w-sm px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5 text-white/40 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-white/40 text-sm group-hover:text-white/60 transition-colors flex-1 text-left overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentPlaceholderIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="block"
                    >
                      {placeholderTexts[currentPlaceholderIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-white/40 text-xs">
                  <span className="text-[10px]">⌘</span>K
                </kbd>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <div className="flex gap-8">
              {[
                { value: stats.serviceCount + '+', label: 'Servis' },
                { value: stats.cityCount.toString(), label: 'İl' },
                { value: formatNumber(stats.customerCount), label: 'Kullanıcı' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + idx * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div 
                    className="text-2xl lg:text-3xl font-bold text-white"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, delay: idx * 0.2, repeat: Infinity }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-white/40 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right panel - 3D Car (Desktop) / Service Grid (Mobile) */}
        <div
          className="w-full lg:w-3/5 relative h-auto lg:h-[calc(100vh-8rem)] lg:-mt-16"
          onMouseEnter={() => setIsOverCar(true)}
          onMouseLeave={() => setIsOverCar(false)}
        >
          {/* Mobile: Service Cards Grid */}
          {isMobile ? (
            <div className="px-4 py-6">
              <div className="grid grid-cols-3 gap-3">
                {carParts.slice(0, 9).map((part, idx) => (
                  <motion.div
                    key={part.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={part.href}
                      className="flex flex-col items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center mb-2">
                        <Icon id={part.icon} className="w-5 h-5 text-primary-400" />
                      </div>
                      <span className="text-white text-xs font-medium text-center">{part.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  href="/servisler"
                  className="inline-flex items-center gap-2 text-primary-400 text-sm font-medium hover:text-primary-300 transition-colors"
                >
                  Tüm Servisler
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ) : (
            /* Desktop: 3D Canvas with Floating Usta Labels */
            <div className="relative w-full h-full">
              {/* Floating Usta Labels - Right side */}
              <div className="absolute top-8 right-8 z-20 flex flex-col gap-3 pointer-events-none">
                {[
                  'Motor Ustası Bul',
                  'Kaporta & Boya Ustası Bul',
                  'Fren Ustası Bul',
                  'Elektrik Ustası Bul',
                  'Lastik Ustası Bul',
                  'Klima Ustası Bul',
                  'Şanzıman Ustası Bul',
                ].map((ustaText, idx) => (
                  <motion.div
                    key={ustaText}
                    className="text-white/20 text-lg xl:text-xl font-bold text-right"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ 
                      opacity: [0.15, 0.25, 0.15],
                      x: 0
                    }}
                    transition={{ 
                      opacity: { duration: 3, repeat: Infinity, delay: idx * 0.5 },
                      x: { duration: 0.5, delay: idx * 0.1 }
                    }}
                  >
                    {ustaText}
                  </motion.div>
                ))}
              </div>
              
              {/* 3D Canvas */}
              <Canvas
                className="w-full h-full"
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
                shadows
              >
              <PerspectiveCamera makeDefault position={[3.5, 1.5, 3.5]} fov={40} />

              {/* Lighting */}
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#fbc91d" />
              <pointLight position={[10, 5, 5]} intensity={0.3} color="#3b82f6" />

              {/* Environment */}
              <Environment preset="city" />

              {/* Car Model */}
              <Suspense fallback={<LoadingScreen />}>
                <Center>
                  <CarModel
                      onLoaded={handleModelLoaded}
                      onPartClick={handlePartClick}
                      hoveredPart={hoveredPart}
                      setHoveredPart={setHoveredPart}
                    />
                </Center>
              </Suspense>

              {/* Shadow */}
              <ContactShadows
                position={[0, -1.2, 0]}
                opacity={0.5}
                scale={10}
                blur={2}
                far={4}
              />

              {/* Controls */}
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                enableRotate={false}
              />
            </Canvas>
            </div>
          )}
        </div>
      </div>


      {/* Part Detail Modal */}
      <AnimatePresence>
        {selectedPart && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={() => setSelectedPart(null)}
            />

            {/* Special Tire Modal with 3D */}
            {selectedPart.id === 'lastik' ? (
              <motion.div
                className="relative w-full max-w-2xl bg-gray-900/95 backdrop-blur-2xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ type: "spring", damping: 25 }}
                style={{ boxShadow: '0 0 100px rgba(99, 102, 241, 0.3)' }}
              >
                {/* Close button */}
                <motion.button
                  onClick={() => setSelectedPart(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center hover:bg-black/50 transition-colors z-20"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>

                {/* 3D Tire Viewer */}
                <div className="h-[300px] w-full bg-gradient-to-b from-gray-800 to-gray-900 relative">
                  <Canvas
                    dpr={[1, 2]}
                    gl={{ antialias: true, alpha: true }}
                    camera={{ position: [3, 2, 3], fov: 45 }}
                  >
                    <ambientLight intensity={0.5} />
                    <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1} />
                    <pointLight position={[-5, 5, -5]} intensity={0.5} color="#6366f1" />
                    <Environment preset="city" />
                    <TireModel />
                    <OrbitControls
                      enablePan={false}
                      enableZoom={false}
                      autoRotate={false}
                    />
                  </Canvas>

                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      ⭕
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Lastik Servisi</h3>
                      <p className="text-white/60">Lastik değişim, balans & rot ayarı</p>
                    </div>
                  </div>

                  {/* Services Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {['Lastik Değişimi', 'Balans Ayarı', 'Rot Balans', 'Jant Düzeltme', 'Lastik Tamiri', 'Mevsimlik Değişim'].map((service, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 text-sm text-white/80 border border-white/10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{
                          backgroundColor: 'rgba(99, 102, 241, 0.2)',
                          borderColor: 'rgba(99, 102, 241, 0.5)'
                        }}
                      >
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        {service}
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/lastikler"
                      className="relative flex items-center justify-center gap-3 w-full py-4 rounded-xl text-white font-semibold overflow-hidden bg-gradient-to-r from-indigo-500 to-indigo-600"
                      onClick={() => setSelectedPart(null)}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />
                      <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="relative z-10">Lastik Ustası Bul</span>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              /* Standard Modal for other parts */
              <motion.div
                className="relative w-full max-w-lg bg-gray-900/90 backdrop-blur-2xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl"
                initial={{ scale: 0.8, y: 50, rotateX: -10 }}
                animate={{ scale: 1, y: 0, rotateX: 0 }}
                exit={{ scale: 0.8, y: 50, rotateX: 10 }}
                transition={{ type: "spring", damping: 25 }}
                style={{ boxShadow: `0 0 100px ${selectedPart.color}30` }}
              >
                {/* Header */}
                <div
                  className="relative p-6 pb-4"
                  style={{ background: `linear-gradient(135deg, ${selectedPart.color}30, transparent)` }}
                >
                  {/* Close button */}
                  <motion.button
                    onClick={() => setSelectedPart(null)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center hover:bg-black/50 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>

                  {/* Part icon and name */}
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${selectedPart.color}, ${selectedPart.color}CC)`,
                        boxShadow: `0 10px 40px ${selectedPart.color}50`
                      }}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      {selectedPart.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedPart.name}</h3>
                      <p className="text-white/60">{selectedPart.description}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Services */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {selectedPart.details.map((detail, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-sm text-white/70 border border-white/10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{
                          backgroundColor: `${selectedPart.color}20`,
                          borderColor: `${selectedPart.color}50`
                        }}
                      >
                        <motion.div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: selectedPart.color }}
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                        />
                        {detail}
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={selectedPart.href}
                      className="relative flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-medium overflow-hidden"
                      style={{ backgroundColor: selectedPart.color }}
                      onClick={() => setSelectedPart(null)}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />
                      <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="relative z-10">{selectedPart.name} Ustası Bul</span>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Tour */}
      <AnimatePresence>
        {showTour && (
          <motion.div
            className="fixed inset-0 z-[300] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={handleTourComplete} />

            {/* Tour Card */}
            <motion.div
              className={`absolute pointer-events-auto ${
                tourSteps[tourStep - 1]?.position === 'left'
                  ? 'left-8 top-1/2 -translate-y-1/2'
                  : 'right-8 top-1/2 -translate-y-1/2 lg:right-[45%]'
              }`}
              initial={{ opacity: 0, scale: 0.9, x: tourSteps[tourStep - 1]?.position === 'left' ? -20 : 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={tourStep}
            >
              <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/20 p-6 max-w-xs shadow-2xl">
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-4">
                  {tourSteps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 rounded-full transition-all ${
                        idx + 1 === tourStep
                          ? 'w-6 bg-primary-500'
                          : idx + 1 < tourStep
                          ? 'w-3 bg-primary-500/50'
                          : 'w-3 bg-white/20'
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2">
                  {tourSteps[tourStep - 1]?.title}
                </h3>
                <p className="text-white/60 text-sm mb-6">
                  {tourSteps[tourStep - 1]?.description}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleTourComplete}
                    className="text-white/40 text-sm hover:text-white/60 transition-colors"
                  >
                    Atla
                  </button>
                  <motion.button
                    onClick={handleTourNext}
                    className="px-4 py-2 bg-primary-500 text-gray-900 rounded-lg font-semibold text-sm hover:bg-primary-400 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tourStep < tourSteps.length ? 'İleri' : 'Başla'}
                  </motion.button>
                </div>
              </div>

              {/* Arrow pointing to element */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 ${
                  tourSteps[tourStep - 1]?.position === 'left'
                    ? '-right-4'
                    : '-left-4 rotate-180'
                }`}
              >
                <svg className="w-4 h-4 text-gray-900/95" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </motion.div>

            {/* Highlight pulse on car area */}
            {tourStep <= 2 && (
              <motion.div
                className="absolute right-[20%] top-1/2 -translate-y-1/2 w-32 h-32 border-2 border-primary-500/50 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {commandOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setCommandOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="relative w-full max-w-lg mx-4 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Ne aramak istiyorsun?"
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
                  autoFocus
                />
                <kbd className="px-2 py-1 rounded bg-white/10 text-white/40 text-xs">ESC</kbd>
              </div>

              {/* Actions List */}
              <div className="max-h-[60vh] overflow-y-auto py-2">
                {/* Quick Actions */}
                {quickActions.filter(action =>
                  commandSearch === '' ||
                  action.label.toLowerCase().includes(commandSearch.toLowerCase())
                ).length > 0 && (
                  <div className="px-3 py-2">
                    <p className="text-white/30 text-xs font-medium uppercase tracking-wider mb-2">Hızlı İşlemler</p>
                    {quickActions
                      .filter(action =>
                        commandSearch === '' ||
                        action.label.toLowerCase().includes(commandSearch.toLowerCase())
                      )
                      .map((action, idx) => (
                        <Link
                          key={action.id}
                          href={action.href}
                          onClick={() => setCommandOpen(false)}
                        >
                          <motion.div
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                              style={{ background: `${action.color}20` }}
                            >
                              {action.icon}
                            </div>
                            <span className="text-white/80 text-sm group-hover:text-white transition-colors">
                              {action.label}
                            </span>
                            <svg className="w-4 h-4 text-white/20 ml-auto group-hover:text-white/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.div>
                        </Link>
                      ))}
                  </div>
                )}

                {/* Divider */}
                {quickActions.filter(action =>
                  commandSearch === '' ||
                  action.label.toLowerCase().includes(commandSearch.toLowerCase())
                ).length > 0 && <div className="border-t border-white/5 my-2" />}

                {/* Araç Bilgileri */}
                {menuItemsArac.filter(item =>
                  commandSearch === '' ||
                  item.label.toLowerCase().includes(commandSearch.toLowerCase())
                ).length > 0 && (
                  <div className="px-3 py-2">
                    <p className="text-white/30 text-xs font-medium uppercase tracking-wider mb-2">Araç Bilgileri</p>
                    {menuItemsArac
                      .filter(item =>
                        commandSearch === '' ||
                        item.label.toLowerCase().includes(commandSearch.toLowerCase())
                      )
                      .map((item, idx) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setCommandOpen(false)}
                        >
                          <motion.div
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + idx * 0.02 }}
                          >
                            <span className="text-base">{item.icon}</span>
                            <span className="text-white/70 text-sm group-hover:text-white transition-colors">
                              {item.label}
                            </span>
                          </motion.div>
                        </Link>
                      ))}
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-white/5 my-2" />

                {/* Araç Rehberi */}
                {menuItemsRehber.filter(item =>
                  commandSearch === '' ||
                  item.label.toLowerCase().includes(commandSearch.toLowerCase())
                ).length > 0 && (
                  <div className="px-3 py-2">
                    <p className="text-white/30 text-xs font-medium uppercase tracking-wider mb-2">Araç Rehberi</p>
                    {menuItemsRehber
                      .filter(item =>
                        commandSearch === '' ||
                        item.label.toLowerCase().includes(commandSearch.toLowerCase())
                      )
                      .map((item, idx) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setCommandOpen(false)}
                        >
                          <motion.div
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 + idx * 0.02 }}
                          >
                            <span className="text-base">{item.icon}</span>
                            <span className="text-white/70 text-sm group-hover:text-white transition-colors">
                              {item.label}
                            </span>
                          </motion.div>
                        </Link>
                      ))}
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-white/5 my-2" />

                {/* Servis Kategorileri */}
                {heroServices.filter(service =>
                  commandSearch === '' ||
                  service.name.toLowerCase().includes(commandSearch.toLowerCase())
                ).length > 0 && (
                  <div className="px-3 py-2">
                    <p className="text-white/30 text-xs font-medium uppercase tracking-wider mb-2">Servis Kategorileri</p>
                    {heroServices
                      .filter(service =>
                        commandSearch === '' ||
                        service.name.toLowerCase().includes(commandSearch.toLowerCase())
                      )
                      .map((service, idx) => (
                        <Link
                          key={service.id}
                          href={`/servisler/sonuclar?category=${encodeURIComponent(service.category)}`}
                          onClick={() => setCommandOpen(false)}
                        >
                          <motion.div
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.02 }}
                          >
                            <HeroServiceIcon id={service.id} color={service.color} />
                            <span className="text-white/70 text-sm group-hover:text-white transition-colors">
                              {service.name}
                            </span>
                          </motion.div>
                        </Link>
                      ))}
                  </div>
                )}

                {/* No Results */}
                {commandSearch !== '' &&
                  quickActions.filter(a => a.label.toLowerCase().includes(commandSearch.toLowerCase())).length === 0 &&
                  menuItemsArac.filter(a => a.label.toLowerCase().includes(commandSearch.toLowerCase())).length === 0 &&
                  menuItemsRehber.filter(a => a.label.toLowerCase().includes(commandSearch.toLowerCase())).length === 0 &&
                  heroServices.filter(a => a.name.toLowerCase().includes(commandSearch.toLowerCase())).length === 0 && (
                    <div className="px-6 py-8 text-center">
                      <div className="mb-3"><Icon id="search" className="w-10 h-10 mx-auto" color="#9CA3AF" /></div>
                      <p className="text-white/50 text-sm">"{commandSearch}" için sonuç bulunamadı</p>
                      <p className="text-white/30 text-xs mt-1">Farklı bir arama terimi deneyin</p>
                    </div>
                  )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-white/5">
                <div className="flex items-center gap-4 text-white/30 text-xs">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10">↑↓</kbd> gezin
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10">↵</kbd> seç
                  </span>
                </div>
                <span className="text-white/20 text-xs">tamirhanem.com</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
