import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Sohbet - Araç Asistanı',
  description: 'TamirHanem AI asistanı ile aracınız hakkında sorular sorun. Bakım, onarım, parça ve servis konularında anında yanıt alın.',
  openGraph: {
    title: 'AI Sohbet - Araç Asistanı',
    description: 'AI asistan ile aracınız hakkında sorular sorun.',
    type: 'website',
  },
};

export default function SohbetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
