# 🚀 Tire-Research Permission Ayarı - Hızlı Rehber

## Admin Panelinden Permission Ayarlama (2 Dakika)

### Adım 1: Giriş Yapın
```
URL: https://api.tamirhanem.net/admin
Email: hakanisler112@gmail.com
Şifre: Rapso112a.
```

### Adım 2: Ayarları Açın
1. Sol menüden **⚙️ Settings** ikonuna tıklayın (en altta)
2. **Users & Permissions Plugin** > **Roles** > **Public**'e tıklayın

### Adım 3: Tire-Research Permission'ını Aın
Scroll yaparak **Tire-Research** bölümünü bulun.
Aşağıdaki tüm kutucukları işaretleyin:

```
☑️ find
☑️ findOne
☑️ create
☑️ update
☑️ delete
```

### Adım 4: Kaydedin
Sağ üstteki **Save** butonuna tıklayın.

### Adım 5: Test Edin
```bash
curl -s 'https://api.tamirhanem.net/api/tire-researches'
# Sonuç: {"data":[],"meta":{}} olmalı
```

---

## ✅ Sonuç

| Bileşen | Durum |
|---------|-------|
| Collection | ✅ Oluşturuldu |
| Schema | ✅ Hazır |
| Controllers | ✅ Hazır |
| Strapi Restart | ✅ Yapıldı |
| Permission | ⏳ Sizin yapmanız gerekiyor |

Permission ayarı yapıldığında söyleyin, test edelim!
