'use client';

import React from 'react';

// Merkezi SVG ikon bileşeni - tüm emojilerin yerine kullanılacak
export interface IconProps {
  className?: string;
  color?: string;
  size?: number | string;
}

// Icon mapping - id'ye göre SVG döndürür
const iconMap: Record<string, (props: IconProps) => JSX.Element> = {
  // Motor ve Mekanik
  'motor': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  
  'gear': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  
  // Fren Sistemi
  'fren': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2" />
    </svg>
  ),
  
  'brake': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2" />
    </svg>
  ),
  
  // Lastik
  'lastik': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  
  'tire': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  
  // Elektrik & Far
  'elektrik': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  
  'light': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  
  // Kaporta & Boya
  'karoser': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  
  'paint': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  
  // Egzoz
  'egzoz': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c1.5 3 3 4.5 3 7.5a3 3 0 11-6 0c0-3 1.5-4.5 3-7.5zM12 12v3m-3 3h6M10 20a2 2 0 104 0" />
    </svg>
  ),
  
  'exhaust': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c1.5 3 3 4.5 3 7.5a3 3 0 11-6 0c0-3 1.5-4.5 3-7.5zM12 12v3m-3 3h6M10 20a2 2 0 104 0" />
    </svg>
  ),
  
  // Cam
  'cam': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 5l-2 6M14 5l2 6M8 14l4-3" />
    </svg>
  ),
  
  'window': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 5l-2 6M14 5l2 6M8 14l4-3" />
    </svg>
  ),
  
  // Klima
  'klima': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  
  'snowflake': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364" />
    </svg>
  ),
  
  // Süspansiyon
  'suspansiyon': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9V4M12 20v-5M9 12H4M20 12h-5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l3 3M18 6l-3 3M6 18l3-3M18 18l-3-3" />
    </svg>
  ),
  
  'suspension': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9V4M12 20v-5M9 12H4M20 12h-5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l3 3M18 6l-3 3M6 18l3-3M18 18l-3-3" />
    </svg>
  ),
  
  // Şanzıman
  'sanziman': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
      <circle cx="17" cy="12" r="2" />
    </svg>
  ),
  
  'gearbox': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
      <circle cx="17" cy="12" r="2" />
    </svg>
  ),
  
  // Direksiyon
  'direksiyon': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2" />
      <path strokeLinecap="round" d="M12 10V6M8 14l-2 2M16 14l2 2" />
    </svg>
  ),
  
  'steering': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2" />
      <path strokeLinecap="round" d="M12 10V6M8 14l-2 2M16 14l2 2" />
    </svg>
  ),
  
  // İç Mekan
  'icmekan': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  
  'interior': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  
  // Arama / Search
  'search': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  
  // Randevu / Takvim
  'calendar': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  
  // Para / Fiyat
  'money': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  
  'price': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  ),
  
  // Araç / Car
  'car': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-5.25 8.25H4.875c-.621 0-1.125-.504-1.125-1.125V12" />
    </svg>
  ),
  
  // Robot / AI
  'robot': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  ),
  
  'ai': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  ),
  
  // Sohbet / Chat
  'chat': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  ),
  
  // OBD / Grafik
  'chart': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  
  // Karşılaştır / Balance
  'compare': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
    </svg>
  ),
  
  // Wrench / Arıza
  'wrench': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
    </svg>
  ),
  
  // Clipboard / Bakım
  'clipboard': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  
  // Book / Ansiklopedi
  'book': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  
  // Bolt / Parça
  'bolt': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
    </svg>
  ),
  
  // Warning / Uyarı
  'warning': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  
  // Alert / Lamba
  'alert': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  ),
  
  // Forum
  'forum': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  ),
  
  // İnceleme / Review
  'review': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  ),
  
  // Star / Yıldız
  'star': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ),
  
  // Video
  'video': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  
  // Check
  'check': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  
  // X / Close
  'close': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  
  // Default fallback
  'default': ({ color = 'currentColor', className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
};

// Ana ikon bileşeni
export const Icon = ({ id, color = 'currentColor', className = 'w-5 h-5', size }: IconProps & { id: string }) => {
  const IconComponent = iconMap[id] || iconMap['default'];
  const sizeClass = size ? undefined : className;

  return (
    <span
      className={`inline-flex items-center justify-center ${sizeClass || ''}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <IconComponent color={color} className={sizeClass || 'w-full h-full'} />
    </span>
  );
};

// Belirli ikonlar için kısayollar
export const MotorIcon = (props: IconProps) => <Icon id="motor" {...props} />;
export const FrenIcon = (props: IconProps) => <Icon id="fren" {...props} />;
export const LastikIcon = (props: IconProps) => <Icon id="lastik" {...props} />;
export const ElektrikIcon = (props: IconProps) => <Icon id="elektrik" {...props} />;
export const KaroserIcon = (props: IconProps) => <Icon id="karoser" {...props} />;
export const EgzozIcon = (props: IconProps) => <Icon id="egzoz" {...props} />;
export const CamIcon = (props: IconProps) => <Icon id="cam" {...props} />;
export const KlimaIcon = (props: IconProps) => <Icon id="klima" {...props} />;
export const SuspansiyonIcon = (props: IconProps) => <Icon id="suspansiyon" {...props} />;
export const SanzimanIcon = (props: IconProps) => <Icon id="sanziman" {...props} />;
export const DireksiyonIcon = (props: IconProps) => <Icon id="direksiyon" {...props} />;
export const IcMekanIcon = (props: IconProps) => <Icon id="icmekan" {...props} />;
export const SearchIcon = (props: IconProps) => <Icon id="search" {...props} />;
export const CalendarIcon = (props: IconProps) => <Icon id="calendar" {...props} />;
export const MoneyIcon = (props: IconProps) => <Icon id="money" {...props} />;
export const CarIcon = (props: IconProps) => <Icon id="car" {...props} />;
export const RobotIcon = (props: IconProps) => <Icon id="robot" {...props} />;
export const ChatIcon = (props: IconProps) => <Icon id="chat" {...props} />;
export const ChartIcon = (props: IconProps) => <Icon id="chart" {...props} />;
export const CompareIcon = (props: IconProps) => <Icon id="compare" {...props} />;
export const WrenchIcon = (props: IconProps) => <Icon id="wrench" {...props} />;
export const ClipboardIcon = (props: IconProps) => <Icon id="clipboard" {...props} />;
export const BookIcon = (props: IconProps) => <Icon id="book" {...props} />;
export const BoltIcon = (props: IconProps) => <Icon id="bolt" {...props} />;
export const WarningIcon = (props: IconProps) => <Icon id="warning" {...props} />;
export const AlertIcon = (props: IconProps) => <Icon id="alert" {...props} />;
export const ForumIcon = (props: IconProps) => <Icon id="forum" {...props} />;
export const ReviewIcon = (props: IconProps) => <Icon id="review" {...props} />;
export const StarIcon = (props: IconProps) => <Icon id="star" {...props} />;
export const VideoIcon = (props: IconProps) => <Icon id="video" {...props} />;
export const CheckIcon = (props: IconProps) => <Icon id="check" {...props} />;
export const CloseIcon = (props: IconProps) => <Icon id="close" {...props} />;

// Icon map'i dışa aktar (başka dosyalardan erişim için)
export { iconMap };

export default Icon;
