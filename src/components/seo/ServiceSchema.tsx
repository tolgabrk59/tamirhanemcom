interface ServiceSchemaProps {
  name: string;
  description: string;
  provider: string;
  areaServed: string;
  priceRange?: string;
  url: string;
}

export default function ServiceSchema({
  name,
  description,
  provider,
  areaServed,
  priceRange,
  url,
}: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'LocalBusiness',
      name: provider,
    },
    areaServed: {
      '@type': 'City',
      name: areaServed,
    },
    ...(priceRange && {
      offers: {
        '@type': 'Offer',
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: priceRange,
          priceCurrency: 'TRY',
        },
      },
    }),
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
