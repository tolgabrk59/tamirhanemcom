'use client';

import { useEffect, useState } from 'react';

const STRAPI_API = 'https://api.tamirhanem.net/api';

// Fallback kategoriler
const fallbackCategories = [
  'Motor Ustası',
  'Kaporta Ustası',
  'Fren Ustası',
  'Elektrik Ustası',
  'Lastik Ustası',
  'Klima Ustası',
  'Şanzıman Ustası',
  'Egzoz Ustası',
];

// Bu kelimeler varsa "Ustası" ekleme
const skipUstasiKeywords = ['Bakım', 'Servis', 'Onarım', 'Tamiri', 'Değişimi', 'Hibrid', 'Elektrik'];

export default function ServiceCategoriesMarquee() {
  const [categories, setCategories] = useState<string[]>(fallbackCategories);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Strapi'den kategorileri çek
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${STRAPI_API}/categories?pagination[pageSize]=50&sort=name:asc`);
        if (response.ok) {
          const json = await response.json();
          const items = json.data || [];
          if (items.length > 0) {
            const categoryNames = items.map((item: any) => {
              const attrs = item.attributes || item;
              const name = attrs.name;
              
              // Eğer belirli kelimeler varsa direkt kategori adını kullan
              const shouldSkipUstasi = skipUstasiKeywords.some(keyword => 
                name.toLowerCase().includes(keyword.toLowerCase())
              );
              
              return shouldSkipUstasi ? name : `${name} Ustası`;
            });
            setCategories(categoryNames);
          }
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
    fetchCategories();
  }, []);

  // Typewriter efekti
  useEffect(() => {
    const currentCategory = categories[currentIndex];
    let charIndex = 0;
    
    if (isTyping) {
      const typingInterval = setInterval(() => {
        if (charIndex <= currentCategory.length) {
          setDisplayText(currentCategory.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setIsTyping(false);
          }, 2000);
        }
      }, 80);
      
      return () => clearInterval(typingInterval);
    } else {
      let deleteIndex = currentCategory.length;
      const deleteInterval = setInterval(() => {
        if (deleteIndex >= 0) {
          setDisplayText(currentCategory.slice(0, deleteIndex));
          deleteIndex--;
        } else {
          clearInterval(deleteInterval);
          setCurrentIndex((prev) => (prev + 1) % categories.length);
          setIsTyping(true);
        }
      }, 40);
      
      return () => clearInterval(deleteInterval);
    }
  }, [currentIndex, isTyping, categories]);

  return (
    <div className="flex flex-col">
      {/* Üst yazı - Ne Aramıştınız? */}
      <span className="text-gray-400 text-sm md:text-base font-medium mb-1">
        Ne Aramıştınız?
      </span>
      
      {/* Typewriter kategori yazısı */}
      <div className="inline-flex items-center h-10">
        <span
          className="text-xl md:text-2xl lg:text-3xl font-bold tracking-wide"
          style={{
            color: 'rgba(251, 191, 36, 0.9)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {displayText}
        </span>
        {/* Yanıp sönen cursor */}
        <span 
          className="inline-block w-0.5 h-6 md:h-8 lg:h-10 bg-primary-400 ml-1 animate-pulse"
          style={{ animationDuration: '0.7s' }}
        />
      </div>
    </div>
  );
}
