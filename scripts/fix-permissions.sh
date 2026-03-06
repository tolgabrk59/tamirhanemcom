#!/bin/bash
# fix-permissions.sh - Dosya izinlerini düzeltir
# Kullanım: ./scripts/fix-permissions.sh

set -e

PROJECT_DIR="/home/dietpi/tamirhanem-next"
USER="dietpi"
GROUP="dietpi"

echo "📁 Dosya izinleri düzeltiliyor..."

# Tüm dosyaları dietpi sahipliğine al
sudo chown -R $USER:$GROUP $PROJECT_DIR

# .next klasörünü temizle (izin sorunlarını önlemek için)
if [ -d "$PROJECT_DIR/.next" ]; then
    echo "🗑️  .next cache temizleniyor..."
    rm -rf "$PROJECT_DIR/.next"
fi

echo "✅ Dosya izinleri düzeltildi!"
