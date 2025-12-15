'use client';

import { useState, useEffect } from 'react';

interface Stats {
    serviceCount: number;
    customerCount: number;
    avgRating: string;
    savingsPercent: number;
}

export default function HomeStats() {
    const [stats, setStats] = useState<Stats>({
        serviceCount: 500,
        customerCount: 50000,
        avgRating: '4.8',
        savingsPercent: 30
    });

    useEffect(() => {
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStats(data.data);
                }
            })
            .catch(err => {
                console.error('Stats yükleme hatası:', err);
            });
    }, []);

    const formatNumber = (num: number): string => {
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary-600">{formatNumber(stats.serviceCount)}</p>
                <p className="text-secondary-500 text-sm">Anlaşmalı Servis</p>
            </div>
            <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary-600">{formatNumber(stats.customerCount)}</p>
                <p className="text-secondary-500 text-sm">Mutlu Müşteri</p>
            </div>
            <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary-600">{stats.avgRating}</p>
                <p className="text-secondary-500 text-sm">Ortalama Puan</p>
            </div>
            <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary-600">%{stats.savingsPercent}</p>
                <p className="text-secondary-500 text-sm">Tasarruf</p>
            </div>
        </div>
    );
}
