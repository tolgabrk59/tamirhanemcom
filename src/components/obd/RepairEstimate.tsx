'use client';

import { Calculator, Clock, Package, Wrench, AlertTriangle, Check } from 'lucide-react';
import { PartItem } from '@/types';

interface RepairEstimateProps {
  laborHours?: number;
  partsList?: PartItem[];
  estimatedCostMin: number | null;
  estimatedCostMax: number | null;
}

export default function RepairEstimate({
  laborHours,
  partsList,
  estimatedCostMin,
  estimatedCostMax,
}: RepairEstimateProps) {
  // İşçilik ücreti tahmini (saat başı ortalama 500-800 TL)
  const laborRateMin = 500;
  const laborRateMax = 800;
  const laborCostMin = laborHours ? laborHours * laborRateMin : 0;
  const laborCostMax = laborHours ? laborHours * laborRateMax : 0;

  // Parça maliyeti hesapla
  const partsCostMin = partsList?.reduce((sum, part) => sum + part.costMin, 0) || 0;
  const partsCostMax = partsList?.reduce((sum, part) => sum + part.costMax, 0) || 0;

  // Toplam maliyet
  const totalMin = estimatedCostMin || (laborCostMin + partsCostMin);
  const totalMax = estimatedCostMax || (laborCostMax + partsCostMax);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
      <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
        <Calculator className="w-6 h-6 text-emerald-500" />
        Tahmini Onarım Maliyeti
      </h2>

      {/* Toplam Maliyet */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white mb-6">
        <p className="text-emerald-100 text-sm mb-1">Toplam Tahmini Maliyet</p>
        <p className="text-3xl md:text-4xl font-bold">
          {formatCurrency(totalMin)} - {formatCurrency(totalMax)}
        </p>
        <p className="text-emerald-100 text-sm mt-2">Parça ve işçilik dahil</p>
      </div>

      {/* Maliyet Detayları */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* İşçilik */}
        {laborHours && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">İşçilik</h3>
            </div>
            <p className="text-2xl font-bold text-blue-700">
              {laborHours} saat
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {formatCurrency(laborCostMin)} - {formatCurrency(laborCostMax)}
            </p>
            <p className="text-xs text-blue-500 mt-1">
              Saat ücreti: {formatCurrency(laborRateMin)} - {formatCurrency(laborRateMax)}
            </p>
          </div>
        )}

        {/* Parça Maliyeti */}
        {partsList && partsList.length > 0 && (
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Parçalar</h3>
            </div>
            <p className="text-2xl font-bold text-purple-700">
              {partsList.length} kalem
            </p>
            <p className="text-sm text-purple-600 mt-1">
              {formatCurrency(partsCostMin)} - {formatCurrency(partsCostMax)}
            </p>
          </div>
        )}
      </div>

      {/* Parça Listesi */}
      {partsList && partsList.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-secondary-800 mb-3 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-secondary-500" />
            Gerekli Parçalar
          </h3>
          <div className="space-y-3">
            {partsList.map((part, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  part.isRequired
                    ? 'bg-red-50 border-red-100'
                    : 'bg-secondary-50 border-secondary-100'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      part.isRequired ? 'bg-red-100' : 'bg-secondary-200'
                    }`}>
                      {part.isRequired ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-secondary-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-secondary-800">{part.name}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {part.partNumber && (
                          <span className="text-xs bg-white px-2 py-0.5 rounded border border-secondary-200">
                            {part.partNumber}
                          </span>
                        )}
                        {part.brand && (
                          <span className="text-xs text-secondary-500">{part.brand}</span>
                        )}
                        {part.isRequired && (
                          <span className="text-xs text-red-600">Zorunlu</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-secondary-800">
                      {formatCurrency(part.costMin)} - {formatCurrency(part.costMax)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uyarı */}
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800 font-medium">Önemli Bilgi</p>
            <p className="text-sm text-amber-700">
              Tahmini maliyetler ortalama piyasa değerlerine dayanmaktadır.
              Gerçek maliyet; araç markası, model yılı, servis konumu ve parça kalitesine göre değişebilir.
              Kesin fiyat için servislerden teklif almanızı öneririz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
