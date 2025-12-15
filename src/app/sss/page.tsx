'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function SSSPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const faqItems: FAQItem[] = [
        // Genel
        {
            category: 'genel',
            question: 'TamirHanem nedir?',
            answer: 'TamirHanem, araç sahiplerini güvenilir oto servislerle buluşturan Türkiye\'nin önde gelen dijital platformudur. Fiyat karşılaştırma, OBD kod sorgulama, araç analizi ve servis bulma gibi hizmetler sunuyoruz.'
        },
        {
            category: 'genel',
            question: 'TamirHanem\'i kullanmak ücretli mi?',
            answer: 'Hayır, TamirHanem\'i kullanmak tamamen ücretsizdir. Araç sahipleri hiçbir ücret ödemeden tüm özelliklerden faydalanabilir.'
        },
        {
            category: 'genel',
            question: 'Hangi şehirlerde hizmet veriyorsunuz?',
            answer: 'Şu an pilot bölge olarak Tekirdağ/Çorlu\'da aktif hizmet vermekteyiz. Yakında diğer illere de genişleyeceğiz.'
        },
        // Servisler
        {
            category: 'servisler',
            question: 'Servislerin güvenilirliğini nasıl sağlıyorsunuz?',
            answer: 'Platformumuza kayıt olan tüm servisler doğrulama sürecinden geçer. Ayrıca kullanıcı yorumları ve puanlamaları ile şeffaf bir değerlendirme sistemi sunuyoruz.'
        },
        {
            category: 'servisler',
            question: 'Servis olarak nasıl kayıt olabilirim?',
            answer: 'tamirhanem.net/register.html adresinden servis başvurusu yapabilirsiniz. Başvurunuz incelendikten sonra sizinle iletişime geçeceğiz.'
        },
        {
            category: 'servisler',
            question: 'Fiyatlar neden tahmini olarak gösteriliyor?',
            answer: 'Gerçek fiyatlar araç modeli, kullanılan parça kalitesi ve servisin konumuna göre değişir. Gösterilen fiyatlar piyasa ortalamasına dayalı tahmini değerlerdir. Kesin fiyat için servislerden teklif almanızı öneririz.'
        },
        // OBD Kodları
        {
            category: 'obd',
            question: 'OBD kodu nedir?',
            answer: 'OBD (On-Board Diagnostics) kodları, aracınızın elektronik sistemlerinden gelen arıza bilgileridir. Check Engine lambası yandığında araç bir veya birden fazla OBD kodu üretir.'
        },
        {
            category: 'obd',
            question: 'OBD kodumu nasıl öğrenebilirim?',
            answer: 'Bir OBD-II tarayıcı cihazı veya akıllı telefon uygulaması ile aracınızın OBD portuna bağlanarak kodları okuyabilirsiniz. Kod belirlendikten sonra sitemizde arayarak detaylı bilgi alabilirsiniz.'
        },
        // Hesap
        {
            category: 'hesap',
            question: 'Üyelik zorunlu mu?',
            answer: 'Hayır, sitemizin çoğu özelliğini üye olmadan kullanabilirsiniz. Ancak randevu takibi, araç geçmişi ve kişiselleştirilmiş öneriler için üyelik gerekebilir.'
        },
        {
            category: 'hesap',
            question: 'Verilerim güvende mi?',
            answer: 'Evet, tüm verileriniz şifrelenerek saklanır ve üçüncü taraflarla paylaşılmaz. Detaylı bilgi için Gizlilik Politikamızı inceleyebilirsiniz.'
        },
    ];

    const categories = [
        { id: 'all', name: 'Tümü' },
        { id: 'genel', name: 'Genel' },
        { id: 'servisler', name: 'Servisler' },
        { id: 'obd', name: 'OBD Kodları' },
        { id: 'hesap', name: 'Hesap & Güvenlik' },
    ];

    const filteredFAQs = selectedCategory === 'all' 
        ? faqItems 
        : faqItems.filter(f => f.category === selectedCategory);

    return (
        <div className="min-h-screen bg-secondary-50">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Sık Sorulan Sorular
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        TamirHanem hakkında merak ettiklerinizin yanıtları
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2 mb-8 justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    selectedCategory === cat.id
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-white text-secondary-700 hover:bg-secondary-100'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* FAQ Accordion */}
                    <div className="space-y-4">
                        {filteredFAQs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-lg overflow-hidden border border-secondary-100"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-secondary-50 transition-colors"
                                >
                                    <span className="font-semibold text-lg" style={{ color: '#454545' }}>
                                        {faq.question}
                                    </span>
                                    <svg
                                        className={`w-6 h-6 text-primary-600 transition-transform ${
                                            openIndex === index ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 pb-5 text-secondary-600 leading-relaxed border-t border-secondary-100 pt-4">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Still Have Questions */}
                    <div className="mt-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-center text-white">
                        <h2 className="text-2xl font-bold mb-4">Hala sorunuz mu var?</h2>
                        <p className="text-primary-100 mb-6">
                            Aradığınız cevabı bulamadıysanız bizimle iletişime geçin
                        </p>
                        <Link
                            href="/iletisim"
                            className="inline-flex items-center bg-white text-primary-600 px-6 py-3 rounded-lg font-bold hover:bg-primary-50 transition-colors"
                        >
                            İletişime Geç
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
