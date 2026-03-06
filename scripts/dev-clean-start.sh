#!/bin/bash
# dev-clean-start.sh - Temiz dev server başlatır
# Kullanım: ./scripts/dev-clean-start.sh

set -e

PROJECT_DIR="/home/dietpi/tamirhanem-next"

echo "🔄 Mevcut Next.js process'leri durduruluyor..."

# Mevcut next dev process'lerini durdur
pkill -f "next dev" 2>/dev/null || true

# Portları temizle
for port in 3000 3001 3002 3003 3004; do
    lsof -ti:$port 2>/dev/null | xargs -r kill -9 2>/dev/null || true
done

sleep 2

echo "🗑️  Cache temizleniyor..."
rm -rf "$PROJECT_DIR/.next" 2>/dev/null || true

echo "🚀 Dev server başlatılıyor..."
cd $PROJECT_DIR
npm run dev
