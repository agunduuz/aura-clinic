# Aura Clinic

İstanbul merkezli estetik ve plastik cerrahi kliniği için Next.js (App Router) ile geliştirilmiş, Prisma/PostgreSQL destekli, tam CMS'li (yönetim paneli üzerinden header, footer, anasayfa, blog, prosedür sayfaları düzenlenebilir) çok dilli (TR/EN) kurumsal web sitesi.

## Teknolojiler

- **Next.js 15** (App Router, Server Components)
- **Prisma ORM** + PostgreSQL (Neon)
- **NextAuth** — yönetim paneli kimlik doğrulama
- **Cloudinary** — görsel yükleme/optimizasyon
- **Resend** — iletişim formu e-posta gönderimi
- **Tailwind CSS**, Framer Motion

## Geliştirme

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresini açarak sonucu görüntüleyin.

Ortam değişkenleri için `.env.example` dosyasını referans alın.

## Veritabanı

```bash
npx prisma migrate dev
npx prisma db seed
```

## Deploy

Proje Vercel üzerinde deploy edilir. Prisma `DATABASE_URL` ve diğer gerekli ortam değişkenlerinin (`NEXT_PUBLIC_BASE_URL`, `RESEND_API_KEY`, `NEXTAUTH_SECRET` vb.) Vercel proje ayarlarında tanımlı olması gerekir.
