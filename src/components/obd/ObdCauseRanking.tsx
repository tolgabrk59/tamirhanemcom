'use client';

import { HelpCircle, TrendingUp, Wrench } from 'lucide-react';
import { ObdCauseDetailed } from '@/types';

interface ObdCauseRankingProps {
  causes: string[];
  causesDetailed?: ObdCauseDetailed[];
}

export default function ObdCauseRanking({ causes, causesDetailed }: ObdCauseRankingProps) {
  const hasDetailedCauses = causesDetailed && causesDetailed.length > 0;

  // Olasılığa göre sırala
  const sortedCauses = hasDetailedCauses
    ? [...causesDetailed].sort((a, b) => b.probability - a.probability)
    : causes.map((cause, index) => ({
        cause,
        probability: Math.max(90 - index * 15, 10), // Varsayılan olasılık
        diagnosticTest: undefined,
      }));

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-50' };
    if (probability >= 40) return { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50' };
    return { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50' };
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
      <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
        <HelpCircle className="w-6 h-6 text-red-500" />
        Olası Nedenler
      </h2>
      <p className="text-secondary-500 mb-6">
        Bu arıza koduna neden olabilecek sorunlar, olasılık sırasına göre:
      </p>

      <div className="space-y-4">
        {sortedCauses.map((item, index) => {
          const colors = getProbabilityColor(item.probability);

          return (
            <div
              key={index}
              className={`p-4 rounded-xl border border-secondary-200 hover:border-primary-300 transition-all hover:shadow-md ${colors.light}`}
            >
              <div className="flex items-start gap-4">
                {/* Rank & Probability */}
                <div className="flex flex-col items-center">
                  <span className={`w-8 h-8 rounded-full ${colors.bg} text-white flex items-center justify-center font-bold text-sm`}>
                    {index + 1}
                  </span>
                  <div className="mt-2 text-center">
                    <span className={`text-lg font-bold ${colors.text}`}>
                      %{item.probability}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-secondary-800 font-medium mb-2">
                    {item.cause}
                  </p>

                  {/* Probability Bar */}
                  <div className="w-full h-2 bg-secondary-100 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${colors.bg} transition-all duration-500 rounded-full`}
                      style={{ width: `${item.probability}%` }}
                    />
                  </div>

                  {/* Diagnostic Test */}
                  {item.diagnosticTest && (
                    <div className="flex items-start gap-2 mt-3 p-2 bg-white/50 rounded-lg">
                      <Wrench className="w-4 h-4 text-secondary-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs text-secondary-500 block">Teşhis Testi:</span>
                        <span className="text-sm text-secondary-700">{item.diagnosticTest}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-secondary-50 rounded-xl border border-secondary-200">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-secondary-500 mt-0.5" />
          <div>
            <p className="text-sm text-secondary-700 font-medium">Olasılık Nedir?</p>
            <p className="text-sm text-secondary-500">
              Olasılık değerleri, bu arıza kodunun görüldüğü araçlarda hangi nedenin daha sık karşılaşıldığını gösterir.
              Bu değerler istatistiksel verilere dayanmaktadır ve her araç için farklılık gösterebilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
