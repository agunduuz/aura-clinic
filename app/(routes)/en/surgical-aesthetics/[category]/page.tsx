// app/(routes)/en/surgical-aesthetics/[category]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CategoryPageContent from "@/components/CategoryComponent/CategoryPageContent";
import PhoneButton from "@/components/Header/PhoneButton";
import WhatsAppButton from "@/components/Header/WhatsAppButton";
import { prisma } from "@/lib/prisma";

export async function generateStaticParams() {
  try {
    const categories = await prisma.surgicalCategory.findMany({
      where: {
        locale: "en",
        published: true,
        active: true,
      },
      select: {
        slug: true,
      },
    });

    return categories.map((cat) => ({
      category: cat.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

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
        locale: "en",
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
        title: "Page Not Found",
      };
    }

    const title =
      categoryData.metaTitle ||
      `${categoryData.title} | Turkey's Best Aesthetic Clinic | Aura Clinic`;
    const description =
      categoryData.metaDescription ||
      `${categoryData.title} - Turkey's leading aesthetic clinic. 15+ years of experience, expert doctors, modern technology. Call now for free consultation!`;

    return {
      title,
      description,
      keywords: categoryData.metaKeywords || undefined,
      openGraph: {
        title,
        description,
        type: "website",
        locale: "en_US",
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
        canonical: `https://auraclinic.com/en/surgical-aesthetics/${category}`,
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return {
      title: "Page Not Found",
    };
  }
}

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
        locale: "en",
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
