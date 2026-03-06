'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

interface Stats {
    serviceCount: number;
    customerCount: number;
    avgRating: string;
    savingsPercent: number;
}

function AnimatedCounter({
    value,
    suffix = '',
    prefix = '',
    duration = 2
}: {
    value: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => {
        if (v >= 1000) {
            return (v / 1000).toFixed(0) + 'K';
        }
        return Math.round(v).toString();
    });
    const [displayValue, setDisplayValue] = useState('0');

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, value, {
                duration,
                ease: 'easeOut',
            });

            const unsubscribe = rounded.on('change', (v) => {
                setDisplayValue(v);
            });

            return () => {
                controls.stop();
                unsubscribe();
            };
        }
    }, [isInView, value, count, rounded, duration]);

    return (
        <span ref={ref}>
            {prefix}{displayValue}{suffix}
        </span>
    );
}

function AnimatedRating({ value, duration = 2 }: { value: string; duration?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const numValue = parseFloat(value);
    const count = useMotionValue(0);
    const [displayValue, setDisplayValue] = useState('0.0');

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, numValue, {
                duration,
                ease: 'easeOut',
            });

            const unsubscribe = count.on('change', (v) => {
                setDisplayValue(v.toFixed(1));
            });

            return () => {
                controls.stop();
                unsubscribe();
            };
        }
    }, [isInView, numValue, count, duration]);

    return <span ref={ref}>{displayValue}</span>;
}

export default function HomeStats() {
    const [stats, setStats] = useState<Stats>({
        serviceCount: 500,
        customerCount: 50000,
        avgRating: '4.8',
        savingsPercent: 30
    });
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: '-50px' });

    useEffect(() => {
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStats(data.data);
                }
            })
            .catch(err => {
                console.error('[HomeStats] Stats loading error:', err);
            });
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut' as const
            }
        },
    };

    return (
        <motion.div
            ref={containerRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto"
        >
            <motion.div variants={itemVariants} className="text-center group">
                <div className="relative">
                    <p className="text-3xl md:text-4xl font-bold text-primary-600 group-hover:scale-110 transition-transform duration-300">
                        <AnimatedCounter value={stats.serviceCount} suffix="+" />
                    </p>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-500/30 rounded-full group-hover:w-12 transition-all duration-300" />
                </div>
                <p className="text-secondary-500 text-sm mt-2">Anlaşmalı Servis</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center group">
                <div className="relative">
                    <p className="text-3xl md:text-4xl font-bold text-primary-600 group-hover:scale-110 transition-transform duration-300">
                        <AnimatedCounter value={stats.customerCount} suffix="+" />
                    </p>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-500/30 rounded-full group-hover:w-12 transition-all duration-300" />
                </div>
                <p className="text-secondary-500 text-sm mt-2">Mutlu Müşteri</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center group">
                <div className="relative">
                    <p className="text-3xl md:text-4xl font-bold text-primary-600 group-hover:scale-110 transition-transform duration-300">
                        <AnimatedRating value={stats.avgRating} />
                    </p>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-500/30 rounded-full group-hover:w-12 transition-all duration-300" />
                </div>
                <p className="text-secondary-500 text-sm mt-2">Ortalama Puan</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center group">
                <div className="relative">
                    <p className="text-3xl md:text-4xl font-bold text-primary-600 group-hover:scale-110 transition-transform duration-300">
                        <AnimatedCounter value={stats.savingsPercent} prefix="%" />
                    </p>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-500/30 rounded-full group-hover:w-12 transition-all duration-300" />
                </div>
                <p className="text-secondary-500 text-sm mt-2">Tasarruf</p>
            </motion.div>
        </motion.div>
    );
}
