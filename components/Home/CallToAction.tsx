// components/Home/CallToAction.tsx
"use client";

import { useTranslation } from "@/lib/i18n/context";
import { CTAData } from "@/lib/homepage";
import Link from "next/link";

interface CallToActionProps {
  data?: CTAData | null;
}

const CallToAction = ({ data }: CallToActionProps) => {
  const { t } = useTranslation();

  // Fallback values
  const title = data?.title || t("home.cta.title");
  const description = data?.description || t("home.cta.description");
  const button1Text = data?.button1Text || t("home.cta.button");
  const button1Link = data?.button1Link || "/iletisim";
  const button2Text = data?.button2Text || t("home.cta.buttonSecondary");
  const button2Link = data?.button2Link || "/iletisim";

  return (
    <section className="relative py-16 bg-primary/70 overflow-hidden">
      {/* Soft background circles */}
      <div className="absolute left-8 top-8 w-40 h-40 bg-primary/30 rounded-full z-0" />
      <div className="absolute right-0 top-0 w-72 h-72 bg-primary/30 rounded-full z-0" />
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        {/* TITLE FROM DATABASE */}
        <h2 className="text-2xl md:text-4xl font-bold font-playfair mb-4 text-foreground">
          {title}
        </h2>
        {/* DESCRIPTION FROM DATABASE */}
        <p className="text-base md:text-lg text-foreground mb-8 max-w-2xl">
          {description}
        </p>
        {/* BUTTONS FROM DATABASE */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={button1Link}
            className="bg-background text-primary font-semibold px-8 py-3 rounded-md shadow hover:bg-primary/90 hover:text-background transition-colors border border-transparent"
          >
            {button1Text}
          </Link>
          <Link
            href={button2Link}
            className="bg-transparent text-foreground font-semibold px-8 py-3 rounded-md border border-foreground/40 hover:bg-background/60 transition-colors"
          >
            {button2Text}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
