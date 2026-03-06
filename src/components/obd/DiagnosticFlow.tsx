'use client';

import { useState } from 'react';
import Link from 'next/link';
import { diagnosticFlows, getFlowById, getStepById, type DiagnosticFlow, type DiagnosticStep } from '@/data/diagnostic-flows';

const severityConfig = {
  low: { color: 'bg-success-100 text-success-700 border-success-200', label: 'Düşük Öncelik' },
  medium: { color: 'bg-warning-100 text-warning-700 border-warning-200', label: 'Orta Öncelik' },
  high: { color: 'bg-error-100 text-error-700 border-error-200', label: 'Yüksek Öncelik' },
  critical: { color: 'bg-error-200 text-error-800 border-error-300', label: 'Acil!' }
};

const iconMap: Record<string, React.ReactNode> = {
  engine: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  thermometer: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  disc: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

export default function DiagnosticFlowSelector() {
  const [selectedFlow, setSelectedFlow] = useState<DiagnosticFlow | null>(null);

  if (selectedFlow) {
    return (
      <DiagnosticFlowRunner
        flow={selectedFlow}
        onReset={() => setSelectedFlow(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary-800 mb-2">Bir Sorun Seçin</h2>
        <p className="text-secondary-600">Adım adım sorularla arıza teşhisi yapın</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {diagnosticFlows.map((flow) => (
          <button
            key={flow.id}
            onClick={() => setSelectedFlow(flow)}
            className="bg-white rounded-xl border border-secondary-100 p-6 text-left hover:border-primary-300 hover:shadow-lg transition-all group"
          >
            <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors">
              {iconMap[flow.icon] || iconMap.engine}
            </div>
            <h3 className="text-lg font-bold text-secondary-800 mb-2">{flow.title}</h3>
            <p className="text-sm text-secondary-600 mb-4">{flow.description}</p>
            <div className="flex items-center gap-4 text-xs text-secondary-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {flow.estimatedTime}
              </span>
              <span className={`px-2 py-0.5 rounded ${
                flow.difficulty === 'kolay' ? 'bg-success-100 text-success-700' :
                flow.difficulty === 'orta' ? 'bg-warning-100 text-warning-700' :
                'bg-error-100 text-error-700'
              }`}>
                {flow.difficulty}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DiagnosticFlowRunner({ flow, onReset }: { flow: DiagnosticFlow; onReset: () => void }) {
  const [currentStepId, setCurrentStepId] = useState(flow.startStepId);
  const [history, setHistory] = useState<string[]>([]);

  const currentStep = getStepById(flow, currentStepId);

  const handleOptionClick = (nextStepId: string | null) => {
    if (nextStepId) {
      setHistory([...history, currentStepId]);
      setCurrentStepId(nextStepId);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prevStep = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentStepId(prevStep);
    }
  };

  const handleRestart = () => {
    setCurrentStepId(flow.startStepId);
    setHistory([]);
  };

  if (!currentStep) {
    return (
      <div className="text-center py-8">
        <p className="text-error-600">Adım bulunamadı</p>
        <button onClick={onReset} className="mt-4 text-primary-600">
          Geri dön
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-secondary-600 hover:text-secondary-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Akış Seçimine Dön
        </button>
        <div className="flex items-center gap-2 text-sm text-secondary-500">
          <span>Adım {history.length + 1}</span>
          <span>·</span>
          <span>{flow.title}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 transition-all duration-300"
          style={{ width: `${Math.min((history.length + 1) * 20, 100)}%` }}
        />
      </div>

      {/* Current Step */}
      <div className="bg-white rounded-2xl border border-secondary-100 p-8">
        {/* Safety Warning */}
        {currentStep.safetyWarning && (
          <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl flex items-start gap-3">
            <svg className="w-6 h-6 text-error-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-error-800 font-medium">{currentStep.safetyWarning}</p>
          </div>
        )}

        {/* Question or Instruction */}
        {currentStep.question && (
          <h3 className="text-2xl font-bold text-secondary-800 mb-6">{currentStep.question}</h3>
        )}

        {currentStep.instruction && (
          <div className="mb-6 p-4 bg-info-50 border border-info-200 rounded-xl">
            <p className="text-info-800">{currentStep.instruction}</p>
          </div>
        )}

        {/* Options */}
        {currentStep.options && (
          <div className="space-y-3">
            {currentStep.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option.nextStepId)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  option.warning
                    ? 'border-warning-300 bg-warning-50 hover:bg-warning-100'
                    : 'border-secondary-200 hover:border-primary-400 hover:bg-primary-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-secondary-800">{option.label}</span>
                  <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                {option.warning && (
                  <p className="text-sm text-warning-700 mt-1">{option.warning}</p>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Conclusion */}
        {currentStep.conclusion && (
          <ConclusionCard conclusion={currentStep.conclusion} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={history.length === 0}
          className="flex items-center gap-2 px-4 py-2 text-secondary-600 hover:text-secondary-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Önceki Adım
        </button>
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-4 py-2 text-secondary-600 hover:text-secondary-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Baştan Başla
        </button>
      </div>
    </div>
  );
}

function ConclusionCard({ conclusion }: { conclusion: DiagnosticStep['conclusion'] }) {
  if (!conclusion) return null;

  const severity = severityConfig[conclusion.severity];

  return (
    <div className="space-y-6">
      {/* Title & Severity */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-2xl font-bold text-secondary-800">{conclusion.title}</h3>
        <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${severity.color}`}>
          {severity.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-secondary-600">{conclusion.description}</p>

      {/* OBD Codes */}
      {conclusion.obdCodes && conclusion.obdCodes.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-secondary-700 mb-2">Olası OBD Kodları:</h4>
          <div className="flex flex-wrap gap-2">
            {conclusion.obdCodes.map((code) => (
              <Link
                key={code}
                href={`/obd/${code.toLowerCase()}`}
                className="px-3 py-1.5 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg font-mono text-sm transition-colors"
              >
                {code}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Action */}
      <div className="p-4 bg-secondary-50 rounded-xl">
        <h4 className="font-semibold text-secondary-800 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Önerilen Aksiyon
        </h4>
        <p className="text-secondary-600">{conclusion.action}</p>
      </div>

      {/* Estimated Cost */}
      {conclusion.estimatedCost && (
        <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
          <span className="text-secondary-700">Tahmini Maliyet:</span>
          <span className="text-xl font-bold text-primary-600">{conclusion.estimatedCost}</span>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        {conclusion.obdCodes && conclusion.obdCodes.length > 0 && (
          <Link
            href={`/obd/${conclusion.obdCodes[0].toLowerCase()}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-secondary-900 rounded-xl font-semibold transition-colors"
          >
            Kod Detaylarını Gör
          </Link>
        )}
        <Link
          href="/randevu-al"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-secondary-800 hover:bg-secondary-900 text-white rounded-xl font-semibold transition-colors"
        >
          Servis Randevusu Al
        </Link>
      </div>
    </div>
  );
}
