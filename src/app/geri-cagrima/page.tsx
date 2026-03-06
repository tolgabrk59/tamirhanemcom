'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GeriCagirma {
    id: number;
    attributes: {
        kampanya_no: string;
        marka: string;
        model: string;
        yil: number | null;
        uretici: string;
        bilesen: string;
        sikayet: string;
        sonuc: string;
        cozum: string;
        geri_cagirma_tarihi: string | null;
        veri_kaynagi: string;
    };
}

export default function RecallsPage() {
    const [markalar, setMarkalar] = useState<string[]>([]);
    const [modeller, setModeller] = useState<string[]>([]);
    const [yillar, setYillar] = useState<number[]>([]);

    const [selectedMarka, setSelectedMarka] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedYil, setSelectedYil] = useState('');

    const [results, setResults] = useState<GeriCagirma[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Markaları yükle
    useEffect(() => {
        const fetchMarkalar = async () => {
            try {
                const res = await fetch('/api/geri-cagirmalar/markalar');
                const data = await res.json();
                setMarkalar(data.markalar || []);
            } catch (error) {
                console.error('Markalar yüklenemedi:', error);
            }
        };
        fetchMarkalar();
    }, []);

    // Marka değiştiğinde modelleri yükle
    useEffect(() => {
        if (!selectedMarka) {
            setModeller([]);
            return;
        }

        const fetchModeller = async () => {
            try {
                const res = await fetch(`/api/geri-cagirmalar/modeller?marka=${encodeURIComponent(selectedMarka)}`);
                const data = await res.json();
                setModeller(data.modeller || []);
            } catch (error) {
                console.error('Modeller yüklenemedi:', error);
            }
        };
        fetchModeller();
        setSelectedModel('');
    }, [selectedMarka]);

    // Model değiştiğinde yılları yükle
    useEffect(() => {
        if (!selectedMarka || !selectedModel) {
            setYillar([]);
            return;
        }

        const fetchYillar = async () => {
            try {
                const res = await fetch(`/api/geri-cagirmalar/yillar?marka=${encodeURIComponent(selectedMarka)}&model=${encodeURIComponent(selectedModel)}`);
                const data = await res.json();
                setYillar(data.yillar || []);
            } catch (error) {
                console.error('Yıllar yüklenemedi:', error);
            }
        };
        fetchYillar();
        setSelectedYil('');
    }, [selectedMarka, selectedModel]);

    const handleSearch = async () => {
        if (!selectedMarka) return;

        setLoading(true);
        setSearched(true);

        try {
            const params = new URLSearchParams();
            params.append('marka', selectedMarka);
            if (selectedModel) params.append('model', selectedModel);
            if (selectedYil) params.append('yil', selectedYil);

            const res = await fetch(`/api/geri-cagirmalar?${params.toString()}`);
            const data = await res.json();
            setResults(data.data || []);
        } catch (error) {
            console.error('Arama hatası:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        try {
            return new Date(dateStr).toLocaleDateString('tr-TR');
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="min-h-screen bg-secondary-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-10"
                    style={{
                        backgroundImage: 'url(/hero_service_background.png)',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}
                ></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-semibold">NHTSA Güvenlik Bildirimleri</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Araç Geri Çağırmaları
                        </h1>
                        <p className="text-xl text-primary-100 mb-6">
                            Aracınızın güvenliğini sağlayın. <strong>1.663</strong> güncel geri çağırma bildirimini kontrol edin.
                        </p>
                    </div>
                </div>
            </section>

            {/* Search Section */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                            Aracınız İçin Geri Çağırma Kontrolü
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Marka
                                </label>
                                <select
                                    value={selectedMarka}
                                    onChange={(e) => setSelectedMarka(e.target.value)}
                                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="">Marka Seçin</option>
                                    {markalar.map((marka) => (
                                        <option key={marka} value={marka}>{marka}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Model
                                </label>
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    disabled={!selectedMarka}
                                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100"
                                >
                                    <option value="">Tüm Modeller</option>
                                    {modeller.map((model) => (
                                        <option key={model} value={model}>{model}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Yıl
                                </label>
                                <select
                                    value={selectedYil}
                                    onChange={(e) => setSelectedYil(e.target.value)}
                                    disabled={!selectedModel}
                                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100"
                                >
                                    <option value="">Tüm Yıllar</option>
                                    {yillar.map((yil) => (
                                        <option key={yil} value={yil}>{yil}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={handleSearch}
                                    disabled={!selectedMarka || loading}
                                    className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Aranıyor...' : 'Sorgula'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                            <p className="text-sm text-primary-800">
                                <strong>Kaynak:</strong> NHTSA (National Highway Traffic Safety Administration) - ABD Ulusal Karayolu Trafik Güvenliği İdaresi
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            {searched && (
                <section className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-secondary-900">
                                Sonuçlar
                                <span className="ml-2 text-sm font-normal text-secondary-500">
                                    ({results.length} kayıt bulundu)
                                </span>
                            </h3>
                        </div>

                        {results.length === 0 ? (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h4 className="text-xl font-bold text-green-800 mb-2">
                                    Geri Çağırma Bulunamadı
                                </h4>
                                <p className="text-green-700">
                                    Seçtiğiniz kriterlere uygun geri çağırma kaydı bulunmamaktadır.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {results.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-xl shadow-md overflow-hidden"
                                    >
                                        <div
                                            className="p-6 cursor-pointer hover:bg-secondary-50 transition-colors"
                                            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded">
                                                            {item.attributes.kampanya_no}
                                                        </span>
                                                        <span className="text-secondary-500 text-sm">
                                                            {formatDate(item.attributes.geri_cagirma_tarihi)}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-lg font-bold text-secondary-900 mb-1">
                                                        {item.attributes.marka} {item.attributes.model} ({item.attributes.yil || '-'})
                                                    </h4>
                                                    <p className="text-secondary-600 text-sm line-clamp-2">
                                                        {item.attributes.bilesen}
                                                    </p>
                                                </div>
                                                <svg
                                                    className={`w-6 h-6 text-secondary-400 transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {expandedId === item.id && (
                                            <div className="px-6 pb-6 border-t border-secondary-100">
                                                <div className="pt-4 space-y-4">
                                                    <div>
                                                        <h5 className="font-semibold text-secondary-900 mb-2 flex items-center gap-2">
                                                            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            Sorun
                                                        </h5>
                                                        <p className="text-secondary-700 text-sm leading-relaxed">
                                                            {item.attributes.sikayet || '-'}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <h5 className="font-semibold text-secondary-900 mb-2 flex items-center gap-2">
                                                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            Olası Sonuçlar
                                                        </h5>
                                                        <p className="text-secondary-700 text-sm leading-relaxed">
                                                            {item.attributes.sonuc || '-'}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <h5 className="font-semibold text-secondary-900 mb-2 flex items-center gap-2">
                                                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            Çözüm
                                                        </h5>
                                                        <p className="text-secondary-700 text-sm leading-relaxed">
                                                            {item.attributes.cozum || '-'}
                                                        </p>
                                                    </div>

                                                    <div className="pt-2 flex items-center gap-4 text-sm text-secondary-500">
                                                        <span>Üretici: {item.attributes.uretici}</span>
                                                        <span>•</span>
                                                        <span>Kaynak: {item.attributes.veri_kaynagi}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Info Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                                Geri Çağırma Nedir?
                            </h3>
                            <p className="text-secondary-600 mb-4">
                                Araç geri çağırmaları, üretici firmaların güvenlik veya emisyon standartlarına uymayan araçları düzeltmek için yaptığı kampanyalardır. Bu işlemler genellikle ücretsizdir.
                            </p>
                            <ul className="space-y-2 text-secondary-600">
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Güvenlik riski taşıyan parçaların değişimi
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Yazılım güncellemeleri
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Emisyon standartlarına uyum
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                                Ne Yapmalısınız?
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-secondary-900 mb-1">Kontrol Edin</h4>
                                        <p className="text-secondary-600 text-sm">
                                            Aracınız için aktif geri çağırma olup olmadığını düzenli olarak kontrol edin.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-secondary-900 mb-1">Randevu Alın</h4>
                                        <p className="text-secondary-600 text-sm">
                                            Geri çağırma varsa, yetkili servisten randevu alın. İşlem genellikle ücretsizdir.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-secondary-900 mb-1">İşlemi Yaptırın</h4>
                                        <p className="text-secondary-600 text-sm">
                                            Belirlenen tarihte servise giderek gerekli işlemleri yaptırın.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 bg-secondary-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                        Geri çağırma varsa ne yapmalıyım?
                    </h3>
                    <p className="text-secondary-600 mb-6">
                        Aracınız için geri çağırma kampanyası varsa, en yakın yetkili servisi bulun ve randevu alın.
                    </p>
                    <Link
                        href="/servisler"
                        className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-bold"
                    >
                        Yetkili Servisleri Bul
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>
        </div>
    );
}
