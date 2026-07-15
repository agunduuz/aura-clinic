// components/LazerEpilasyon/LazerCTA.tsx
"use client";

import { useLocale } from "@/lib/i18n/context";
import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface CTAData {
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonPhone: string;
  ctaButtonWhatsApp: string;
}

const LazerCTA = () => {
  const { locale } = useLocale();
  const [data, setData] = useState<CTAData | null>(null);
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
            ctaTitle: result.ctaTitle,
            ctaDescription: result.ctaDescription,
            ctaButtonPhone: result.ctaButtonPhone,
            ctaButtonWhatsApp: result.ctaButtonWhatsApp,
          });
          hasFetchedRef.current = true;
        }
      } catch (error) {
        console.error("CTA fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  if (loading || !data) {
    return (
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 shadow-lg border border-border animate-fade-in">
        <div className="animate-pulse text-center">
          <div className="h-10 bg-gray-200 rounded w-2/3 mx-auto mb-4"></div>
          <div className="h-20 bg-gray-200 rounded w-full mx-auto mb-8"></div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="h-14 bg-gray-200 rounded w-40"></div>
            <div className="h-14 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 shadow-lg border border-border animate-fade-in">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="mb-4">{data.ctaTitle}</h2>
        <p className="text-lg text-muted-foreground mb-8">
          {data.ctaDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="tel:+902121111111"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            {data.ctaButtonPhone}
          </Link>
          <Link
            href="https://wa.me/905321111111"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            {data.ctaButtonWhatsApp}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LazerCTA;
