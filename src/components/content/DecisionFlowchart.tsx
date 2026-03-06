'use client';

import { useState, useCallback } from 'react';
import { ArrowRight, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import type { DecisionFlowStep } from '@/types';

interface DecisionFlowchartProps {
  steps: DecisionFlowStep[];
}

interface HistoryItem {
  stepId: number;
  question: string;
  answer: string;
}

export default function DecisionFlowchart({ steps }: DecisionFlowchartProps) {
  const [currentStepId, setCurrentStepId] = useState(1);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [result, setResult] = useState<{
    action?: string;
    warning?: string;
  } | null>(null);

  const currentStep = steps.find((s) => s.id === currentStepId);

  const handleOptionClick = useCallback((option: {
    text: string;
    nextStepId: number | null;
    action?: string;
    warning?: string;
  }) => {
    if (currentStep) {
      setHistory((prev) => [
        ...prev,
        {
          stepId: currentStep.id,
          question: currentStep.question,
          answer: option.text,
        },
      ]);
    }

    if (option.nextStepId) {
      setCurrentStepId(option.nextStepId);
    } else if (option.action || option.warning) {
      setResult({
        action: option.action,
        warning: option.warning,
      });
    }
  }, [currentStep]);

  const handleReset = useCallback(() => {
    setCurrentStepId(1);
    setHistory([]);
    setResult(null);
  }, []);

  const handleBack = useCallback(() => {
    if (history.length > 0) {
      const lastItem = history[history.length - 1];
      setCurrentStepId(lastItem.stepId);
      setHistory((prev) => prev.slice(0, -1));
      setResult(null);
    }
  }, [history]);

  // Show result
  if (result) {
    return (
      <div className="space-y-4">
        {/* History summary */}
        {history.length > 0 && (
          <div className="bg-secondary-50 rounded-xl p-4">
            <h4 className="font-medium text-secondary-700 text-sm mb-2">Cevaplarınız:</h4>
            <div className="space-y-2">
              {history.map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <span className="text-secondary-500">{item.question}</span>
                    <span className="mx-1">→</span>
                    <span className="text-secondary-800 font-medium">{item.answer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result card */}
        <div className={`rounded-xl p-5 ${result.warning ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
          <div className="flex items-start gap-3">
            {result.warning ? (
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            )}
            <div>
              {result.warning && (
                <p className="text-red-800 font-semibold mb-2">
                  {result.warning}
                </p>
              )}
              {result.action && (
                <p className={result.warning ? 'text-red-700' : 'text-green-800'}>
                  {result.action}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Baştan Başla
        </button>
      </div>
    );
  }

  // Show current question
  if (!currentStep) {
    return (
      <div className="text-center py-8 text-secondary-500">
        Adım bulunamadı.
        <button onClick={handleReset} className="text-primary-600 ml-2">
          Baştan başla
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      {history.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-secondary-500">
          <span>Adım {history.length + 1}</span>
          <button
            onClick={handleBack}
            className="text-primary-600 hover:text-primary-700"
          >
            ← Geri
          </button>
        </div>
      )}

      {/* Question */}
      {currentStep.question && (
        <div className="bg-primary-50 rounded-xl p-4">
          <h3 className="font-semibold text-primary-800">
            {currentStep.question}
          </h3>
        </div>
      )}

      {/* Options */}
      <div className="space-y-2">
        {currentStep.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className="w-full flex items-center justify-between p-4 bg-white border-2 border-secondary-200 hover:border-primary-400 rounded-xl transition-colors text-left group"
          >
            <span className="text-secondary-700 group-hover:text-primary-700 font-medium">
              {option.text}
            </span>
            <ArrowRight className="w-5 h-5 text-secondary-400 group-hover:text-primary-500" />
          </button>
        ))}
      </div>

      {/* History summary (collapsed) */}
      {history.length > 0 && (
        <details className="text-sm">
          <summary className="text-secondary-500 cursor-pointer hover:text-secondary-700">
            Önceki cevaplar ({history.length})
          </summary>
          <div className="mt-2 pl-4 border-l-2 border-secondary-200 space-y-1">
            {history.map((item, index) => (
              <div key={index} className="text-secondary-600">
                <span className="font-medium">{item.answer}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
