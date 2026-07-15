// prisma/seeds/05-testimonials.seed.ts
// ============================================
// SEED: TESTIMONIALS
// ============================================

import { PrismaClient } from "@prisma/client";

export async function seedTestimonials(prisma: PrismaClient) {
  console.log("🔄 Seeding testimonials...");

  const existingTestimonials = await prisma.testimonial.findMany();
  if (existingTestimonials.length === 0) {
    // TR Testimonials
    await prisma.testimonial.createMany({
      data: [
        {
          locale: "tr",
          name: "Ayşe Demir",
          procedure: "Burun Estetiği",
          comment:
            "Aura Klinik'te yaptırdığım burun estetiği ameliyatı hayallerimin ötesinde bir sonuç verdi. Doktor bey ve ekibi çok profesyonel, ameliyat öncesi ve sonrası ilgileri harikaydı.",
          rating: 5,
          imageUrl:
            "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
          active: true,
          order: 1,
        },
        {
          locale: "tr",
          name: "Mehmet Yılmaz",
          procedure: "Saç Ekimi",
          comment:
            "3 ay önce saç ekimi yaptırdım ve sonuçlardan çok memnunum. Doğal bir görünüm elde ettim. Kesinlikle tavsiye ediyorum!",
          rating: 5,
          imageUrl:
            "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600",
          active: true,
          order: 2,
        },
        {
          locale: "tr",
          name: "Zeynep Kaya",
          procedure: "Lazer Epilasyon",
          comment:
            "Lazer epilasyon seanslarım harika geçti. Ağrısız ve etkili bir uygulama. Artık tüy derdim yok. Teşekkürler Aura Klinik!",
          rating: 5,
          imageUrl:
            "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=600",
          active: true,
          order: 3,
        },
      ],
    });

    // EN Testimonials
    await prisma.testimonial.createMany({
      data: [
        {
          locale: "en",
          name: "Sarah Johnson",
          procedure: "Rhinoplasty",
          comment:
            "The rhinoplasty I had at Aura Clinic exceeded my expectations. The doctor and team were very professional, and their care before and after surgery was excellent.",
          rating: 5,
          imageUrl:
            "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
          active: true,
          order: 1,
        },
        {
          locale: "en",
          name: "Michael Brown",
          procedure: "Hair Transplant",
          comment:
            "I had a hair transplant 3 months ago and I'm very satisfied with the results. I achieved a natural look. I definitely recommend it!",
          rating: 5,
          imageUrl:
            "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600",
          active: true,
          order: 2,
        },
        {
          locale: "en",
          name: "Emma Wilson",
          procedure: "Laser Hair Removal",
          comment:
            "My laser hair removal sessions went great. Painless and effective treatment. I no longer have hair problems. Thank you Aura Clinic!",
          rating: 5,
          imageUrl:
            "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=600",
          active: true,
          order: 3,
        },
      ],
    });
  }

  console.log("✅ Testimonials seeded!");
}
