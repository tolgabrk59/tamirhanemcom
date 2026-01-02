'use client';

import { useState } from 'react';
import Link from 'next/link';

// Video kategorileri
const videoCategories = [
  { id: 'tumu', name: 'Tümü', icon: '📺' },
  { id: 'bakim', name: 'Temel Bakım', icon: '🔧' },
  { id: 'diy', name: 'Evde Yapılabilir', icon: '🏠' },
  { id: 'acil', name: 'Acil Durumlar', icon: '🚨' },
  { id: 'ipuclari', name: 'İpuçları', icon: '💡' },
  { id: 'servis', name: 'Servis Rehberi', icon: '🏪' },
];

// Örnek video verileri
const videos = [
  {
    id: '1',
    title: 'Yağ Değişimi Nasıl Yapılır?',
    description: 'Adım adım motor yağı değişimi rehberi. Evde kolayca yapabileceğiniz temel bakım.',
    thumbnail: '/images/videos/oil-change.jpg',
    duration: '12:45',
    views: '125K',
    category: 'diy',
    difficulty: 'Kolay',
    tools: ['Yağ süzgeci anahtarı', 'Yağ kabı', 'Huni', 'Eldiven'],
    youtubeId: 'dQw4w9WgXcQ',
    featured: true,
  },
  {
    id: '2',
    title: 'Fren Balatası Kontrolü',
    description: 'Fren balatalarınızın ne zaman değişmesi gerektiğini nasıl anlarsınız?',
    thumbnail: '/images/videos/brake-check.jpg',
    duration: '8:30',
    views: '89K',
    category: 'bakim',
    difficulty: 'Orta',
    tools: ['Fener', 'Tekerlek söküm aleti'],
    youtubeId: 'dQw4w9WgXcQ',
    featured: true,
  },
  {
    id: '3',
    title: 'Akü Şarjı ve Takviye',
    description: 'Aracınızın aküsü bittiğinde ne yapmalısınız? Takviye kablosu kullanımı.',
    thumbnail: '/images/videos/battery.jpg',
    duration: '6:15',
    views: '156K',
    category: 'acil',
    difficulty: 'Kolay',
    tools: ['Takviye kablosu', 'Eldiven'],
    youtubeId: 'dQw4w9WgXcQ',
    featured: false,
  },
  {
    id: '4',
    title: 'Lastik Değişimi Rehberi',
    description: 'Yolda kaldığınızda lastik nasıl değiştirilir? Stepne kullanımı.',
    thumbnail: '/images/videos/tire-change.jpg',
    duration: '10:20',
    views: '203K',
    category: 'acil',
    difficulty: 'Kolay',
    tools: ['Kriko', 'Bijon anahtarı', 'Stepne'],
    youtubeId: 'dQw4w9WgXcQ',
    featured: true,
  },
  {
    id: '5',
    title: 'Far Ampulü Değişimi',
    description: 'Farlarınızın ampulü yandığında kendiniz değiştirebilirsiniz.',
    thumbnail: '/images/videos/headlight.jpg',
    duration: '7:45',
    views: '67K',
    category: 'diy',
    difficulty: 'Kolay',
    tools: ['Tornavida', 'Yeni ampul', 'Eldiven'],
    youtubeId: 'dQw4w9WgXcQ',
    featured: false,
  },
  {
    id: '6',
    title: 'Cam Suyu ve Silecek Bakımı',
    description: 'Silecek lastiği değişimi ve cam suyu doldurma rehberi.',
    thumbnail: '/images/videos/wiper.jpg',
    duration: '5:30',
    views: '92K',
    category: 'diy',
    difficulty: 'Çok Kolay',
    tools: ['Yeni silecek', 'Cam suyu'],
    youtubeId: 'dQw4w9WgXcQ',
    featured: false,
  },
  {
    id: '7',
    title: 'Güvenilir Servis Nasıl Seçilir?',
    description: 'Araç servisinizi seçerken dikkat etmeniz gereken 10 önemli kriter.',
    thumbnail: '/images/videos/service-select.jpg',
    duration: '15:00',
    views: '178K',
    category: 'servis',
    difficulty: '-',
    tools: [],
    youtubeId: 'dQw4w9WgXcQ',
    featured: true,
  },
  {
    id: '8',
    title: 'Servis Fiyatlarını Karşılaştırma',
    description: 'Aynı işlem için farklı fiyatlar mı alıyorsunuz? Doğru fiyatı bulma rehberi.',
    thumbnail: '/images/videos/price-compare.jpg',
    duration: '11:30',
    views: '134K',
    category: 'servis',
    difficulty: '-',
    tools: [],
    youtubeId: 'dQw4w9WgXcQ',
    featured: false,
  },
  {
    id: '9',
    title: 'Hava Filtresi Değişimi',
    description: 'Motor hava filtresini evde kolayca değiştirin. 5 dakikalık işlem.',
    thumbnail: '/images/videos/air-filter.jpg',
    duration: '4:45',
    views: '81K',
    category: 'diy',
    difficulty: 'Çok Kolay',
    tools: ['Tornavida', 'Yeni filtre'],
    youtubeId: 'dQw4w9WgXcQ',
    featured: false,
  },
  {
    id: '10',
    title: 'Antifriz Kontrolü ve Değişimi',
    description: 'Kış öncesi antifriz kontrolü nasıl yapılır? Donma noktası testi.',
    thumbnail: '/images/videos/antifreeze.jpg',
    duration: '9:15',
    views: '73K',
    category: 'bakim',
    difficulty: 'Orta',
    tools: ['Antifriz test cihazı', 'Huni', 'Eldiven'],
    youtubeId: 'dQw4w9WgXcQ',
    featured: false,
  },
  {
    id: '11',
    title: 'Araç İç Temizliği İpuçları',
    description: 'Profesyonel sonuçlar için iç temizlik teknikleri ve ürün önerileri.',
    thumbnail: '/images/videos/interior-clean.jpg',
    duration: '18:30',
    views: '215K',
    category: 'ipuclari',
    difficulty: 'Kolay',
    tools: ['Süpürge', 'Temizlik spreyi', 'Mikrofiber bez'],
    youtubeId: 'dQw4w9WgXcQ',
    featured: false,
  },
  {
    id: '12',
    title: 'Yakıt Tasarrufu İpuçları',
    description: '%20\'ye kadar yakıt tasarrufu sağlayacak sürüş teknikleri.',
    thumbnail: '/images/videos/fuel-save.jpg',
    duration: '13:00',
    views: '287K',
    category: 'ipuclari',
    difficulty: '-',
    tools: [],
    youtubeId: 'dQw4w9WgXcQ',
    featured: true,
  },
];

// DIY rehberleri
const diyGuides = [
  {
    title: 'Yağ Değişimi',
    time: '30 dk',
    savings: '200-400 ₺',
    difficulty: 'Kolay',
    steps: ['Aracı kaldırın', 'Yağ tapasını açın', 'Eski yağı boşaltın', 'Filtreyi değiştirin', 'Yeni yağı doldurun'],
  },
  {
    title: 'Hava Filtresi',
    time: '5 dk',
    savings: '100-200 ₺',
    difficulty: 'Çok Kolay',
    steps: ['Kaputu açın', 'Filtre kutusunu bulun', 'Eski filtreyi çıkarın', 'Yenisini takın'],
  },
  {
    title: 'Silecek Değişimi',
    time: '5 dk',
    savings: '50-150 ₺',
    difficulty: 'Çok Kolay',
    steps: ['Sileceği kaldırın', 'Klipsi açın', 'Eskisini çıkarın', 'Yenisini takın'],
  },
  {
    title: 'Ampul Değişimi',
    time: '15 dk',
    savings: '100-300 ₺',
    difficulty: 'Kolay',
    steps: ['Kaputu açın', 'Far soketini bulun', 'Eski ampulü çıkarın', 'Yenisini takın'],
  },
];

export default function VideoContentCenter() {
  const [selectedCategory, setSelectedCategory] = useState('tumu');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null);

  // Filtrelenmiş videolar
  const filteredVideos = videos.filter(video => {
    const matchesCategory = selectedCategory === 'tumu' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Öne çıkan videolar
  const featuredVideos = videos.filter(v => v.featured);

  return (
    <div className="bg-secondary-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-full px-5 py-2.5 mb-6 backdrop-blur-sm">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z"/>
              </svg>
              <span className="text-red-300 font-bold text-sm">Video İçerik Merkezi</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Araç Bakım <span className="text-red-400">Videoları</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              DIY bakım videoları, uzman tavsiyeleri ve servis seçim rehberleri.
              Aracınızın bakımını öğrenin, tasarruf edin.
            </p>

            {/* Arama */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Video ara... (örn: yağ değişimi, lastik)"
                  className="w-full px-6 py-4 pr-14 rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:border-red-400 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{videos.length}+</div>
                <div className="text-red-300 text-sm font-medium">Video</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">6</div>
                <div className="text-red-300 text-sm font-medium">Kategori</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">1M+</div>
                <div className="text-red-300 text-sm font-medium">İzlenme</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kategori Filtreleri */}
      <section className="py-8 bg-white border-b border-secondary-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {videoCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Öne Çıkan Videolar */}
      {selectedCategory === 'tumu' && !searchQuery && (
        <section className="py-12 bg-gradient-to-b from-white to-secondary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-secondary-900">Öne Çıkan Videolar</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVideos.slice(0, 3).map(video => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-secondary-100 cursor-pointer group hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-video bg-secondary-200">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white text-sm px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      ÖNE ÇIKAN
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-secondary-900 mb-2 group-hover:text-red-500 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-secondary-600 text-sm line-clamp-2 mb-3">{video.description}</p>
                    <div className="flex items-center gap-4 text-sm text-secondary-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {video.views}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        video.difficulty === 'Çok Kolay' ? 'bg-green-100 text-green-700' :
                        video.difficulty === 'Kolay' ? 'bg-blue-100 text-blue-700' :
                        video.difficulty === 'Orta' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-secondary-100 text-secondary-600'
                      }`}>
                        {video.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tüm Videolar */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-secondary-900">
              {selectedCategory === 'tumu' ? 'Tüm Videolar' : videoCategories.find(c => c.id === selectedCategory)?.name}
              <span className="text-secondary-400 font-normal ml-2">({filteredVideos.length})</span>
            </h2>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">Video Bulunamadı</h3>
              <p className="text-secondary-600">Farklı bir arama terimi veya kategori deneyin.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map(video => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="bg-white rounded-xl overflow-hidden shadow border border-secondary-100 cursor-pointer group hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-video bg-secondary-200">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-secondary-900 mb-1 group-hover:text-red-500 transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-secondary-500 text-sm line-clamp-2 mb-2">{video.description}</p>
                    <div className="flex items-center justify-between text-xs text-secondary-400">
                      <span>{video.views} izlenme</span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        video.difficulty === 'Çok Kolay' ? 'bg-green-100 text-green-700' :
                        video.difficulty === 'Kolay' ? 'bg-blue-100 text-blue-700' :
                        video.difficulty === 'Orta' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-secondary-100 text-secondary-600'
                      }`}>
                        {video.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* DIY Rehberleri */}
      <section className="py-16 bg-gradient-to-br from-primary-500 to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
              <span className="text-2xl">🏠</span>
              <span className="text-white font-bold text-sm">Evde Yapılabilir</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Kendiniz Yapın, Tasarruf Edin
            </h2>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto">
              Bu basit bakım işlemlerini evde yaparak yüzlerce lira tasarruf edebilirsiniz.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {diyGuides.map((guide, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-secondary-900">{guide.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    guide.difficulty === 'Çok Kolay' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {guide.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-secondary-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {guide.time}
                  </div>
                  <div className="flex items-center gap-1 text-green-600 font-bold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {guide.savings} tasarruf
                  </div>
                </div>

                <div className="border-t border-secondary-100 pt-4">
                  <p className="text-xs text-secondary-500 font-bold uppercase mb-2">Adımlar</p>
                  <ol className="space-y-1">
                    {guide.steps.map((step, stepIdx) => (
                      <li key={stepIdx} className="flex items-center gap-2 text-sm text-secondary-600">
                        <span className="w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {stepIdx + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube/TikTok Bağlantıları */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">Bizi Takip Edin</h2>
            <p className="text-lg text-secondary-600">Yeni videolardan haberdar olmak için sosyal medyada bizi takip edin</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* YouTube */}
            <a href="#" className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-8 text-white text-center hover:scale-105 transition-transform shadow-xl">
              <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z"/>
              </svg>
              <h3 className="text-xl font-bold mb-2">YouTube</h3>
              <p className="text-red-100 text-sm mb-4">Detaylı bakım videoları</p>
              <span className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-medium">
                Kanala Git
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>

            {/* TikTok */}
            <a href="#" className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 text-white text-center hover:scale-105 transition-transform shadow-xl">
              <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
              <h3 className="text-xl font-bold mb-2">TikTok</h3>
              <p className="text-gray-400 text-sm mb-4">Hızlı ipuçları ve tüyolar</p>
              <span className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-medium">
                Takip Et
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>

            {/* Instagram */}
            <a href="#" className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-2xl p-8 text-white text-center hover:scale-105 transition-transform shadow-xl">
              <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <h3 className="text-xl font-bold mb-2">Instagram</h3>
              <p className="text-white/80 text-sm mb-4">Görsel içerikler</p>
              <span className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-medium">
                Takip Et
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedVideo(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Video Player Placeholder */}
            <div className="relative aspect-video bg-secondary-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">Video oynatıcı</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">{selectedVideo.title}</h2>
              <p className="text-secondary-600 mb-4">{selectedVideo.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <span className="flex items-center gap-1 text-secondary-500 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {selectedVideo.duration}
                </span>
                <span className="flex items-center gap-1 text-secondary-500 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {selectedVideo.views} izlenme
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedVideo.difficulty === 'Çok Kolay' ? 'bg-green-100 text-green-700' :
                  selectedVideo.difficulty === 'Kolay' ? 'bg-blue-100 text-blue-700' :
                  selectedVideo.difficulty === 'Orta' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-secondary-100 text-secondary-600'
                }`}>
                  {selectedVideo.difficulty}
                </span>
              </div>

              {selectedVideo.tools.length > 0 && (
                <div className="bg-secondary-50 rounded-xl p-4">
                  <h3 className="font-bold text-secondary-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Gerekli Malzemeler
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo.tools.map((tool, idx) => (
                      <span key={idx} className="bg-white px-3 py-1 rounded-lg text-sm text-secondary-600 border border-secondary-200">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-red-500 to-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Profesyonel Yardıma mı İhtiyacınız Var?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Her işi kendiniz yapmanız gerekmiyor. Güvenilir servislerimizi keşfedin.
          </p>
          <Link href="/servisler" className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
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
