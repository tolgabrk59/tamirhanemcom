'use client';

import { useState } from 'react';

export default function BusinessDashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl border border-white/10 grid lg:grid-cols-[240px_1fr] min-h-[520px]">
            {/* Sidebar */}
            <div className="bg-[#111] p-6 border-r border-white/10 hidden lg:block">
                <div className="text-white font-bold mb-8 flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    İŞLETME PANELİ
                </div>

                <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'overview'
                            ? 'bg-primary-500 text-gray-900'
                            : 'text-white/50 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Genel Bakış
                </button>

                <button
                    onClick={() => setActiveTab('appointments')}
                    className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'appointments'
                            ? 'bg-primary-500 text-gray-900'
                            : 'text-white/50 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Randevular
                </button>

                <button
                    onClick={() => setActiveTab('offers')}
                    className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'offers'
                            ? 'bg-primary-500 text-gray-900'
                            : 'text-white/50 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Teklifler
                    <span className="ml-auto bg-primary-500 text-gray-900 text-xs px-2 py-0.5 rounded-md font-bold">2</span>
                </button>

                <button
                    onClick={() => setActiveTab('finance')}
                    className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'finance'
                            ? 'bg-primary-500 text-gray-900'
                            : 'text-white/50 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Finans
                </button>
            </div>

            {/* Main Content */}
            <div className="bg-[#1a1a1a] p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-white text-xl font-bold">Hoş Geldiniz</h3>
                    <div className="bg-green-700 text-green-100 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        AÇIK
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="animate-fadeIn">
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
                            <div className="bg-[#222] rounded-xl p-5 border border-white/10">
                                <div className="text-sm text-white/50 mb-2">Bugünkü Randevu</div>
                                <div className="text-3xl font-bold text-primary-500">8</div>
                            </div>
                            <div className="bg-[#222] rounded-xl p-5 border border-white/10">
                                <div className="text-sm text-white/50 mb-2">Bekleyen Teklif</div>
                                <div className="text-3xl font-bold text-white">12</div>
                            </div>
                            <div className="bg-[#222] rounded-xl p-5 border border-white/10">
                                <div className="text-sm text-white/50 mb-2">Bu Ay Ciro</div>
                                <div className="text-3xl font-bold text-white">₺45K</div>
                            </div>
                        </div>

                        {/* Son İşlemler */}
                        <div className="bg-[#222] rounded-xl p-5 border border-white/10">
                            <h4 className="text-white font-semibold mb-4 text-sm">Son İşlemler</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-4 bg-[#2a2a2a] rounded-lg transition-colors hover:bg-[#333]">
                                    <div>
                                        <div className="text-white text-sm font-semibold mb-1">34 TR 1923</div>
                                        <div className="text-white/50 text-xs">Periyodik Bakım • Ahmet U.</div>
                                    </div>
                                    <span className="bg-yellow-900 text-yellow-100 px-3 py-1 rounded-md text-xs font-bold">Devam Ediyor</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-[#2a2a2a] rounded-lg transition-colors hover:bg-[#333]">
                                    <div>
                                        <div className="text-white text-sm font-semibold mb-1">06 ANK 2024</div>
                                        <div className="text-white/50 text-xs">Fren Balata • Mehmet K.</div>
                                    </div>
                                    <span className="bg-green-700 text-green-100 px-3 py-1 rounded-md text-xs font-bold">Tamamlandı</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Appointments Tab */}
                {activeTab === 'appointments' && (
                    <div className="animate-fadeIn">
                        <h4 className="text-white font-semibold mb-6 text-lg">Bugünün Programı</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-[#222] p-5 rounded-xl border border-white/10">
                                <div className="bg-[#333] px-4 py-3 rounded-lg font-bold text-white text-sm">09:00</div>
                                <div className="flex-1">
                                    <div className="text-white font-semibold mb-1">34 KM 555</div>
                                    <div className="text-white/60 text-sm">Yağ Değişimi</div>
                                </div>
                                <span className="bg-green-700 text-green-100 px-3 py-1 rounded-md text-xs font-bold">Geldi</span>
                            </div>
                            <div className="flex items-center gap-4 bg-[#222] p-5 rounded-xl border border-white/10">
                                <div className="bg-[#333] px-4 py-3 rounded-lg font-bold text-white text-sm">10:30</div>
                                <div className="flex-1">
                                    <div className="text-white font-semibold mb-1">35 KS 222</div>
                                    <div className="text-white/60 text-sm">Kış Bakımı</div>
                                </div>
                                <span className="bg-yellow-900 text-yellow-100 px-3 py-1 rounded-md text-xs font-bold">Bekleniyor</span>
                            </div>
                            <div className="flex items-center gap-4 bg-[#222] p-5 rounded-xl border border-white/10">
                                <div className="bg-[#333] px-4 py-3 rounded-lg font-bold text-white text-sm">14:00</div>
                                <div className="flex-1">
                                    <div className="text-white font-semibold mb-1">07 ANT 07</div>
                                    <div className="text-white/60 text-sm">Arıza Tespit</div>
                                </div>
                                <span className="bg-green-700 text-green-100 px-3 py-1 rounded-md text-xs font-bold">Onaylı</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Offers Tab */}
                {activeTab === 'offers' && (
                    <div className="animate-fadeIn">
                        <h4 className="text-white font-semibold mb-6 text-lg">Yanıt Bekleyen Talepler</h4>
                        <div className="bg-[#222] rounded-xl p-6 border border-primary-500/50">
                            <div className="flex justify-between mb-4">
                                <strong className="text-white text-base">Triger Seti Değişimi</strong>
                                <span className="text-white/40 text-xs">10 dk önce</span>
                            </div>
                            <p className="text-white/70 text-sm mb-6 leading-relaxed">
                                2018 Volkswagen Passat 1.6 TDI için triger seti değişimi. Orijinal parça tercihi var.
                            </p>
                            <div className="flex gap-3">
                                <button className="flex-1 bg-primary-500 hover:bg-primary-600 text-gray-900 py-3 rounded-lg font-bold text-sm transition-colors">
                                    Teklif Ver
                                </button>
                                <button className="flex-1 bg-[#333] hover:bg-[#444] text-white py-3 rounded-lg text-sm transition-colors">
                                    Reddet
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Finance Tab */}
                {activeTab === 'finance' && (
                    <div className="animate-fadeIn">
                        <h4 className="text-white font-semibold mb-6 text-lg">Finansal Özet</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-green-700 p-6 rounded-xl text-white">
                                <div className="text-sm opacity-80 mb-2">Bu Ay Tahsilat</div>
                                <div className="text-3xl font-bold">₺124,500</div>
                            </div>
                            <div className="bg-yellow-900 p-6 rounded-xl text-white">
                                <div className="text-sm opacity-80 mb-2">Bloke Tutar</div>
                                <div className="text-3xl font-bold">₺8,250</div>
                            </div>
                        </div>
                        <div className="bg-[#222] rounded-xl p-5 border border-white/10">
                            <div className="text-sm text-white/50 mb-4">Son Hareketler</div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-4 bg-[#2a2a2a] rounded-lg">
                                    <span className="text-white text-sm">Hakediş Ödemesi</span>
                                    <span className="text-green-400 font-bold text-sm">+ ₺45,000</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-[#2a2a2a] rounded-lg">
                                    <span className="text-white text-sm">Parça Alımı</span>
                                    <span className="text-red-400 font-bold text-sm">- ₺12,000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}
