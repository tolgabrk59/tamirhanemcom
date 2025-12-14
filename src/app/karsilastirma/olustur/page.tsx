'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { vehicleYears } from '@/data/vehicles';

interface Brand {
    brand: string;
}

interface Model {
    model: string;
}

// Reusable Selector Component
function ComparisonSelector({ 
    label, 
    onChange,
    disabled = false
}: { 
    label: string; 
    onChange: (data: { brand: string; model: string; year: string }) => void;
    disabled?: boolean;
}) {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    // Fetch Brands
    useEffect(() => {
        async function fetchBrands() {
            try {
                const res = await fetch('/api/brands');
                if (res.ok) {
                    const result = await res.json();
                    setBrands(result.data || []);
                }
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        }
        fetchBrands();
    }, []);

    // Fetch Models
    useEffect(() => {
        if (!selectedBrand) {
            setModels([]);
            return;
        }
        async function fetchModels() {
            try {
                const res = await fetch(`/api/models?brand=${encodeURIComponent(selectedBrand)}`);
                if (res.ok) {
                    const result = await res.json();
                    setModels(result.data || []);
                }
            } catch (error) {
                console.error('Error fetching models:', error);
            }
        }
        fetchModels();
    }, [selectedBrand]);

    // Update parent
    useEffect(() => {
        onChange({
            brand: selectedBrand,
            model: selectedModel,
            year: selectedYear
        });
    }, [selectedBrand, selectedModel, selectedYear, onChange]);

    return (
        <div className={`bg-white p-6 rounded-2xl shadow-lg border border-secondary-100 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">
                    {label === 'Araç 1' ? '1' : '2'}
                </span>
                {label}
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Marka</label>
                    <select
                        className="w-full p-3 bg-secondary-50 border border-secondary-200 rounded-xl text-secondary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        value={selectedBrand}
                        onChange={(e) => {
                            setSelectedBrand(e.target.value);
                            setSelectedModel('');
                            setSelectedYear('');
                        }}
                    >
                        <option value="">Seçiniz</option>
                        {brands.map((b) => (
                            <option key={b.brand} value={b.brand}>{b.brand}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Model</label>
                    <select
                        className="w-full p-3 bg-secondary-50 border border-secondary-200 rounded-xl text-secondary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none disabled:bg-secondary-100"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        disabled={!selectedBrand}
                    >
                        <option value="">Önce Marka Seçin</option>
                        {models.map((m) => (
                            <option key={m.model} value={m.model}>{m.model}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Yıl</label>
                    <select
                        className="w-full p-3 bg-secondary-50 border border-secondary-200 rounded-xl text-secondary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="">Seçiniz</option>
                        {vehicleYears.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

export default function CreateComparisonPage() {
    const [car1, setCar1] = useState({ brand: '', model: '', year: '' });
    const [car2, setCar2] = useState({ brand: '', model: '', year: '' });

    const handleCar1Change = useCallback((data: { brand: string; model: string; year: string }) => {
        setCar1(data);
    }, []);

    const handleCar2Change = useCallback((data: { brand: string; model: string; year: string }) => {
        setCar2(data);
    }, []);

    const isComplete = car1.brand && car1.model && car1.year && car2.brand && car2.model && car2.year;

    return (
        <div className="bg-secondary-50 min-h-screen pb-20">
            {/* Hero */}
            <section className="bg-secondary-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Yeni Karşılaştırma Oluştur
                    </h1>
                    <p className="text-xl text-secondary-300 max-w-2xl mx-auto">
                        İstediğiniz iki aracı seçin, yapay zeka destekli detaylı analiz ile karşılaştıralım.
                    </p>
                </div>
            </section>

            {/* Selection Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
                <div className="grid md:grid-cols-2 gap-8 items-start relative">
                    {/* VS Badge */}
                    <div className="hidden md:flex absolute left-1/2 top-[180px] transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="bg-red-600 text-white font-black text-2xl rounded-full w-16 h-16 flex items-center justify-center border-4 border-white shadow-xl">
                            VS
                        </div>
                    </div>

                    <ComparisonSelector 
                        label="Araç 1" 
                        onChange={handleCar1Change} 
                    />
                    
                    <ComparisonSelector 
                        label="Araç 2" 
                        onChange={handleCar2Change} 
                    />
                </div>

                {/* Action Button */}
                <div className="mt-12 text-center">
                    <Link
                        href={isComplete 
                            ? `/karsilastirma/sonuc?brand1=${encodeURIComponent(car1.brand)}&model1=${encodeURIComponent(car1.model)}&year1=${car1.year}&brand2=${encodeURIComponent(car2.brand)}&model2=${encodeURIComponent(car2.model)}&year2=${car2.year}`
                            : '#'
                        }
                        className={`inline-flex items-center justify-center px-12 py-4 rounded-xl text-lg font-bold transition-all transform ${isComplete 
                            ? 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-105 shadow-xl shadow-primary-500/30 cursor-pointer'
                            : 'bg-secondary-200 text-secondary-400 cursor-not-allowed'
                        }`}
                        onClick={(e) => {
                            if (!isComplete) e.preventDefault();
                        }}
                    >
                        {isComplete ? 'Karşılaştırmayı Başlat 🚀' : 'Lütfen Araçları Seçin'}
                    </Link>
                </div>
            </main>
        </div>
    );
}
