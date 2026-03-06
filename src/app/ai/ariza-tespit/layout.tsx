import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Arıza Tespit - Aracınızın Sorununu Bulun',
  description: 'Yapay zeka ile aracınızın arızasını tespit edin. Sorunlarınızı tanımlayın, AI asistanımız size en olası nedenleri ve çözümleri sunsun.',
  openGraph: {
    title: 'AI Arıza Tespit',
    description: 'Yapay zeka ile aracınızın arızasını tespit edin.',
    type: 'website',
  },
};

export default function ArizaTespitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
