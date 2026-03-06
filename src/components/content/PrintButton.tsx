'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 text-secondary-500 hover:text-primary-600 text-sm"
    >
      <Printer className="w-4 h-4" />
      Yazdır
    </button>
  );
}
