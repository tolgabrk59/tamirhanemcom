# Tire-Research Collection Permission Ayarları

## ✅ Yapılanlar:
1. tire-research collection'ı oluşturuldu ✅
2. Schema dosyaları oluşturuldu ✅
3. Controller/Service/Route dosyaları oluşturuldu ✅
4. Strapi restart edildi ✅

## ⚠️ Yapılması Gerekenler:

### Permission Ayarlama (Admin Panelinden)

1. **Admin Panel'e Girin:**
   - URL: https://api.tamirhanem.net/admin
   - Email: hakanisler112@gmail.com
   - Şifre: Rapso112a.

2. **Settings > Users & Permissions > Roles > Public**

3. **Tire-Research bölümünü bulun** ve tüm kutucukları işaretleyin:
   - ✅ find
   - ✅ findOne
   - ✅ create
   - ✅ update
   - ✅ delete

4. **Save** butonuna tıklayın

5. **Strapi'yi Restart edin** (SSH ile):
   ```bash
   ssh dietpi@192.168.5.250
   pkill -f "strapi start"
   cd /mnt/dietpi_userdata/my-strapi-v4
   nohup strapi start > /tmp/strapi.log 2>&1 &
   ```

## Test

```bash
# API Test
curl -s 'https://api.tamirhanem.net/api/tire-researches'
# Boş array dönmeli: {"data":[],"meta":{}}

# İlk Kayıt Testi (web2 projesinden)
cd /home/tolgabrk/Documents/ProjelerTamirhanem/tamirhanem-next/web2
curl -X POST 'http://localhost:3000/api/ai/tire-research' \
  -H "Content-Type: application/json" \
  -d '{"brand":"BMW","model":"320i","year":2020,"season":"summer"}'
```

## Özet

| Adım | Durum |
|------|-------|
| Collection oluşturma | ✅ Tamam |
| Schema dosyaları | ✅ Tamam |
| Controller/Service/Route | ✅ Tamam |
| Permission ayarları | ⚠️ Manuel yapılacak |
| Test | ⏳ Bekliyor |
