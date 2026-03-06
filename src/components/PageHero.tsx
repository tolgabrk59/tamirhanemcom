'use client';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 md:py-24 overflow-hidden">
      {/* Background Image with 10% opacity */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-400/10 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
