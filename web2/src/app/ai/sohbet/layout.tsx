import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Araç Asistanı | Tamirhanem',
  description:
    'Yapay zeka destekli araç asistanı ile sohbet edin. Araç bakım, arıza ve onarım konularında anında yanıt alın.',
  keywords: ['yapay zeka sohbet', 'araç asistanı', 'chatbot', 'arıza danışma'],
  openGraph: {
    title: 'Araç Asistanı | Tamirhanem',
    description:
      'Yapay zeka destekli araç asistanı ile sohbet edin. Araç bakım, arıza ve onarım konularında anında yanıt alın.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
