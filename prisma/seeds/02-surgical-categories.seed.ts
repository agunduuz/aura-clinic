// prisma/seeds/02-surgical-categories.seed.ts
// ============================================
// SEED: SURGICAL CATEGORIES
// ============================================

import { PrismaClient } from "@prisma/client";
import { trOperations, enOperations } from "../../data/operations";

// ============================================
// HELPER: UPSERT SURGICAL CATEGORY RELATIONS
// ============================================
async function upsertSurgicalRelations(
  prisma: PrismaClient,
  categoryId: string,
  data: {
    advantages?: string[];
    process?: Array<{ step: string; description: string }>;
    faqs?: Array<{ question: string; answer: string }>;
  },
) {
  // Advantages
  if (data.advantages) {
    for (let i = 0; i < data.advantages.length; i++) {
      await prisma.surgicalAdvantage.upsert({
        where: {
          categoryId_order: {
            categoryId,
            order: i + 1,
          },
        },
        update: {
          title: data.advantages[i],
          description: data.advantages[i],
        },
        create: {
          categoryId,
          title: data.advantages[i],
          description: data.advantages[i],
          order: i + 1,
        },
      });
    }
  }

  // Process Steps
  if (data.process) {
    for (let i = 0; i < data.process.length; i++) {
      await prisma.surgicalProcessStep.upsert({
        where: {
          categoryId_order: {
            categoryId,
            order: i + 1,
          },
        },
        update: {
          step: data.process[i].step,
          description: data.process[i].description,
        },
        create: {
          categoryId,
          step: data.process[i].step,
          description: data.process[i].description,
          order: i + 1,
        },
      });
    }
  }

  // FAQs
  if (data.faqs) {
    for (let i = 0; i < data.faqs.length; i++) {
      await prisma.surgicalFAQ.upsert({
        where: {
          categoryId_order: {
            categoryId,
            order: i + 1,
          },
        },
        update: {
          question: data.faqs[i].question,
          answer: data.faqs[i].answer,
        },
        create: {
          categoryId,
          question: data.faqs[i].question,
          answer: data.faqs[i].answer,
          order: i + 1,
        },
      });
    }
  }
}

// ============================================
// SEED: SURGICAL CATEGORIES (Minimal)
// ============================================
async function seedSurgicalCategoriesMinimal(prisma: PrismaClient) {
  console.log("🔄 Seeding surgical categories (minimal)...");

  const slugMapping: Record<string, string> = {
    yuz: "facial",
    "burun-estetigi": "rhinoplasty",
    "yuz-germe": "face-lift",
    "goz-kapagi-estetigi": "eye-bag-surgery",
    vucut: "body",
    "karin-germe": "tummy-tuck",
    liposuction: "liposuction",
    meme: "breast",
    "meme-buyutme": "augmentation",
    "meme-kucultme": "reduction",
  };

  let order = 1;

  // TR Categories - Only structure
  for (const [slug, data] of Object.entries(trOperations)) {
    await prisma.surgicalCategory.upsert({
      where: {
        slug_locale: { slug, locale: "tr" },
      },
      update: {
        title: data.title,
        description: data.description,
        heroImage: data.image,
      },
      create: {
        locale: "tr",
        slug,
        title: data.title,
        description: data.description,
        heroImage: data.image,
        clinicImage: "/images/klinik-resimleri.jpeg",
        seoContent: `${data.title} hakkında detaylı bilgi.`,
        galleryImages: data.images || [],
        patientsCount: "15,000+",
        experienceYears: "15+",
        rating: "4.9/5",
        metaTitle: `${data.title} İstanbul | Aura Clinic`,
        metaDescription: data.description,
        metaKeywords: data.title.toLowerCase(),
        published: false,
        order: order++,
      },
    });
  }

  // EN Categories - Only structure
  order = 1;
  for (const [trSlug] of Object.entries(trOperations)) {
    const enSlug = slugMapping[trSlug];
    if (!enSlug) continue;

    const enData = enOperations[enSlug];
    if (!enData) continue;

    await prisma.surgicalCategory.upsert({
      where: {
        slug_locale: { slug: enSlug, locale: "en" },
      },
      update: {
        title: enData.title,
        description: enData.description,
        heroImage: enData.image,
      },
      create: {
        locale: "en",
        slug: enSlug,
        title: enData.title,
        description: enData.description,
        heroImage: enData.image,
        clinicImage: "/images/klinik-resimleri.jpeg",
        seoContent: `Learn more about ${enData.title}.`,
        galleryImages: enData.images || [],
        patientsCount: "15,000+",
        experienceYears: "15+",
        rating: "4.9/5",
        metaTitle: `${enData.title} Istanbul | Aura Clinic`,
        metaDescription: enData.description,
        metaKeywords: enData.title.toLowerCase(),
        published: false,
        order: order++,
      },
    });
  }

  console.log("✅ Surgical categories (minimal) seeded!");
}

// ============================================
// SEED: SURGICAL CATEGORIES (Full)
// ============================================
async function seedSurgicalCategoriesFull(prisma: PrismaClient) {
  console.log("🔄 Seeding surgical categories (full)...");

  const slugMapping: Record<string, string> = {
    yuz: "facial",
    "burun-estetigi": "rhinoplasty",
    "yuz-germe": "face-lift",
    "goz-kapagi-estetigi": "eye-bag-surgery",
    vucut: "body",
    "karin-germe": "tummy-tuck",
    liposuction: "liposuction",
    meme: "breast",
    "meme-buyutme": "augmentation",
    "meme-kucultme": "reduction",
  };

  let order = 1;

  // TR Categories with relations
  for (const [slug, data] of Object.entries(trOperations)) {
    const category = await prisma.surgicalCategory.upsert({
      where: {
        slug_locale: { slug, locale: "tr" },
      },
      update: {
        title: data.title,
        description: data.description,
        heroImage: data.image,
      },
      create: {
        locale: "tr",
        slug,
        title: data.title,
        description: data.description,
        heroImage: data.image,
        clinicImage: "/images/klinik-resimleri.jpeg",
        seoContent: `${data.title} konusunda Türkiye'nin en deneyimli estetik cerrahları ile çalışıyoruz.`,
        galleryImages: data.images || [],
        patientsCount: "15,000+",
        experienceYears: "15+",
        rating: "4.9/5",
        metaTitle: `${data.title} İstanbul | Aura Clinic`,
        metaDescription: data.description,
        metaKeywords: data.title.toLowerCase(),
        published: true,
        order: order++,
      },
    });

    // Upsert relations
    await upsertSurgicalRelations(prisma, category.id, {
      advantages: data.advantages,
      process: data.process,
      faqs: data.faqs,
    });

    // Features
    const features = [
      {
        icon: "Zap",
        title: "Modern Teknoloji",
        description: "En son teknolojik cihazlar",
      },
      {
        icon: "Heart",
        title: "Hasta Odaklı",
        description: "Kişiye özel planlama",
      },
      {
        icon: "Clock",
        title: "Hızlı İyileşme",
        description: "Minimal invaziv yöntemler",
      },
      {
        icon: "TrendingUp",
        title: "Kanıtlanmış Sonuçlar",
        description: "Bilimsel destekli",
      },
    ];

    for (let i = 0; i < features.length; i++) {
      await prisma.surgicalFeature.upsert({
        where: {
          categoryId_order: {
            categoryId: category.id,
            order: i + 1,
          },
        },
        update: features[i],
        create: {
          categoryId: category.id,
          ...features[i],
          order: i + 1,
        },
      });
    }

    // Why Choose Items
    const whyChooseItems = [
      "Uzman ve deneyimli doktor kadrosu",
      "Modern ve güvenli teknoloji",
      "Kişiselleştirilmiş tedavi planları",
      "Hızlı iyileşme süreçleri",
      "Sürekli hasta takibi",
      "Uygun fiyat garantisi",
    ];

    for (let i = 0; i < whyChooseItems.length; i++) {
      await prisma.surgicalWhyChooseItem.upsert({
        where: {
          categoryId_order: {
            categoryId: category.id,
            order: i + 1,
          },
        },
        update: {
          text: whyChooseItems[i],
        },
        create: {
          categoryId: category.id,
          text: whyChooseItems[i],
          order: i + 1,
        },
      });
    }
  }

  // EN Categories (same pattern)
  order = 1;
  for (const [trSlug] of Object.entries(trOperations)) {
    const enSlug = slugMapping[trSlug];
    if (!enSlug) continue;

    const enData = enOperations[enSlug];
    if (!enData) continue;

    const category = await prisma.surgicalCategory.upsert({
      where: {
        slug_locale: { slug: enSlug, locale: "en" },
      },
      update: {
        title: enData.title,
        description: enData.description,
        heroImage: enData.image,
      },
      create: {
        locale: "en",
        slug: enSlug,
        title: enData.title,
        description: enData.description,
        heroImage: enData.image,
        clinicImage: "/images/klinik-resimleri.jpeg",
        seoContent: `We work with Turkey's most experienced aesthetic surgeons.`,
        galleryImages: enData.images || [],
        patientsCount: "15,000+",
        experienceYears: "15+",
        rating: "4.9/5",
        metaTitle: `${enData.title} Istanbul | Aura Clinic`,
        metaDescription: enData.description,
        metaKeywords: enData.title.toLowerCase(),
        published: true,
        order: order++,
      },
    });

    await upsertSurgicalRelations(prisma, category.id, {
      advantages: enData.advantages,
      process: enData.process,
      faqs: enData.faqs,
    });

    // Features (EN)
    const features = [
      {
        icon: "Zap",
        title: "Modern Technology",
        description: "Latest devices and methods",
      },
      {
        icon: "Heart",
        title: "Patient Focused",
        description: "Personalized planning",
      },
      {
        icon: "Clock",
        title: "Quick Recovery",
        description: "Minimally invasive",
      },
      {
        icon: "TrendingUp",
        title: "Proven Results",
        description: "Scientifically backed",
      },
    ];

    for (let i = 0; i < features.length; i++) {
      await prisma.surgicalFeature.upsert({
        where: {
          categoryId_order: {
            categoryId: category.id,
            order: i + 1,
          },
        },
        update: features[i],
        create: {
          categoryId: category.id,
          ...features[i],
          order: i + 1,
        },
      });
    }

    // Why Choose Items (EN)
    const whyChooseItems = [
      "Expert and experienced medical team",
      "Modern and safe technology",
      "Personalized treatment plans",
      "Fast recovery processes",
      "Continuous patient monitoring",
      "Affordable price guarantee",
    ];

    for (let i = 0; i < whyChooseItems.length; i++) {
      await prisma.surgicalWhyChooseItem.upsert({
        where: {
          categoryId_order: {
            categoryId: category.id,
            order: i + 1,
          },
        },
        update: {
          text: whyChooseItems[i],
        },
        create: {
          categoryId: category.id,
          text: whyChooseItems[i],
          order: i + 1,
        },
      });
    }
  }

  console.log("✅ Surgical categories (full) seeded!");
}

// ============================================
// MAIN EXPORT
// ============================================
export async function seedSurgicalCategories(
  prisma: PrismaClient,
  mode: string,
) {
  if (mode === "minimal") {
    await seedSurgicalCategoriesMinimal(prisma);
    console.log("\n✅ Minimal seed complete!");
    console.log("🎨 Add content via admin panel.");
  } else {
    await seedSurgicalCategoriesFull(prisma);
    console.log("\n✅ Full seed complete!");
  }
}
