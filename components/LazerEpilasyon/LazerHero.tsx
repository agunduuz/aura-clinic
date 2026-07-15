// components/LazerEpilasyon/LazerHero.tsx
"use client";

import { useLocale } from "@/lib/i18n/context";
import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface HeroData {
  heroTitle: string;
  heroTitleHighlight: string;
  heroDescription: string;
  heroButtonReviews: string;
  heroButtonPhone: string;
  heroImage: string;
  heroImageAlt: string;
}

const LazerHero = () => {
  const { locale } = useLocale();
  const [data, setData] = useState<HeroData | null>(null);
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
            heroTitle: result.heroTitle,
            heroTitleHighlight: result.heroTitleHighlight,
            heroDescription: result.heroDescription,
            heroButtonReviews: result.heroButtonReviews,
            heroButtonPhone: result.heroButtonPhone,
            heroImage: result.heroImage,
            heroImageAlt: result.heroImageAlt,
          });
          hasFetchedRef.current = true;
        }
      } catch (error) {
        console.error("Hero fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  if (loading || !data) {
    return (
      <section className="flex flex-col-reverse md:flex-row items-center gap-12 mb-16">
        <div className="flex-1 space-y-6 animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
          <div className="h-24 bg-gray-200 rounded w-full"></div>
          <div className="flex gap-4">
            <div className="h-12 bg-gray-200 rounded w-32"></div>
            <div className="h-12 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="flex-1 aspect-[4/3] bg-gray-200 rounded-2xl"></div>
      </section>
    );
  }

  return (
    <section className="flex flex-col-reverse md:flex-row items-center gap-12 mb-16">
      <div className="flex-1 space-y-6">
        <h1
          className="animate-title-slide-up"
          style={{ "--animation-delay": "200ms" } as React.CSSProperties}
        >
          {data.heroTitle}
          <span className="block text-primary mt-2">
            {data.heroTitleHighlight}
          </span>
        </h1>
        <p className="text-lg text-muted-foreground animate-fade-up">
          {data.heroDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-up">
          <Link
            href="https://www.google.com/search?sca_esv=6b19787a6a994d6b&sxsrf=AE3TifO7ziWVrPJR7-exDpI2Tc4SHaPgDg:1750273044954&q=lassarium+ni%C5%9Fanta%C5%9F%C4%B1&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E-lKDiz5ZMaKtR0Xzei2bM2K9BLcTk2LlwS4-SH1VUmb6Z4MtebRYz07tnCdFD-x2s953po%3D&uds=AOm0WdEAlSiTiojV6t08JvKtroEmny9Y3G9YSQidmqyrjkNTmw8Y6m2RTAum_iwvoDAao2eBv66DvL4E8-5RROD8YZlw107ephAqUuJc8s73RtQNXzX1-CtBWOu2ptMEq-8LI5cPc6kM&sa=X&ved=2ahUKEwjE3-qY0_uNAxVERfEDHf01CNwQ3PALegQIHhAE&biw=1728&bih=992&dpr=2"
            target="_blank"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold
                   shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {data.heroButtonReviews}
          </Link>
          <Link
            href="tel:+902121111111"
            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-semibold
                   shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Phone className="w-6 h-6" />
            {data.heroButtonPhone}
          </Link>
        </div>
      </div>
      <div className="flex-1 flex justify-center animate-float">
        <Image
          src={data.heroImage}
          alt={data.heroImageAlt}
          width={500}
          height={350}
          className="rounded-2xl shadow-2xl object-cover"
          priority
        />
      </div>
    </section>
  );
};

export default LazerHero;
