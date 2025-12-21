# Deploy to Vercel

Projeyi git kullanmadan doğrudan Vercel CLI ile deploy et.

## Adımlar

1. Önce projeyi build et:
   ```bash
   cd /home/dietpi/tamirhanem-next && npm run build
   ```

2. Build başarılıysa, Vercel'e deploy et:
   ```bash
   cd /home/dietpi/tamirhanem-next && vercel --prod --yes
   ```

3. Deploy URL'ini kullanıcıya göster.

## Notlar
- Git commit gerektirmez
- Doğrudan dosyaları yükler
- Production ortamına deploy eder
