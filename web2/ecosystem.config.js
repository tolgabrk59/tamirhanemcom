module.exports = {
  apps: [{
    name: 'tamirhanem-web2',
    script: 'node_modules/.bin/next',
    args: 'start -p 3333',
    cwd: '/home/tolgabrk/Documents/ProjelerTamirhanem/tamirhanem-next/web2',
    env: {
      NODE_ENV: 'production',
      // SMTP
      SMTP_HOST: 'mail.kurumsaleposta.com',
      SMTP_PORT: '587',
      SMTP_USER: 'noreply@tamirhanem.com',
      SMTP_PASS: '5l-na10G=JA:_m7G',
      ADMIN_NOTIFY_EMAIL: 'bilgi@tamirhanem.com',
      // Strapi
      STRAPI_API_URL: 'https://api.tamirhanem.net/api',
      STRAPI_API_TOKEN: '540f117558fc18755aaf9d668122b6155aa80cfd59377f718c4fbf5fcfc450f95e477d98b331148f36ab17453263859557eb4c1fa54a7fbe320a67849b9a35c4',
      STRAPI_ADMIN_EMAIL: 'hakanisler112@gmail.com',
      // Upstash Redis
      UPSTASH_REDIS_REST_URL: 'https://sound-dove-13112.upstash.io',
      UPSTASH_REDIS_REST_TOKEN: 'ATM4AAIncDJjNzdhY2VhMDZiNmI0MDliYTI5ZTNjY2Q1NTc1MTE2Y3AyMTMxMTI',
      // Netgsm SMS
      NETGSM_USERNAME: '8503027264',
      NETGSM_PASSWORD: 'DA923-4',
      NETGSM_HEADER: 'NEXTAI',
      // Mapbox
      NEXT_PUBLIC_MAPBOX_TOKEN: 'process.env.NEXT_PUBLIC_MAPBOX_TOKEN',
    },
  }],
}
