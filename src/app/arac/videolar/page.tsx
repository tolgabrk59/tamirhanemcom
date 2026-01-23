'use client';

import { useState } from 'react';

interface VideoCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  videos: Video[];
}

interface Video {
  id: string;
  title: string;
  youtubeId: string;
  duration: string;
  channel: string;
}

const PlayIcon = () => (
  <svg className="w-12 h-12 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const categories: VideoCategory[] = [
  {
    id: 'bakim',
    title: 'Temel Bakım',
    description: 'Yağ değişimi, filtre değişimi ve rutin bakım işlemleri',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    videos: [
      { id: '1', title: 'Evde Motor Yağı Değişimi Nasıl Yapılır?', youtubeId: 'O1hF25Cowv8', duration: '15:42', channel: 'ChrisFix TR' },
      { id: '2', title: 'Hava Filtresi Değişimi - Tüm Araçlar', youtubeId: 'KjHTMGBv0LA', duration: '8:23', channel: 'Oto Destekçim' },
      { id: '3', title: 'Yağ Filtresi ve Motor Yağı Seçimi Rehberi', youtubeId: 'TWoWQMeomz0', duration: '12:15', channel: 'Alaatin61' },
      { id: '4', title: 'Klima Bakımı ve Temizliği', youtubeId: 'QqJXx_X2aR0', duration: '10:30', channel: 'Doğan Kabak' },
    ]
  },
  {
    id: 'fren',
    title: 'Fren Sistemi',
    description: 'Balata, disk ve fren hidroliği bakımı',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    videos: [
      { id: '5', title: 'Ön Fren Balatası Değişimi', youtubeId: 'HnYVL6kv7Vw', duration: '18:30', channel: 'ChrisFix TR' },
      { id: '6', title: 'Fren Diski Değişimi Rehberi', youtubeId: '6RQ9UabOyDQ', duration: '22:15', channel: 'Oto Destekçim' },
      { id: '7', title: 'Fren Hidroliği Değişimi', youtubeId: 'n1NvtxQLV9M', duration: '14:45', channel: 'Benzin TV' },
      { id: '8', title: 'Arka Kampana Fren Bakımı', youtubeId: 'BqHkUn3Z7F4', duration: '20:10', channel: 'Alaatin61' },
    ]
  },
  {
    id: 'elektrik',
    title: 'Elektrik Sistemi',
    description: 'Akü, ampul, sigorta ve elektrik arızaları',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    videos: [
      { id: '9', title: 'Araba Aküsü Nasıl Değiştirilir?', youtubeId: 'aS-6TQjF5Po', duration: '11:20', channel: 'Doğan Kabak' },
      { id: '10', title: 'Far Ampulü Değişimi (H7, H4, LED)', youtubeId: 'WEE21NyTqXU', duration: '9:45', channel: 'Otomobil Dünyam' },
      { id: '11', title: 'Sigorta Kutusu ve Arıza Tespiti', youtubeId: 'oJdSJhR0vOs', duration: '13:30', channel: 'Oto Destekçim' },
      { id: '12', title: 'Marş Motoru Arızası ve Çözümü', youtubeId: 'Gm4LQvTcwxg', duration: '16:55', channel: 'Alaatin61' },
    ]
  },
  {
    id: 'motor',
    title: 'Motor Bakımı',
    description: 'Buji, kayış, termostat ve motor parçaları',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    videos: [
      { id: '13', title: 'Buji Değişimi ve Kontrol', youtubeId: 'qCZP3UVoWGE', duration: '10:15', channel: 'ChrisFix TR' },
      { id: '14', title: 'V Kayış (Triger Kayışı) Değişimi', youtubeId: 'iJ3c3h9Lp8s', duration: '25:40', channel: 'Benzin TV' },
      { id: '15', title: 'Termostat Değişimi ve Test', youtubeId: '3z5V9TgHqeE', duration: '17:20', channel: 'Oto Destekçim' },
      { id: '16', title: 'Bobinlerin Test Edilmesi', youtubeId: 'Y_9bnQxV5e0', duration: '12:35', channel: 'Alaatin61' },
    ]
  },
  {
    id: 'suspansiyon',
    title: 'Süspansiyon',
    description: 'Amortisör, rotil, rot başı ve şasi parçaları',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    videos: [
      { id: '17', title: 'Ön Amortisör Değişimi', youtubeId: 'sT0RG3_owQY', duration: '28:15', channel: 'Doğan Kabak' },
      { id: '18', title: 'Rotil ve Rot Başı Değişimi', youtubeId: 'X7xAq4Y0M4c', duration: '19:45', channel: 'Oto Destekçim' },
      { id: '19', title: 'Salıncak (Alt Tabla) Değişimi', youtubeId: 'fWpP8N9k5aw', duration: '23:30', channel: 'Alaatin61' },
      { id: '20', title: 'Balans ve Rot Ayarı Önemi', youtubeId: 'HfM1X8sLG8c', duration: '15:20', channel: 'Benzin TV' },
    ]
  },
  {
    id: 'lastik',
    title: 'Lastik ve Jant',
    description: 'Lastik değişimi, tamir ve bakımı',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    videos: [
      { id: '21', title: 'Yolda Lastik Patlaması - Stepne Takma', youtubeId: 'joBmbh0AGSQ', duration: '12:40', channel: 'ChrisFix TR' },
      { id: '22', title: 'Lastik Tamir Kiti Kullanımı', youtubeId: 'QR3BkYQxVeE', duration: '8:15', channel: 'Otomobil Dünyam' },
      { id: '23', title: 'Lastik Basınç Kontrolü ve TPMS', youtubeId: 'sKhH-Rp9zSE', duration: '10:50', channel: 'Doğan Kabak' },
      { id: '24', title: 'Jant Temizliği ve Bakımı', youtubeId: 'GE76dz9KMwA', duration: '14:25', channel: 'Oto Destekçim' },
    ]
  },
];

export default function VideoContentPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const filteredCategories = selectedCategory
    ? categories.filter(c => c.id === selectedCategory)
    : categories;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          {/* Play button decorations */}
          <div className="absolute top-20 left-[10%] opacity-10">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="absolute bottom-20 right-[15%] opacity-10 rotate-12">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
              <span className="text-sm font-semibold">Kendin Yap Video Rehberleri</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">İçerik</span> Merkezi
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Aracınızın bakım ve onarımını kendiniz yapabilmeniz için hazırlanmış
              adım adım video rehberleri
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              <div className="text-center">
                <div className="text-3xl font-black text-primary-400">{categories.length}</div>
                <div className="text-sm text-gray-400">Kategori</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-primary-400">{categories.reduce((acc, c) => acc + c.videos.length, 0)}+</div>
                <div className="text-sm text-gray-400">Video</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-primary-400">10+</div>
                <div className="text-sm text-gray-400">Saat İçerik</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tümü
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.icon}
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Video Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Category Header */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center text-white">
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{category.title}</h2>
                  <p className="text-gray-400 text-sm">{category.description}</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-gray-300">
                    {category.videos.length} video
                  </span>
                </div>
              </div>

              {/* Videos Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.videos.map((video) => (
                    <div
                      key={video.id}
                      className="group cursor-pointer"
                      onClick={() => setPlayingVideo(playingVideo === video.youtubeId ? null : video.youtubeId)}
                    >
                      {playingVideo === video.youtubeId ? (
                        <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                          <iframe
                            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="relative aspect-video rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all">
                          {/* Thumbnail */}
                          <img
                            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                            <div className="w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                              <PlayIcon />
                            </div>
                          </div>
                          {/* Duration badge */}
                          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-white text-xs font-medium">
                            {video.duration}
                          </div>
                        </div>
                      )}

                      {/* Video Info */}
                      <div className="mt-3">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-primary-600 transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          {video.channel}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-primary-50 via-white to-yellow-50 rounded-2xl p-8 border border-primary-200 shadow-lg">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Kendin Yap İpuçları</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Her işlemden önce aracınızı güvenli bir şekilde kaldırın ve destekleyin</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Doğru araç ve yedek parça kullandığınızdan emin olun</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Karmaşık işlemlerde profesyonel yardım almaktan çekinmeyin</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Güvenlik ekipmanlarınızı (eldiven, gözlük) kullanmayı ihmal etmeyin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Profesyonel Yardım mı Lazım?</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Bazı işlemler için profesyonel ekipman ve deneyim gerekebilir. Size en yakın güvenilir servisi bulun.
          </p>
          <a
            href="/servisler"
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Servis Bul
          </a>
        </div>
      </div>
    </div>
  );
}
