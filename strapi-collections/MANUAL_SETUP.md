# Tire-Research Collection Oluşturma - Manuel Talimatlar

## Adım 1: Admin Paneline Girin

1. Tarayıcıda açın: https://api.tamirhanem.net/admin
2. Email: hakanisler112@gmail.com
3. Şifre: Rapso112a.

## Adım 2: Content-Type Builder'ı Açın

Sol menüden **Content-Type Builder** ikonuna tıklayın (README simgesi)

## Adım 3: Yeni Collection Oluşturun

**Create new collection type** butonuna tıklayın

## Adım 4: Tire-Research Collection Ayarları

### Collection bilgileri:
- **Collection type name**: `tire-research`
- **Click "Continue"**

### Alanları ekleyin (sırayla):

1. **brand** (Text)
   - Field name: `brand`
   - Type: **Text**
   - Advanced settings > Max length: `100`
   - Required: ✅
   - **+ Add another field**

2. **model** (Text)
   - Field name: `model`
   - Type: **Text**
   - Advanced settings > Max length: `100`
   - Required: ✅
   - **+ Add another field**

3. **year** (Integer)
   - Field name: `year`
   - Type: **Number** (Integer)
   - Required: ✅
   - Advanced settings > Min: `1900`
   - Advanced settings > Max: `2100`
   - **+ Add another field**

4. **season** (Enumeration)
   - Field name: `season`
   - Type: **Enumeration**
   - Values (her biri ayrı satır):
     ```
     summer
     winter
     all_season
     ```
   - Default value: `summer`
   - Required: ✅
   - **+ Add another field**

5. **data** (JSON)
   - Field name: `data`
   - Type: **JSON**
   - Required: ✅
   - **Finish** butonuna tıklayın

## Adım 5: Kaydedin

**Save** butonuna tıklayın

## Adım 6: Permissions Ayarlayın

1. Sol menüden **Settings** > **Users & Permissions Plugin** > **Roles** > **Public**
2. Scroll yapın ve **Tire-Research** bölümünü bulun
3. Tüm kutucukları işaretleyin:
   - ✅ find
   - ✅ findOne
   - ✅ create
   - ✅ update
   - ✅ delete
4. **Save** butonuna tıklayın

## Test

```bash
curl -X POST "http://localhost:3000/api/ai/tire-research" \
  -H "Content-Type: application/json" \
  -d '{"brand":"BMW","model":"320i","year":2020,"season":"summer"}'
```

İlk sorgu LLM'e gidecek ve Strapi'ye kaydedecek.
Sonraki sorgular doğrudan Strapi'den gelecek.
