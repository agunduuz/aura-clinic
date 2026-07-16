// components/Home/Procedures.tsx
"use client";

import { useTranslation, useLocale } from "@/lib/i18n/context";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";

type Procedure = {
  id: string;
  locale: string;
  slug?: string | null;
  title: string;
  description: string;
  imageUrl: string;
  category: "surgical" | "non-surgical";
  badge?: string | null;
  detailLink?: string | null;
  order: number;
};

interface ProceduresProps {
  data?: Procedure[] | null;
}

const Procedures = ({ data }: ProceduresProps) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const [procedures, setProcedures] = useState<Procedure[]>(data || []);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "surgical" | "non-surgical"
  >("all");
  const [loading, setLoading] = useState(!data);

  const fetchProcedures = useCallback(async () => {
    setLoading(true);
    try {
      const url =
        activeFilter === "all"
          ? `/api/homepage/procedures?locale=${locale}`
          : `/api/homepage/procedures?locale=${locale}&category=${activeFilter}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProcedures(data);
      }
    } catch (error) {
      console.error("Failed to load procedures:", error);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, locale]);

  // Skip the first client-side fetch when data was already provided by the server
  const skipInitialFetch = useRef(Boolean(data));

  useEffect(() => {
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }
    fetchProcedures();
  }, [fetchProcedures]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const filteredProcedures = procedures.filter(
    (proc) => activeFilter === "all" || proc.category === activeFilter
  );

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading procedures...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto px-4"
      >
        <div className="text-center mb-8 md:mb-12">
          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-4xl font-bold font-playfair mb-3 md:mb-4"
          >
            {t("home.procedures.title")}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base"
          >
            {t("home.procedures.subtitle")}
          </motion.p>
        </div>

        {/* Filter Buttons */}
        <motion.div
          variants={itemVariants}
          className="relative flex flex-col items-center mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent h-14 -z-10" />
          <div className="flex justify-center gap-2 p-1 bg-muted/30 backdrop-blur-sm rounded-full border border-primary/10 shadow-lg">
            {["all", "surgical", "non-surgical"].map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setActiveFilter(filter as typeof activeFilter)}
                className={`relative px-6 py-2.5 rounded-full transition-all duration-500 text-sm md:text-base
                  ${
                    activeFilter === filter
                      ? "text-primary-foreground"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
              >
                {activeFilter === filter && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-full shadow-md"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}
                <span className="relative z-10 font-medium">
                  {filter === "all"
                    ? t("home.procedures.filterAll")
                    : filter === "surgical"
                    ? t("home.procedures.filterSurgical")
                    : t("home.procedures.filterNonSurgical")}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Procedures Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence mode="wait">
            {filteredProcedures.map((procedure) => (
              <motion.div
                key={procedure.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="group relative bg-background rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 sm:h-56 md:h-64">
                  <Image
                    src={procedure.imageUrl}
                    alt={procedure.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  />
                  {procedure.badge && (
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                          procedure.category === "surgical"
                            ? "bg-accent/90 text-accent-foreground"
                            : "bg-secondary/90 text-secondary-foreground"
                        }`}
                      >
                        {procedure.badge}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold font-playfair mb-2">
                    {procedure.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {procedure.description}
                  </p>
                  {procedure.slug && (
                    <Link
                      href={`/${
                        locale === "en"
                          ? "en/surgical-aesthetics"
                          : "ameliyatli-estetik"
                      }/${procedure.slug}`}
                      className="text-primary font-medium group-hover:text-primary/80 
               transition-colors flex items-center gap-2 text-sm md:text-base"
                    >
                      {t("home.procedures.learnMore")}
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          variants={itemVariants}
          className="text-center mt-8 md:mt-12"
        >
          <button
            className="bg-primary text-primary-foreground px-6 md:px-8 py-2.5 md:py-3 rounded-md 
                           hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl 
                           transform duration-200 text-sm md:text-base"
          >
            {t("home.procedures.viewAll")}
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Procedures;
