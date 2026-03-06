'use client';

import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { ObdSymptomDetailed } from '@/types';

interface ObdSymptomListProps {
  symptoms: string[];
  symptomsDetailed?: ObdSymptomDetailed[];
}

const severityConfig = {
  mild: {
    icon: Info,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    label: 'Hafif',
  },
  moderate: {
    icon: AlertCircle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    label: 'Orta',
  },
  severe: {
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    label: 'Ciddi',
  },
};

const frequencyConfig = {
  common: { label: 'Sık görülür', color: 'text-green-600' },
  occasional: { label: 'Bazen görülür', color: 'text-amber-600' },
  rare: { label: 'Nadir görülür', color: 'text-secondary-500' },
};

export default function ObdSymptomList({ symptoms, symptomsDetailed }: ObdSymptomListProps) {
  // Eğer detaylı semptom varsa onu göster, yoksa basit listeyi göster
  const hasDetailedSymptoms = symptomsDetailed && symptomsDetailed.length > 0;

  if (hasDetailedSymptoms) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-amber-500" />
          Belirtiler
        </h2>
        <p className="text-secondary-500 mb-6">
          Bu arıza koduyla ilişkili belirtiler ve ciddiyet dereceleri:
        </p>

        <div className="space-y-4">
          {symptomsDetailed.map((symptom, index) => {
            const config = severityConfig[symptom.severity];
            const freqConfig = frequencyConfig[symptom.frequency];
            const Icon = config.icon;

            return (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 ${config.border} ${config.bg} transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-secondary-800 font-medium">{symptom.symptom}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${config.bg} ${config.color} border ${config.border}`}>
                        {config.label}
                      </span>
                      <span className={`text-xs ${freqConfig.color}`}>
                        {freqConfig.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-secondary-100">
          <p className="text-sm text-secondary-500 mb-2">Ciddiyet Seviyeleri:</p>
          <div className="flex flex-wrap gap-4">
            {Object.entries(severityConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <div key={key} className="flex items-center gap-1.5 text-sm">
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <span className={config.color}>{config.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Basit semptom listesi (eski format)
  return (
    <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
      <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
        <AlertCircle className="w-6 h-6 text-amber-500" />
        Belirtiler
      </h2>
      <p className="text-secondary-500 mb-4">
        Bu arıza koduyla birlikte aşağıdaki belirtilerden birini veya birkaçını fark edebilirsiniz:
      </p>
      <ul className="space-y-3">
        {symptoms.map((symptom, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            </span>
            <span className="text-secondary-700">{symptom}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
