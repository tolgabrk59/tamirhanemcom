'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Plus,
  Package,
  Filter,
  ChevronDown,
  MapPin,
  Tag,
  Clock,
  AlertCircle,
  RefreshCw,
  X,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const categoryOptions = [
  'Tumu',
  'Motor',
  'Fren Sistemi',
  'Suspansiyon',
  'Elektrik',
  'Sanziman',
  'Egzoz',
  'Kaporta',
  'Ic Aksam',
]

const brandOptions = ['Tumu', 'BMW', 'Mercedes', 'Toyota', 'Volkswagen', 'Ford', 'Renault', 'Audi', 'Honda', 'Fiat', 'Hyundai']

interface MockPart {
  id: number
  title: string
  brand: string
  model: string
  year: string
  category: string
  price: string
  location: string
  condition: string
  date: string
}

const mockParts: MockPart[] = [
  { id: 1, title: 'N20 Motor Blogu', brand: 'BMW', model: '3 Serisi', year: '2015', category: 'Motor', price: '18.500 TL', location: 'Istanbul', condition: 'Iyi', date: '2 saat once' },
  { id: 2, title: 'Fren Disk Seti (On)', brand: 'Mercedes', model: 'C Serisi', year: '2018', category: 'Fren Sistemi', price: '2.800 TL', location: 'Ankara', condition: 'Cok Iyi', date: '5 saat once' },
  { id: 3, title: 'Arka Amortisor Takimi', brand: 'Volkswagen', model: 'Golf', year: '2017', category: 'Suspansiyon', price: '3.200 TL', location: 'Izmir', condition: 'Iyi', date: '1 gun once' },
  { id: 4, title: 'Alternator', brand: 'Toyota', model: 'Corolla', year: '2019', category: 'Elektrik', price: '4.500 TL', location: 'Bursa', condition: 'Cok Iyi', date: '1 gun once' },
  { id: 5, title: 'Debriyaj Seti', brand: 'Ford', model: 'Focus', year: '2016', category: 'Sanziman', price: '5.600 TL', location: 'Antalya', condition: 'Orta', date: '2 gun once' },
  { id: 6, title: 'Katalitik Konvertor', brand: 'Renault', model: 'Megane', year: '2014', category: 'Egzoz', price: '7.800 TL', location: 'Istanbul', condition: 'Iyi', date: '3 gun once' },
  { id: 7, title: 'On Tampon Komple', brand: 'Audi', model: 'A3', year: '2020', category: 'Kaporta', price: '6.200 TL', location: 'Ankara', condition: 'Cok Iyi', date: '3 gun once' },
  { id: 8, title: 'Turbo Seti', brand: 'BMW', model: '5 Serisi', year: '2013', category: 'Motor', price: '22.000 TL', location: 'Istanbul', condition: 'Iyi', date: '4 gun once' },
  { id: 9, title: 'Multimedya Ekrani', brand: 'Honda', model: 'Civic', year: '2018', category: 'Ic Aksam', price: '8.500 TL', location: 'Izmir', condition: 'Cok Iyi', date: '5 gun once' },
]

export default function IkinciElParcaPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tumu')
  const [selectedBrand, setSelectedBrand] = useState('Tumu')
  const [showFilters, setShowFilters] = useState(false)

  const filteredParts = mockParts.filter((part) => {
    const matchSearch = searchQuery === '' || part.title.toLowerCase().includes(searchQuery.toLowerCase()) || part.brand.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCategory = selectedCategory === 'Tumu' || part.category === selectedCategory
    const matchBrand = selectedBrand === 'Tumu' || part.brand === selectedBrand
    return matchSearch && matchCategory && matchBrand
  })

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('Tumu')
    setSelectedBrand('Tumu')
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-8">
        <AnimatedSection>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-4">
                <Package className="w-4 h-4 text-brand-500" />
                <span className="text-sm font-semibold text-brand-500">Pazaryeri</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold mb-2">
                2.El Parca <span className="text-gold">Pazaryeri</span>
              </h1>
              <p className="text-th-fg-sub text-base">
                Guvenilir saticilardan uygun fiyatli 2.el parcalar
              </p>
            </div>
            <Link
              href="/arac/2-el-parca/ilan-ver"
              className="btn-gold px-6 py-3 text-sm shrink-0 hidden md:inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Ilan Ver
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Search & Filters */}
      <section className="section-container mb-8">
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-4 md:p-6">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-th-fg-sub" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Parca veya marka ara..."
                  className="input-dark pl-12 text-sm py-3"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all',
                  showFilters
                    ? 'border-brand-500/40 bg-brand-500/10 text-brand-500'
                    : 'border-th-border/20 bg-th-overlay/[0.05] text-th-fg-sub hover:text-th-fg'
                )}
              >
                <Filter className="w-4 h-4" />
                Filtreler
                <ChevronDown className={cn('w-4 h-4 transition-transform', showFilters && 'rotate-180')} />
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-th-border/10"
              >
                <div>
                  <label className="block text-xs text-th-fg-sub mb-2 font-medium">Kategori</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-dark appearance-none cursor-pointer text-sm py-3"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat} className="bg-th-bg-alt">{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-th-fg-sub mb-2 font-medium">Marka</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="input-dark appearance-none cursor-pointer text-sm py-3"
                  >
                    {brandOptions.map((brand) => (
                      <option key={brand} value={brand} className="bg-th-bg-alt">{brand}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </div>
        </AnimatedSection>
      </section>

      {/* Results */}
      <section className="section-container">
        <AnimatedSection delay={0.15}>
          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-th-fg-sub text-sm">
              <span className="text-th-fg font-semibold">{filteredParts.length}</span> ilan bulundu
            </p>
            {(selectedCategory !== 'Tumu' || selectedBrand !== 'Tumu' || searchQuery) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-400 transition-colors"
              >
                <X className="w-3 h-3" />
                Filtreleri Temizle
              </button>
            )}
          </div>

          {/* Parts Grid */}
          {filteredParts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParts.map((part, index) => (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-5 group cursor-pointer hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300"
                >
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge-gold text-[10px]">{part.category}</span>
                    <span className={cn(
                      'text-[10px] px-2.5 py-0.5 rounded-full font-semibold',
                      part.condition === 'Cok Iyi'
                        ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                        : part.condition === 'Iyi'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                          : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                    )}>
                      {part.condition}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-display font-bold text-th-fg mb-2 group-hover:text-brand-500 transition-colors">
                    {part.title}
                  </h3>

                  {/* Vehicle Info */}
                  <p className="text-xs text-th-fg-sub mb-4">
                    {part.brand} {part.model} - {part.year}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-brand-500" />
                    <span className="text-lg font-display font-bold text-gold">{part.price}</span>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-[11px] text-th-fg-muted pt-3 border-t border-th-border/10">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {part.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {part.date}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="glass-card p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-th-overlay/[0.05] flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-th-fg-muted" />
              </div>
              <h3 className="text-lg font-display font-bold text-th-fg mb-2">Ilan Bulunamadi</h3>
              <p className="text-th-fg-sub text-sm mb-6">Sectiginiz kriterlere uygun ilan bulunamadi.</p>
              <button onClick={clearFilters} className="btn-gold px-6 py-3 text-sm inline-flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Filtreleri Temizle
              </button>
            </div>
          )}
        </AnimatedSection>
      </section>

      {/* Mobile FAB */}
      <Link
        href="/arac/2-el-parca/ilan-ver"
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-brand-500 text-th-fg-invert rounded-full shadow-glow-sm flex items-center justify-center z-50 hover:scale-110 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  )
}
