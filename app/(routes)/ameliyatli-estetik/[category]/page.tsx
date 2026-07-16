// app/(routes)/ameliyatli-estetik/[category]/page.tsx - YENİ VERSİYON
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CategoryPageContent from "@/components/CategoryComponent/CategoryPageContent";
import PhoneButton from "@/components/Header/PhoneButton";
import WhatsAppButton from "@/components/Header/WhatsAppButton";
import { prisma } from "@/lib/prisma";

// ✅ Database'den dynamic params
export async function generateStaticParams() {
  try {
    const categories = await prisma.surgicalCategory.findMany({
      where: {
        published: true,
        active: true,
      },
      select: {
        slug: true,
        locale: true,
      },
    });

    // TR kategorileri döndür (EN için ayrı route olacak)
    return categories
      .filter((cat) => cat.locale === "tr")
      .map((cat) => ({
        category: cat.slug,
      }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

// ✅ Database'den metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;

  try {
    const categoryData = await prisma.surgicalCategory.findFirst({
      where: {
        slug: category,
        locale: "tr",
        published: true,
        active: true,
      },
      select: {
        title: true,
        description: true,
        heroImage: true,
        metaTitle: true,
        metaDescription: true,
        metaKeywords: true,
      },
    });

    if (!categoryData) {
      return {
        title: "Sayfa Bulunamadı",
      };
    }

    const title =
      categoryData.metaTitle ||
      `${categoryData.title} | Türkiye'nin En İyi Estetik Kliniği | Aura Clinic`;
    const description =
      categoryData.metaDescription ||
      `${categoryData.title} konusunda Türkiye'nin lider estetik kliniği. 15+ yıllık deneyim, uzman doktorlar, modern teknoloji. Ücretsiz konsültasyon için hemen arayın!`;

    return {
      title,
      description,
      keywords: categoryData.metaKeywords || undefined,
      openGraph: {
        title,
        description,
        type: "website",
        locale: "tr_TR",
        siteName: "Aura Clinic",
        images: categoryData.heroImage
          ? [
              {
                url: categoryData.heroImage,
                width: 1200,
                height: 630,
                alt: `${categoryData.title} - Aura Clinic`,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: categoryData.heroImage ? [categoryData.heroImage] : undefined,
      },
      alternates: {
        canonical: `/ameliyatli-estetik/${category}`,
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return {
      title: "Sayfa Bulunamadı",
    };
  }
}

// ✅ Database'den page data
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  try {
    const categoryData = await prisma.surgicalCategory.findFirst({
      where: {
        slug: category,
        locale: "tr",
        published: true,
        active: true,
      },
      include: {
        advantages: {
          where: { active: true },
          orderBy: { order: "asc" },
        },
        processSteps: {
          where: { active: true },
          orderBy: { order: "asc" },
        },
        faqs: {
          where: { active: true },
          orderBy: { order: "asc" },
        },
        features: {
          // ✅ YENİ
          where: { active: true },
          orderBy: { order: "asc" },
        },
        whyChooseItems: {
          // ✅ YENİ
          where: { active: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!categoryData) {
      return notFound();
    }

    return (
      <>
        <CategoryPageContent categoryData={categoryData} />
        <PhoneButton />
        <WhatsAppButton />
      </>
    );
  } catch (error) {
    console.error("Failed to fetch category data:", error);
    return notFound();
  }
}
