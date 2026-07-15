// app/(routes)/en/surgical-aesthetics/page.tsx
import PhoneButton from "@/components/Header/PhoneButton";
import WhatsAppButton from "@/components/Header/WhatsAppButton";
import Hero from "@/components/SurgicalAesthetics/Hero";
import Features from "@/components/SurgicalAesthetics/Features";
import CategoriesIntro from "@/components/SurgicalAesthetics/CategoriesIntro";
import About from "@/components/SurgicalAesthetics/About";
import Process from "@/components/SurgicalAesthetics/Process";
import WhyUs from "@/components/SurgicalAesthetics/WhyUs";
import FAQ from "@/components/SurgicalAesthetics/FAQ";
import CTA from "@/components/SurgicalAesthetics/CTA";
import type { SurgicalAestheticsData } from "@/types/surgical-aesthetics";

// Fetch data from API
async function getSurgicalAestheticsData(
  locale: string = "en"
): Promise<SurgicalAestheticsData | null> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/procedures/ameliyatli-estetik?locale=${locale}`,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (!response.ok) {
      console.error(
        "Failed to fetch surgical aesthetics data:",
        response.status
      );
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching surgical aesthetics data:", error);
    return null;
  }
}

export default async function SurgicalAestheticsPage() {
  // Fetch data (Server Component)
  const data = await getSurgicalAestheticsData("en");

  // Fallback if data is null
  if (!data) {
    return (
      <main className="container py-12">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-destructive mb-4">
            Failed to Load Data
          </h1>
          <p className="text-muted-foreground">
            Please try again later or contact the administrator.
          </p>
        </div>
      </main>
    );
  }

  const {
    features = [],
    aboutSection = null,
    aboutAreas = [],
    aboutAdvantages = [],
    processSteps = [],
    whyUs = [],
    faqs = [],
    ...page
  } = data;

  return (
    <>
      <main className="container py-12">
        {/* Hero Section */}
        <Hero data={page} />

        {/* Main Features */}
        <Features features={features} />

        {/* Category Cards Intro */}
        <section id="categories" className="mb-16">
          <CategoriesIntro data={page} />
        </section>

        {/* Detailed Content */}
        <section className="max-w-6xl mx-auto space-y-12">
          {/* About Surgical Aesthetics */}
          {aboutSection && (
            <About
              aboutSection={aboutSection}
              areas={aboutAreas}
              advantages={aboutAdvantages}
            />
          )}

          {/* How It Works */}
          {processSteps.length > 0 && <Process steps={processSteps} />}

          {/* Why Choose Us */}
          {whyUs.length > 0 && (
            <WhyUs reasons={whyUs} title={page.whyUsTitle} />
          )}

          {/* FAQ */}
          {faqs.length > 0 && <FAQ faqs={faqs} title={page.faqTitle} />}

          {/* CTA */}
          <CTA data={page} />
        </section>
      </main>

      {/* Floating Buttons */}
      <PhoneButton />
      <WhatsAppButton />
    </>
  );
}

// Optional: Generate metadata dynamically
export async function generateMetadata() {
  const data = await getSurgicalAestheticsData("en");

  return {
    title: data?.heroTitle || "Surgical Aesthetics - Aura Clinic",
    description:
      data?.heroDescription ||
      "Safe surgical aesthetic procedures with our expert surgeons",
  };
}
