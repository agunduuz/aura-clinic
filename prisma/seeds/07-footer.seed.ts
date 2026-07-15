// prisma/seeds/07-footer.seed.ts
// ============================================
// SEED: FOOTER
// ============================================

import { PrismaClient } from "@prisma/client";

export async function seedFooter(prisma: PrismaClient) {
  console.log("🔄 Seeding footer...");

  const existingFooterContent = await prisma.footerContent.findFirst();
  if (!existingFooterContent) {
    await prisma.footerContent.createMany({
      data: [
        {
          locale: "tr",
          phone: "+90 212 111 11 11",
          email: "info@auraclinic.com",
          address: "İstanbul, Türkiye",
          copyrightText: "© 2024 Aura Clinic. Tüm hakları saklıdır.",
        },
        {
          locale: "en",
          phone: "+90 212 111 11 11",
          email: "info@auraclinic.com",
          address: "Istanbul, Turkey",
          copyrightText: "© 2024 Aura Clinic. All rights reserved.",
        },
      ],
    });
  }

  const existingFooterGroups = await prisma.footerLinkGroup.findMany();
  if (existingFooterGroups.length === 0) {
    const corporateGroupTR = await prisma.footerLinkGroup.create({
      data: {
        locale: "tr",
        title: "Kurumsal",
        slug: "corporate",
        order: 1,
        active: true,
      },
    });
    const servicesGroupTR = await prisma.footerLinkGroup.create({
      data: {
        locale: "tr",
        title: "Hizmetler",
        slug: "services",
        order: 2,
        active: true,
      },
    });
    const corporateGroupEN = await prisma.footerLinkGroup.create({
      data: {
        locale: "en",
        title: "Corporate",
        slug: "corporate",
        order: 1,
        active: true,
      },
    });
    const servicesGroupEN = await prisma.footerLinkGroup.create({
      data: {
        locale: "en",
        title: "Services",
        slug: "services",
        order: 2,
        active: true,
      },
    });

    await prisma.footerLink.createMany({
      data: [
        {
          groupId: corporateGroupTR.id,
          title: "Hakkımızda",
          href: "/hakkimizda",
          order: 1,
          active: true,
        },
        {
          groupId: corporateGroupTR.id,
          title: "İletişim",
          href: "/iletisim",
          order: 2,
          active: true,
        },
        {
          groupId: servicesGroupTR.id,
          title: "Ameliyatlı Estetik",
          href: "/ameliyatli-estetik",
          order: 1,
          active: true,
        },
        {
          groupId: servicesGroupTR.id,
          title: "Lazer Epilasyon",
          href: "/lazer-epilasyon",
          order: 2,
          active: true,
        },
        {
          groupId: corporateGroupEN.id,
          title: "About Us",
          href: "/en/about",
          order: 1,
          active: true,
        },
        {
          groupId: corporateGroupEN.id,
          title: "Contact",
          href: "/en/contact",
          order: 2,
          active: true,
        },
        {
          groupId: servicesGroupEN.id,
          title: "Surgical Aesthetics",
          href: "/en/surgical-aesthetics",
          order: 1,
          active: true,
        },
        {
          groupId: servicesGroupEN.id,
          title: "Laser Hair Removal",
          href: "/en/laser-hair-removal",
          order: 2,
          active: true,
        },
      ],
    });
  }

  console.log("✅ Footer seeded!");
}
