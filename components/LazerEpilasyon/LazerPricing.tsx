// components/LazerEpilasyon/LazerPricing.tsx
"use client";

import { useLocale } from "@/lib/i18n/context";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// ✅ Type tanımı
interface ColorScheme {
  bg: string;
  border: string;
  text: string;
  button: string;
}

interface PricingData {
  pricingTitle: string;
  pricingDescription: string;
  pricingCallText: string;
  packages: Array<{
    id: string;
    title: string;
    description: string;
    priceText: string;
    colorScheme: string;
    order: number;
  }>;
}

const LazerPricing = () => {
  const { locale } = useLocale();
  const [data, setData] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (hasFetchedRef.current) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/procedures/lazer-epilasyon?locale=${locale}`
        );
        if (res.ok) {
          const result = await res.json();
          setData({
            pricingTitle: result.pricingTitle,
            pricingDescription: result.pricingDescription,
            pricingCallText: result.pricingCallText,
            packages: result.pricing || [],
          });
          hasFetchedRef.current = true;
        }
      } catch (error) {
        console.error("Pricing fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  // Color scheme mapper
  const getColorClasses = (colorScheme: string): ColorScheme => {
    const schemes: Record<string, ColorScheme> = {
      primary: {
        bg: "bg-gradient-to-br from-primary/10 to-primary/5",
        border: "border-primary/30",
        text: "text-primary",
        button: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      secondary: {
        bg: "bg-gradient-to-br from-secondary/10 to-secondary/5",
        border: "border-secondary/30",
        text: "text-secondary-foreground",
        button: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      },
      accent: {
        bg: "bg-gradient-to-br from-accent/10 to-accent/5",
        border: "border-accent/30",
        text: "text-accent-foreground",
        button: "bg-accent text-accent-foreground hover:bg-accent/90",
      },
    };
    return schemes[colorScheme] || schemes.primary;
  };

  if (loading || !data) {
    return (
      <div className="bg-card rounded-2xl p-8 shadow-lg border border-border animate-fade-in mb-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-16 bg-gray-200 rounded mb-8"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.packages.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-2xl p-8 shadow-lg border border-border animate-fade-in mb-12">
      <h2 className="mb-6">{data.pricingTitle}</h2>
      <p className="text-muted-foreground mb-8">{data.pricingDescription}</p>
      <div className="grid md:grid-cols-3 gap-6">
        {data.packages.map((pkg) => {
          const colors = getColorClasses(pkg.colorScheme);

          return (
            <div
              key={pkg.id}
              className={`${colors.bg} p-6 rounded-xl border-2 ${colors.border} hover:shadow-lg transition-all duration-300`}
            >
              <h3 className={`text-2xl font-bold mb-3 ${colors.text}`}>
                {pkg.title}
              </h3>
              <p className="text-muted-foreground mb-4 min-h-[3rem]">
                {pkg.description}
              </p>
              <div className="mb-6">
                <p className={`text-3xl font-bold ${colors.text}`}>
                  {pkg.priceText}
                </p>
              </div>
              <Link
                href="tel:+902121111111"
                className={`block text-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${colors.button}`}
              >
                {data.pricingCallText}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LazerPricing;
