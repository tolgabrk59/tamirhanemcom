'use client'

/**
 * API Documentation Page
 *
 * OpenAPI specification is available at /api/openapi.json
 *
 * Interactive documentation coming soon.
 */
export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          API Dokümantasyonu
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            OpenAPI Spesifikasyonu
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            API spesifikasyonuna erişmek için aşağıdaki endpoint'i kullanın:
          </p>
          <code className="block bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm">
            GET /api/openapi.json
          </code>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Ana Endpoint'ler
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">GET /api/health</code> - Sağlık kontrolü</li>
            <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">POST /api/ai/diagnose</code> - AI arıza tespiti</li>
            <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">GET /api/obd/code/{'{code}'}</code> - OBD kod sorgulama</li>
            <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">GET /api/brands</code> - Marka listesi</li>
            <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">GET /api/services</code> - Servis arama</li>
          </ul>
        </div>

        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            ⚠️ İnteraktif API dokümantasyonu yakında eklenecek.
          </p>
        </div>
      </div>
    </div>
  )
}
