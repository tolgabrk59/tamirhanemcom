'use client';

import React from 'react';
import {
  Shield,
  Wrench,
  Car,
  Recycle,
} from 'lucide-react';

interface Service {
  id: number;
  title: string;
  shortTitle: string;
  status: 'completed' | 'active' | 'upcoming';
  icon: React.ReactNode;
  description: string;
}

const CarWashIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="12" cy="3" r="1.5" />
    <circle cx="17" cy="5" r="1" />
    <circle cx="7" cy="5" r="1" />
  </svg>
);

const ServiceTimeline: React.FC = () => {
  const services: Service[] = [
    {
      id: 1,
      title: 'Tamirhanem',
      shortTitle: 'Yıkama',
      status: 'active',
      icon: <CarWashIcon size={16} />,
      description: 'Oto Yıkama'
    },
    {
      id: 2,
      title: 'Tamirhanem Sanayii',
      shortTitle: 'Sanayii',
      status: 'upcoming',
      icon: <Wrench size={16} />,
      description: 'Bakım & Onarım'
    },
    {
      id: 3,
      title: 'Oto Kiralama',
      shortTitle: 'Kiralama',
      status: 'upcoming',
      icon: <Car size={16} />,
      description: 'Günlük ve Filo Kiralama'
    },
    {
      id: 4,
      title: 'Oto Sigorta',
      shortTitle: 'Sigorta',
      status: 'upcoming',
      icon: <Shield size={16} />,
      description: 'Kasko ve Trafik Sigortası'
    },
    {
      id: 5,
      title: '2.El Parça',
      shortTitle: 'Parça',
      status: 'upcoming',
      icon: <Recycle size={16} />,
      description: 'Yedek Parça Tedarik'
    },
  ];

  const getStatusColor = (status: Service['status']) => {
    switch (status) {
      case 'completed': return 'bg-success-500 text-white border-success-500';
      case 'active': return 'bg-primary-500 text-secondary-900 border-primary-500 ring-2 ring-primary-300';
      case 'upcoming': return 'bg-gray-800 text-white/50 border-white/20';
      default: return 'bg-gray-800';
    }
  };

  return (
    <div className="w-full py-2 sm:py-4">
      <div className="relative px-2 sm:px-4 md:px-8 lg:pl-32 lg:pr-16">
        {/* Connecting Line - Full width behind circles */}
        <div className="absolute top-4 sm:top-5 left-2 sm:left-4 md:left-8 lg:left-32 right-2 sm:right-4 md:right-8 lg:right-16 h-0.5 flex z-0">
          {services.map((service, index) => (
            <div
              key={`line-${service.id}`}
              className={`flex-1 h-full ${
                index === 0
                  ? 'bg-gradient-to-r from-primary-500 to-primary-500/50'
                  : 'bg-white/20'
              } ${index === services.length - 1 ? 'hidden' : ''}`}
            />
          ))}
        </div>

        {/* Services */}
        <div className="flex items-start justify-between relative z-10">
          {services.map((service) => {
            const content = (
              <>
                {/* Circle */}
                <div className="relative">
                  {/* Pulse ring for active service */}
                  {service.status === 'active' && (
                    <>
                      <div className="absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary-500 rounded-full animate-ping opacity-30" />
                      <div className="absolute -inset-1 bg-primary-400/20 rounded-full animate-pulse" />
                    </>
                  )}
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110 relative z-10 ${getStatusColor(service.status)}`}>
                    {service.icon}
                  </div>
                </div>

                {/* Title - Short on mobile, full on desktop */}
                <span className={`mt-1 sm:mt-2 text-[10px] sm:text-xs font-semibold text-center ${
                  service.status === 'active' ? 'text-primary-400' : 'text-white/70'
                }`}>
                  <span className="sm:hidden">{service.shortTitle}</span>
                  <span className="hidden sm:inline">{service.title}</span>
                </span>

                {/* Description - Hidden on mobile */}
                <span className={`hidden sm:block text-[10px] text-center ${
                  service.status === 'active' ? 'text-primary-300' : 'text-white/40'
                }`}>
                  {service.description}
                </span>

                {/* Status Label */}
                <span className={`text-[8px] sm:text-[10px] font-medium mt-1 px-1.5 sm:px-2 py-0.5 rounded-full ${
                  service.status === 'active'
                    ? 'bg-primary-500/20 text-primary-300'
                    : 'bg-white/5 text-white/30'
                }`}>
                  {service.status === 'active' ? 'Aktif' : 'Yakında'}
                </span>
              </>
            );

            // Active service links to login page
            if (service.status === 'active') {
              return (
                <a
                  key={service.id}
                  href="https://app.tamirhanem.com/login.html"
                  className="flex flex-col items-center group cursor-pointer flex-1 hover:opacity-90 transition-opacity"
                >
                  {content}
                </a>
              );
            }

            return (
              <div key={service.id} className="flex flex-col items-center group cursor-default flex-1">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServiceTimeline;
