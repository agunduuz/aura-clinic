// components/SurgicalAesthetics/Hero.tsx
"use client";

import type { PageData } from "@/types/surgical-aesthetics";
import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  data: PageData;
}

export default function Hero({ data }: HeroProps) {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center gap-12 mb-16">
      {/* Left: Text Content */}
      <div className="flex-1 space-y-6">
        <h1
          className="animate-title-slide-up"
          style={
            {
              "--animation-delay": "200ms",
            } as React.CSSProperties
          }
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
            href="https://www.google.com/search?q=aura+clinic+yorumlar"
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

      {/* Right: Image */}
      <div className="flex-1 flex justify-center animate-float">
        <Image
          src={data.heroImage || "/images/doctors-team.jpg"}
          alt={data.heroImageAlt}
          width={500}
          height={350}
          className="rounded-2xl shadow-2xl object-cover"
          priority
        />
      </div>
    </section>
  );
}
