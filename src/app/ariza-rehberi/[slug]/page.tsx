import { redirect } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Tüm slug'ları /ariza-bul'a yönlendir
export default async function ArizaRehberiSlugPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  // check-engine-lambasi için içerik göster
  if (resolvedParams.slug === 'check-engine-lambasi') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Motor Kontrol Lambası (Check Engine)
            </h1>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Motor kontrol lambası yanığında, aracınızın emisyon veya motor sisteminde bir sorun olabilir.
              </p>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Ne Yapmalısınız?</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Aracı güvenli bir yere çekin</li>
                <li>Gaz kapağının sıkı kapalı olduğunu kontrol edin</li>
                <li>Yakıt kalitesini düşünün</li>
                <li>Profesyonel bir teşhis için servise başvurun</li>
              </ul>
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-medium">
                  Lamba yanıp sönöyorsa, sorun daha acildir. Aracı hemen servise götürün.
                </p>
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <Link 
                href="/ariza-bul" 
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Arıza Teşhis Et
              </Link>
              <Link 
                href="/ariza-rehberi" 
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Geri Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Diğer tüm slug'ları /ariza-bul'a yönlendir
  redirect('/ariza-bul');
}
