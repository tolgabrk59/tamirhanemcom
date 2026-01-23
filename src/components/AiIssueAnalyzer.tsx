'use client';

import { useState } from 'react';
import { MapPin, FileText, Loader2, Car, AlertTriangle, Wrench, RotateCcw, Info } from 'lucide-react';

interface IssueResult {
  type: 'issue';
  category: string;
  urgency: string;
  urgency_color: 'green' | 'yellow' | 'red';
  analysis: string;
}

interface InfoResult {
  type: 'info';
  title: string;
  answer: string;
  related_category: string | null;
}

type AnalysisResult = IssueResult | InfoResult;

const categorySlugMap: Record<string, string> = {
  'Periyodik Bakım': 'motor-bakim',
  'Motor Mekanik': 'motor-bakim',
  'Kaporta Boya': 'kaporta',
  'Oto Elektrik & Elektronik': 'elektrik',
  'Lastik & Jant': 'lastik',
  'Fren Sistemi': 'fren-sistemi',
  'Şanzıman': 'sanziman',
  'Egzoz & Emisyon': 'egzoz',
  'Klima Servisi': 'klima',
  'Oto Kuaför & Detaylı Temizlik': 'oto-kuafor',
  'Oto Ekspertiz': 'ekspertiz',
};

export default function AiIssueAnalyzer() {
  const [issue, setIssue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeIssue = async () => {
    if (!issue.trim()) {
      setError('Lütfen aracınızdaki sorunu kısaca anlatın.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/issue-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue: issue.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analiz yapılamadı');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setIssue('');
    setError(null);
  };

  const getUrgencyStyle = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const handleCategoryClick = (category: string) => {
    const slug = categorySlugMap[category] || 'motor-bakim';
    window.location.href = `/servisler?kategori=${slug}`;
  };

  return (
    <div className="w-full">
      {/* Input Section - Sadece sonuç yokken göster */}
      {!result && (
        <div className="space-y-4">
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-sm font-medium">
                <Car className="w-4 h-4" />
                AI Arıza Analizi
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Yapay zeka destekli arıza analizi modülümüz ile aracınızdaki sorunu kısaca anlatın, sizi doğru servise yönlendirelim.
            </p>
          </div>

          <textarea
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition outline-none resize-none text-white placeholder:text-white/50"
            rows={3}
            placeholder="Örnek: Araç 80 km hızı geçince direksiyon titriyor ve frene basınca ses geliyor..."
          />

          <p className="text-red-400 text-xs">
            *Kişiselleştirilmiş sonuçlar için <span className="font-bold underline">üye girişi</span> yapmalısınız.
          </p>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={analyzeIssue}
              disabled={isLoading}
              className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-secondary-900 font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2 shadow-md hover:shadow-lg text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analiz Ediliyor...
                </>
              ) : (
                <>
                  <Wrench className="w-4 h-4" />
                  Ücretsiz Arıza Analizi
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Issue Result Section */}
      {result && result.type === 'issue' && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 animate-fadeInUp">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-secondary-900" />
              </div>
              <div>
                <h3 className="text-white font-bold">Analiz Sonucu</h3>
                <p className="text-white/50 text-xs">AI tarafından değerlendirildi</p>
              </div>
            </div>
            <button
              onClick={resetAnalysis}
              className="flex items-center gap-1 text-white/60 hover:text-white text-sm transition"
            >
              <RotateCcw className="w-4 h-4" />
              Yeni Analiz
            </button>
          </div>

          <div className="flex items-center justify-between mb-4 p-3 bg-white/5 rounded-xl">
            <div>
              <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Kategori</h4>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-secondary-900 rounded-lg font-bold text-sm">
                <Car className="w-4 h-4" />
                {result.category}
              </div>
            </div>
            <div className="text-right">
              <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Aciliyet</h4>
              <span className={`px-3 py-1.5 rounded-full text-sm font-bold border ${getUrgencyStyle(result.urgency_color)}`}>
                {result.urgency}
              </span>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-400" />
              Uzman Görüşü
            </h4>
            <p className="text-white/80 text-sm leading-relaxed">{result.analysis}</p>
          </div>

          <button
            onClick={() => handleCategoryClick(result.category)}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-secondary-900 rounded-xl font-bold transition shadow-md flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Bu Kategorideki Servisleri Listele
          </button>
        </div>
      )}

      {/* Info Result Section */}
      {result && result.type === 'info' && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 animate-fadeInUp">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">{result.title}</h3>
                <p className="text-white/50 text-xs">AI tarafından yanıtlandı</p>
              </div>
            </div>
            <button
              onClick={resetAnalysis}
              className="flex items-center gap-1 text-white/60 hover:text-white text-sm transition"
            >
              <RotateCcw className="w-4 h-4" />
              Yeni Soru
            </button>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
            <p className="text-white/90 text-sm leading-relaxed">{result.answer}</p>
          </div>

          {result.related_category && (
            <button
              onClick={() => handleCategoryClick(result.related_category!)}
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-secondary-900 rounded-xl font-bold transition shadow-md flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              {result.related_category} Servisleri
            </button>
          )}
        </div>
      )}
    </div>
  );
}
