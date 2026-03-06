# Strapi Collection Oluşturma Rehberi

## Admin Panelinden Collection Oluşturma

### 1. Vehicle Analyses Collection

1. Strapi Admin Panel'e gidin: `https://api.tamirhanem.net/admin`
2. Sol menüden **Content-Type Builder**'a tıklayın
3. **Create new collection type** butonuna tıklayın
4. **Collection type name**: `vehicle-analysis`
5. Şu alanları ekleyin:

| Field Name | Type | Required | Advanced Settings |
|------------|------|----------|-------------------|
| brand | Text | ✅ | Max length: 100 |
| model | Text | ✅ | Max length: 100 |
| year | Integer | ✅ | Min: 1900, Max: 2100 |
| data | JSON | ✅ | - |

6. **Save** butonuna tıklayın

---

### 2. Tire Researches Collection

1. **Create new collection type** butonuna tıklayın
2. **Collection type name**: `tire-research`
3. Şu alanları ekleyin:

| Field Name | Type | Required | Advanced Settings |
|------------|------|----------|-------------------|
| brand | Text | ✅ | Max length: 100 |
| model | Text | ✅ | Max length: 100 |
| year | Integer | ✅ | Min: 1900, Max: 2100 |
| season | Enumeration | ✅ | Values: `summer`, `winter`, `all_season` |
| data | JSON | ✅ | - |

4. **Save** butonuna tıklayın

---

## API Permissions Ayarlama

Collection'ları oluşturduktan sonra permissions ayarlamak için:

1. Sol menüden **Settings** > **Roles** > **Public**'e tıklayın
2. **Vehicle-Analysis** ve **Tire-Research** için tüm izinleri açın:
   - ✅ find
   - ✅ findOne
   - ✅ create
   - ✅ update
   - ✅ delete

3. **Save** butonuna tıklayın

---

## Test

Collection'lar oluşturulduktan sonra API'yi test edebilirsiniz:

```bash
# Vehicle Analysis
curl -X POST "http://localhost:3000/api/ai/research" \
  -H "Content-Type: application/json" \
  -d '{"brand":"BMW","model":"320i","year":2020}'

# Tire Research
curl -X POST "http://localhost:3000/api/ai/tire-research" \
  -H "Content-Type: application/json" \
  -d '{"brand":"BMW","model":"320i","year":2020,"season":"summer"}'
```

İlk sorgu LLM'e gidecek ve Strapi'ye kaydedecek.
Sonraki sorgular doğrudan Strapi'den gelecek.
