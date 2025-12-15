'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getAllSystems } from '@/data/encyclopedia-data';

const systemIcons: Record<string, JSX.Element> = {
    engine: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
    ),
    brake: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
    ),
    suspension: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
    ),
    electric: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
    fuel: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    ),
    cooling: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
    ),
    exhaust: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
    ),
    transmission: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        </svg>
    ),
};

const colorClasses: Record<string, { bg: string; border: string; text: string; hover: string; gradient: string }> = {
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', hover: 'hover:border-red-400', gradient: 'from-red-500 to-red-600' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', hover: 'hover:border-orange-400', gradient: 'from-orange-500 to-orange-600' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', hover: 'hover:border-blue-400', gradient: 'from-blue-500 to-blue-600' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', hover: 'hover:border-yellow-400', gradient: 'from-yellow-500 to-yellow-600' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', hover: 'hover:border-green-400', gradient: 'from-green-500 to-green-600' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600', hover: 'hover:border-cyan-400', gradient: 'from-cyan-500 to-cyan-600' },
    gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', hover: 'hover:border-gray-400', gradient: 'from-gray-500 to-gray-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', hover: 'hover:border-purple-400', gradient: 'from-purple-500 to-purple-600' },
};

export default function EncyclopediaPage() {
    const systems = getAllSystems();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any>(null);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Search function
    useEffect(() => {
        if (!searchQuery || searchQuery.length < 2) {
            setSearchResults(null);
            setShowResults(false);
            return;
        }

        const query = searchQuery.toLowerCase().toLocaleLowerCase('tr-TR');
        const results: any = {
            systems: [],
            components: []
        };

        systems.forEach(system => {
            // Search in system name
            if (system.name.toLowerCase().toLocaleLowerCase('tr-TR').includes(query)) {
                results.systems.push(system);
            }

            // Collect all components from both direct components and subsystems
            let allComponents: any[] = [];
            
            // Add direct components if they exist
            if (system.components && system.components.length > 0) {
                allComponents = system.components.map((c: any) => ({
                    ...c,
                    systemName: system.name,
                    systemSlug: system.slug
                }));
            }
            
            // Add components from subsystems if they exist
            if (system.subsystems && system.subsystems.length > 0) {
                system.subsystems.forEach(sub => {
                    if (sub && sub.components && sub.components.length > 0) {
                        const subsystemComponents = sub.components.map((c: any) => ({
                            ...c,
                            systemName: system.name,
                            systemSlug: system.slug,
                            subsystemName: sub.name,
                            subsystemSlug: sub.slug
                        }));
                        allComponents.push(...subsystemComponents);
                    }
                });
            }

            // Search in components
            allComponents.forEach((component: any) => {
                if (
                    component.name?.toLowerCase().toLocaleLowerCase('tr-TR').includes(query) ||
                    component.description?.toLowerCase().toLocaleLowerCase('tr-TR').includes(query) ||
                    component.symptoms?.some((s: string) => s.toLowerCase().toLocaleLowerCase('tr-TR').includes(query))
                ) {
                    if (results.components.length < 20) { // Limit to 20 components
                        results.components.push(component);
                    }
                }
            });
        });

        console.log('Search results:', { query, systemsFound: results.systems.length, componentsFound: results.components.length });
        setSearchResults(results);
        setShowResults(true);
    }, [searchQuery, systems]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-secondary-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl"></div>
                
                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-400/30 rounded-full px-5 py-2.5 mb-6 backdrop-blur-sm">
                            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="text-primary-300 font-bold text-sm">Araç Ansiklopedisi</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                            Otomotiv Sistemleri <br />
                            <span className="text-primary-400">Rehberi</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                            Aracınızın tüm sistemleri ve bileşenleri hakkında detaylı bilgi edinin.
                            Arıza belirtilerini öğrenin, uzman tamir tavsiyeleri alın.
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-8 mb-12">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-1">{systems.length}</div>
                                <div className="text-primary-300 text-sm font-medium">Ana Sistem</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-1">
                                    {systems.reduce((acc, sys) => {
                                        let count = sys.components?.length || 0;
                                        if (sys.subsystems) {
                                            sys.subsystems.forEach(sub => {
                                                if (sub) count += sub.components?.length || 0;
                                            });
                                        }
                                        return acc + count;
                                    }, 0)}
                                </div>
                                <div className="text-primary-300 text-sm font-medium">Bileşen</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-1">1000+</div>
                                <div className="text-primary-300 text-sm font-medium">Arıza Belirtisi</div>
                            </div>
                        </div>
                    </div>

                    {/* Search Box */}
                    <div className="max-w-2xl mx-auto" ref={searchRef}>
                        <div className="relative group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                                placeholder="Sistem, parça veya belirti ara... (örn: motor, fren balatası)"
                                className="w-full px-6 py-5 pr-14 rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:bg-white/15 transition-all shadow-2xl"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white p-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            
                            {/* Search Results Dropdown */}
                            {showResults && searchResults && (
                                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border-2 border-secondary-100 max-h-96 overflow-y-auto z-[9999]">
                                    {searchResults.systems.length === 0 && searchResults.components.length === 0 ? (
                                        <div className="p-6 text-center text-secondary-600">
                                            <svg className="w-12 h-12 mx-auto mb-2 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="font-medium">Sonuç bulunamadı</p>
                                            <p className="text-sm mt-1">Farklı bir arama terimi deneyin</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Systems Results */}
                                            {searchResults.systems.length > 0 && (
                                                <div className="border-b border-secondary-100">
                                                    <div className="px-4 py-3 bg-secondary-50">
                                                        <h3 className="font-bold text-sm text-secondary-700 uppercase tracking-wide">Sistemler ({searchResults.systems.length})</h3>
                                                    </div>
                                                    <div className="p-2">
                                                        {searchResults.systems.map((system: any) => (
                                                            <Link
                                                                key={system.id}
                                                                href={`/arac/ansiklopedi/${system.slug}`}
                                                                onClick={() => setShowResults(false)}
                                                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors group"
                                                            >
                                                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                                    </svg>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">{system.name}</div>
                                                                    <div className="text-sm text-secondary-600 line-clamp-1">{system.description}</div>
                                                                </div>
                                                                <svg className="w-5 h-5 text-secondary-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Components Results */}
                                            {searchResults.components.length > 0 && (
                                                <div>
                                                    <div className="px-4 py-3 bg-secondary-50">
                                                        <h3 className="font-bold text-sm text-secondary-700 uppercase tracking-wide">Bileşenler ({searchResults.components.length})</h3>
                                                    </div>
                                                    <div className="p-2">
                                                        {searchResults.components.map((component: any) => (
                                                            <Link
                                                                key={component.id}
                                                                href={component.subsystemSlug 
                                                                    ? `/arac/ansiklopedi/${component.systemSlug}/${component.subsystemSlug}/${component.slug}`
                                                                    : `/arac/ansiklopedi/${component.systemSlug}/${component.slug}`
                                                                }
                                                                onClick={() => setShowResults(false)}
                                                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors group"
                                                            >
                                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                                    </svg>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">{component.name}</div>
                                                                    <div className="text-xs text-secondary-500">{component.systemName}</div>
                                                                    {component.estimatedCost && (
                                                                        <div className="text-xs text-primary-600 font-medium mt-0.5">
                                                                            {component.estimatedCost.min.toLocaleString('tr-TR')} - {component.estimatedCost.max.toLocaleString('tr-TR')} ₺
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <svg className="w-5 h-5 text-secondary-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Systems Grid */}
            <section className="py-20 bg-gradient-to-b from-secondary-900 via-secondary-800 to-secondary-900 relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
                            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span className="text-white/80 text-sm font-medium">Tüm Sistemler</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                            Otomotiv <span className="text-primary-400">Sistemleri</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Aracınızın ana sistemlerini keşfedin ve detaylı bilgi edinin
                        </p>
                    </div>

                    <div className="space-y-8">
                        {systems.map((system, index) => {
                            const colors = colorClasses[system.color];
                            const imageMap: Record<string, string> = {
                                'engine': '/images/systems/engine.png',
                                'brake': '/images/systems/brake.png',
                                'suspension': '/images/systems/suspension.png',
                                'electric': '/images/systems/electric.png',
                                'fuel': '/images/systems/fuel.png',
                                'cooling': '/images/systems/cooling.png',
                                'exhaust': '/images/systems/exhaust.png',
                                'transmission': '/images/systems/transmission.png',
                            };
                            
                            // Collect all components for this system
                            let allSystemComponents: any[] = [];
                            if (system.subsystems && system.subsystems.length > 0) {
                                system.subsystems.forEach(subsystem => {
                                    if (subsystem && subsystem.components) {
                                        const componentsWithSubsystem = subsystem.components.map(c => ({
                                            ...c,
                                            systemSlug: system.slug,
                                            subsystemSlug: subsystem.slug
                                        }));
                                        allSystemComponents.push(...componentsWithSubsystem);
                                    }
                                });
                            } else if (system.components) {
                                allSystemComponents = system.components.map(c => ({
                                    ...c,
                                    systemSlug: system.slug
                                }));
                            }
                            
                            // Sort alphabetically
                            allSystemComponents.sort((a, b) => a.name.localeCompare(b.name, 'tr-TR'));
                            
                            // Group by letter ranges (Turkish alphabet aware)
                            const groupAF = allSystemComponents.filter(c => {
                                const firstLetter = c.name.charAt(0).toUpperCase();
                                return 'ABCÇDEFabc'.includes(firstLetter) || firstLetter <= 'F';
                            });
                            const groupGM = allSystemComponents.filter(c => {
                                const firstLetter = c.name.charAt(0).toUpperCase();
                                return 'GĞHIİJKLMgğhıijklm'.includes(firstLetter) || (firstLetter > 'F' && firstLetter <= 'M');
                            });
                            const groupNZ = allSystemComponents.filter(c => {
                                const firstLetter = c.name.charAt(0).toUpperCase();
                                return !groupAF.includes(c) && !groupGM.includes(c);
                            });
                            
                            return (
                                <div 
                                    key={system.id} 
                                    className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-primary-500/30 transition-all duration-500"
                                >
                                    {/* System Header */}
                                    <div className="flex flex-col md:flex-row gap-6 p-8 border-b border-white/10">
                                        <div className="w-full md:w-56 h-40 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden group-hover:from-primary-500/20 group-hover:to-primary-600/10 transition-all duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                            <img 
                                                src={imageMap[system.icon] || '/images/systems/engine.png'} 
                                                alt={system.name}
                                                className="w-full h-full object-contain p-6 relative z-10 group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-bold rounded-full">
                                                    {allSystemComponents.length} Bileşen
                                                </span>
                                            </div>
                                            <Link 
                                                href={`/arac/ansiklopedi/${system.slug}`}
                                                className="inline-block"
                                            >
                                                <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary-400 transition-colors mb-3 flex items-center gap-3">
                                                    {system.name}
                                                    <svg className="w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </h3>
                                            </Link>
                                            <p className="text-gray-400 leading-relaxed text-lg">
                                                {system.description}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Components Grid by Letter */}
                                    <div className="p-8 bg-gradient-to-b from-transparent to-white/[0.02]">
                                        <div className="grid md:grid-cols-3 gap-8">
                                            {/* A-F Column */}
                                            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                                <h4 className="text-primary-400 font-bold text-sm mb-4 pb-3 border-b border-primary-500/30 flex items-center gap-2">
                                                    <span className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-300">A</span>
                                                    <span>- F</span>
                                                </h4>
                                                <ul className="space-y-2.5">
                                                    {groupAF.map((component) => (
                                                        <li key={component.id}>
                                                            <Link 
                                                                href={component.subsystemSlug 
                                                                    ? `/arac/ansiklopedi/${component.systemSlug}/${component.subsystemSlug}/${component.slug}`
                                                                    : `/arac/ansiklopedi/${component.systemSlug}/${component.slug}`
                                                                }
                                                                className="text-gray-300 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group/item"
                                                            >
                                                                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover/item:bg-primary-400 transition-colors"></span>
                                                                {component.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                    {groupAF.length === 0 && (
                                                        <li className="text-gray-600 text-sm italic">Bileşen yok</li>
                                                    )}
                                                </ul>
                                            </div>
                                            
                                            {/* G-M Column */}
                                            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                                <h4 className="text-primary-400 font-bold text-sm mb-4 pb-3 border-b border-primary-500/30 flex items-center gap-2">
                                                    <span className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-300">G</span>
                                                    <span>- M</span>
                                                </h4>
                                                <ul className="space-y-2.5">
                                                    {groupGM.map((component) => (
                                                        <li key={component.id}>
                                                            <Link 
                                                                href={component.subsystemSlug 
                                                                    ? `/arac/ansiklopedi/${component.systemSlug}/${component.subsystemSlug}/${component.slug}`
                                                                    : `/arac/ansiklopedi/${component.systemSlug}/${component.slug}`
                                                                }
                                                                className="text-gray-300 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group/item"
                                                            >
                                                                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover/item:bg-primary-400 transition-colors"></span>
                                                                {component.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                    {groupGM.length === 0 && (
                                                        <li className="text-gray-600 text-sm italic">Bileşen yok</li>
                                                    )}
                                                </ul>
                                            </div>
                                            
                                            {/* N-Z Column */}
                                            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                                <h4 className="text-primary-400 font-bold text-sm mb-4 pb-3 border-b border-primary-500/30 flex items-center gap-2">
                                                    <span className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-300">N</span>
                                                    <span>- Z</span>
                                                </h4>
                                                <ul className="space-y-2.5">
                                                    {groupNZ.map((component) => (
                                                        <li key={component.id}>
                                                            <Link 
                                                                href={component.subsystemSlug 
                                                                    ? `/arac/ansiklopedi/${component.systemSlug}/${component.subsystemSlug}/${component.slug}`
                                                                    : `/arac/ansiklopedi/${component.systemSlug}/${component.slug}`
                                                                }
                                                                className="text-gray-300 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group/item"
                                                            >
                                                                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover/item:bg-primary-400 transition-colors"></span>
                                                                {component.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                    {groupNZ.length === 0 && (
                                                        <li className="text-gray-600 text-sm italic">Bileşen yok</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-secondary-900 mb-3">Detaylı Açıklamalar</h3>
                            <p className="text-secondary-600 leading-relaxed">
                                Her sistem ve bileşen için kapsamlı teknik açıklamalar ve çalışma prensipleri
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200">
                            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-secondary-900 mb-3">Arıza Teşhisi</h3>
                            <p className="text-secondary-600 leading-relaxed">
                                Yaygın arıza belirtileri, nedenleri ve çözüm önerileri ile hızlı teşhis
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-secondary-900 mb-3">Maliyet Tahminleri</h3>
                            <p className="text-secondary-600 leading-relaxed">
                                Tamir ve parça değişim maliyetleri için güncel piyasa fiyat tahminleri
                            </p>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 md:p-12 border-2 border-primary-200">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-secondary-900">
                                    Araç Ansiklopedisi Nasıl Kullanılır?
                                </h3>
                                <p className="text-secondary-700 leading-relaxed mb-6 text-lg">
                                    Ansiklopedimiz, aracınızın tüm sistemleri ve bileşenleri hakkında detaylı bilgi içerir.
                                    Her sistem sayfasında bileşenleri, arıza belirtilerini ve tamir tavsiyelerini bulabilirsiniz.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-secondary-700 font-medium">Sistem ve bileşen açıklamaları</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-secondary-700 font-medium">Arıza belirtileri ve teşhis rehberi</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-secondary-700 font-medium">Uzman tamir tavsiyeleri ve ipuçları</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-secondary-700 font-medium">Güncel tahmini maliyet bilgileri</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-secondary-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-bold text-xl text-secondary-900">Önemli Not</h4>
                                </div>
                                <p className="text-secondary-600 leading-relaxed mb-4">
                                    Bu ansiklopedide yer alan bilgiler genel bilgilendirme amaçlıdır.
                                    Maliyet tahminleri örnek verilerdir.
                                </p>
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                    <p className="text-sm text-secondary-700 font-medium">
                                        Kesin teşhis ve fiyat için mutlaka uzman bir servise danışınız.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Aracınız İçin Güvenilir Servis mi Arıyorsunuz?
                    </h2>
                    <p className="text-xl text-primary-100 mb-8">
                        Binlerce sertifikalı servis arasından size en uygun olanı bulun
                    </p>
                    <Link
                        href="/servisler"
                        className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-2xl hover:shadow-3xl transform hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Servis Bul
                    </Link>
                </div>
            </section>
        </div>
    );
}
