'use client';

import Link from 'next/link';
import {
  Settings2,
  Wrench,
  Cpu,
  Disc3,
  Brush,
  AirVent,
  CircleDot,
  ArrowRight
} from 'lucide-react';

const services = [
  {
    id: 1,
    title: 'Periyodik Bakım',
    slug: 'motor-bakim',
    description: 'Üretici standartlarında detaylı bakım paketleri.',
    Icon: Settings2,
    span: 'col-span-2 md:col-span-2',
  },
  {
    id: 2,
    title: 'Mekanik Onarım',
    slug: 'sanziman',
    description: 'Motor ve şanzıman uzmanlığı.',
    Icon: Wrench,
    span: 'col-span-1',
  },
  {
    id: 3,
    title: 'Elektrik',
    slug: 'elektrik',
    description: 'Arıza tespit ve onarım.',
    Icon: Cpu,
    span: 'col-span-1',
  },
  {
    id: 4,
    title: 'Fren & Süspansiyon',
    slug: 'fren-sistemi',
    description: 'Disk, balata ve amortisör değişimi.',
    Icon: Disc3,
    span: 'col-span-2 md:col-span-2',
  },
  {
    id: 5,
    title: 'Kaporta & Boya',
    slug: 'kaporta',
    description: 'Estetik kusursuzluk.',
    Icon: Brush,
    span: 'col-span-1',
  },
  {
    id: 6,
    title: 'Klima',
    slug: 'klima',
    description: 'Maksimum konfor.',
    Icon: AirVent,
    span: 'col-span-1',
  },
  {
    id: 7,
    title: 'Lastik & Balans',
    slug: 'lastik',
    description: 'Güvenli sürüş için.',
    Icon: CircleDot,
    span: 'col-span-2 md:col-span-1',
  },
];

export default function ScrollCarCategories() {
  return (
    <section className="relative py-16 md:py-24 bg-secondary-100 overflow-hidden">
      {/* Arka Plan Dekoratif Elemanları */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-primary-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-[20%] w-[30%] h-[30%] bg-primary-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4 md:gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <span className="h-1 w-8 bg-primary-500 rounded-full"></span>
              <span className="text-primary-600 font-bold tracking-widest uppercase text-xs">Uzman Servis</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary-900 tracking-tight leading-tight">
              Aracınız İçin{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">Premium Bakım</span>
            </h2>
          </div>
          <div className="md:text-right">
             <p className="text-secondary-600 font-medium mb-3 md:mb-4 max-w-xs md:ml-auto text-sm md:text-base">
               Sertifikalı uzmanlar ile hizmetinizdeyiz.
             </p>
             <Link
               href="/servisler"
               className="group inline-flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-secondary-800 text-white rounded-full font-semibold text-sm md:text-base transition-all hover:bg-secondary-900 hover:shadow-lg hover:-translate-y-0.5"
             >
               Tüm Hizmetler
               <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
             </Link>
          </div>
        </div>

        {/* BENTO GRID LAYOUT - 2 columns on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/servisler?kategori=${service.slug}`}
              className={`${service.span} group relative bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-sm border border-secondary-200 overflow-hidden hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-300 transition-all duration-500`}
            >
              {/* Kart Hover Gradient Efekti */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  {/* İkon */}
                  <div className="inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary-500 text-secondary-900 shadow-lg mb-3 md:mb-6 group-hover:scale-110 group-hover:bg-primary-400 transition-all duration-500">
                    <service.Icon className="w-5 h-5 md:w-7 md:h-7" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-base md:text-2xl font-bold text-secondary-900 mb-1 md:mb-3 group-hover:text-primary-700 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-secondary-500 leading-relaxed text-xs md:text-base hidden md:block">
                    {service.description}
                  </p>
                </div>

                <div className="hidden md:flex items-center text-sm font-bold text-secondary-800 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 mt-4">
                  <span>Detayları İncele</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>

              {/* Dekoratif Arka Plan İkonu */}
              <service.Icon className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 w-20 h-20 md:w-40 md:h-40 text-secondary-100 opacity-0 group-hover:opacity-100 group-hover:text-primary-100 transition-all duration-700 -rotate-12 group-hover:rotate-0" strokeWidth={0.5} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
