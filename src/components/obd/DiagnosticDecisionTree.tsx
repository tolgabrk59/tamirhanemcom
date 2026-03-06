'use client';

import { useState } from 'react';
import { GitBranch, ArrowRight, CheckCircle, AlertCircle, RotateCcw, Wrench, Clock } from 'lucide-react';
import { DiagnosticTree, DiagnosticTreeStep } from '@/types';

interface DiagnosticDecisionTreeProps {
  diagnosticTree?: DiagnosticTree;
  obdCode: string;
}

// Varsayılan teşhis ağacı (kod yoksa)
const getDefaultTree = (obdCode: string): DiagnosticTree => ({
  codeId: obdCode,
  estimatedTime: '15-30 dakika',
  steps: [
    {
      id: 1,
      question: 'Arıza lambası sürekli mi yanıyor yoksa yanıp sönüyor mu?',
      yesNext: 2,
      noNext: 3,
      action: 'Arıza lambasını gözlemleyin',
    },
    {
      id: 2,
      question: 'Araçta performans kaybı veya titreme var mı?',
      yesNext: 4,
      noNext: 5,
      action: 'Aracı çalıştırın ve gözlemleyin',
    },
    {
      id: 3,
      question: 'Arıza kodu geçici mi (temizlendikten sonra geri gelmiyor)?',
      yesNext: 6,
      noNext: 4,
      action: 'Kodu temizleyin ve 50km sürün',
    },
    {
      id: 4,
      question: null,
      yesNext: null,
      noNext: null,
      conclusion: 'Profesyonel servis önerilir. Muhtemelen fiziksel bir arıza var.',
      toolRequired: 'OBD-II tarayıcı, multimetre',
    },
    {
      id: 5,
      question: null,
      yesNext: null,
      noNext: null,
      conclusion: 'Sensör temizliği veya yazılım güncelleme deneyebilirsiniz.',
    },
    {
      id: 6,
      question: null,
      yesNext: null,
      noNext: null,
      conclusion: 'Geçici bir sorun olabilir. İzlemeye devam edin.',
    },
  ],
});

export default function DiagnosticDecisionTree({ diagnosticTree, obdCode }: DiagnosticDecisionTreeProps) {
  const tree = diagnosticTree || getDefaultTree(obdCode);
  const [currentStepId, setCurrentStepId] = useState(1);
  const [history, setHistory] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const currentStep = tree.steps.find((s) => s.id === currentStepId);

  const handleAnswer = (answer: 'yes' | 'no') => {
    if (!currentStep) return;

    const nextId = answer === 'yes' ? currentStep.yesNext : currentStep.noNext;

    if (nextId === null) {
      setIsComplete(true);
      return;
    }

    setHistory([...history, currentStepId]);
    setCurrentStepId(nextId);

    const nextStep = tree.steps.find((s) => s.id === nextId);
    if (nextStep && nextStep.conclusion) {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prevId = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setCurrentStepId(prevId);
    setIsComplete(false);
  };

  const handleReset = () => {
    setCurrentStepId(1);
    setHistory([]);
    setIsComplete(false);
  };

  const progress = ((history.length + 1) / tree.steps.filter((s) => s.question).length) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-secondary-900 flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-purple-500" />
          İnteraktif Teşhis Rehberi
        </h2>
        {tree.estimatedTime && (
          <div className="flex items-center gap-1.5 text-sm text-secondary-500">
            <Clock className="w-4 h-4" />
            <span>{tree.estimatedTime}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-secondary-500 mb-2">
          <span>İlerleme</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-secondary-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Step */}
      {!isComplete && currentStep && currentStep.question && (
        <div className="mb-6">
          {/* Action hint */}
          {currentStep.action && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mb-4">
              <Wrench className="w-4 h-4 text-blue-600 mt-0.5" />
              <span className="text-sm text-blue-700">{currentStep.action}</span>
            </div>
          )}

          {/* Question */}
          <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
            <p className="text-lg text-secondary-800 font-medium mb-6">
              {currentStep.question}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleAnswer('yes')}
                className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Evet
              </button>
              <button
                onClick={() => handleAnswer('no')}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-5 h-5" />
                Hayır
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conclusion */}
      {isComplete && currentStep && (
        <div className="mb-6">
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 mb-2">Teşhis Sonucu</h3>
                <p className="text-green-700">{currentStep.conclusion}</p>
              </div>
            </div>

            {currentStep.toolRequired && (
              <div className="flex items-start gap-2 p-3 bg-white/50 rounded-lg mt-4">
                <Wrench className="w-4 h-4 text-secondary-500 mt-0.5" />
                <div>
                  <span className="text-xs text-secondary-500 block">Gerekli Ekipman:</span>
                  <span className="text-sm text-secondary-700">{currentStep.toolRequired}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-secondary-100">
        <button
          onClick={handleBack}
          disabled={history.length === 0}
          className="flex items-center gap-2 text-secondary-600 hover:text-secondary-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Geri
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
        >
          <RotateCcw className="w-4 h-4" />
          Baştan Başla
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-6 pt-4 border-t border-secondary-100">
          <p className="text-sm text-secondary-500 mb-2">Geçmiş Adımlar:</p>
          <div className="flex flex-wrap gap-2">
            {history.map((stepId, index) => {
              const step = tree.steps.find((s) => s.id === stepId);
              return (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-secondary-100 text-secondary-600 rounded-full"
                >
                  {index + 1}. {step?.question?.slice(0, 30)}...
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
