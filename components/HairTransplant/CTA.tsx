// components/HairTransplant/CTA.tsx
"use client";

import { Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CTAData {
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonPhone: string;
  ctaButtonWhatsApp: string;
}

interface CTAProps {
  locale: string;
}

export default function CTA({ locale }: CTAProps) {
  const [data, setData] = useState<CTAData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/procedures/sac-ekimi?locale=${locale}`);
        if (res.ok) {
          const result = await res.json();
          setData({
            ctaTitle: result.ctaTitle,
            ctaDescription: result.ctaDescription,
            ctaButtonPhone: result.ctaButtonPhone,
            ctaButtonWhatsApp: result.ctaButtonWhatsApp,
          });
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
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-center text-primary-foreground animate-fade-in">
      <h2 className="mb-4">{data.ctaTitle}</h2>
      <p className="text-lg mb-8 opacity-90">{data.ctaDescription}</p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="tel:+902121111111"
          className="flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
        >
          <Phone className="w-6 h-6" />
          {data.ctaButtonPhone}
        </Link>

        <Link
          href="https://wa.me/905309153488"
          target="_blank"
          className="flex items-center gap-2 bg-green-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
          {data.ctaButtonWhatsApp}
        </Link>
      </div>
    </div>
  );
}
