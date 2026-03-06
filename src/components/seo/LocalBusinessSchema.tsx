interface LocalBusinessSchemaProps {
  name: string;
  description: string;
  city: string;
  lat: number;
  lng: number;
  priceRange?: string;
  serviceType?: string[];
  url: string;
}

export default function LocalBusinessSchema({
  name,
  description,
  city,
  lat,
  lng,
  priceRange = '$$',
  serviceType = ['Araç Bakımı', 'Oto Tamir'],
  url,
}: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': url,
    name,
    description,
    url,
    priceRange,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
    },
    areaServed: {
      '@type': 'City',
      name: city,
    },
    serviceType,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '14:00',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
