// components/CategoryComponent/CategoryPageContent.tsx
"use client";

import GallerySlider from "@/components/CategoryComponent/GallerySlider";
import { motion } from "framer-motion";
import {
    Award,
    Calendar,
    CheckCircle,
    Clock,
    Heart,
    MapPin,
    Phone,
    Shield,
    Star,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Motion variants (ESKİ - AYNEN KORUYORUZ)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const heroVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: 0.3,
    },
  },
};

const statsVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const statItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const featureVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const whyChooseVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
    },
  },
};

const whyChooseImageVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay: 0.3,
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.95,
  },
};

// ✅ Database types
interface Advantage {
  id: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  order: number;
  active: boolean;
}

interface ProcessStep {
  id: string;
  step: string;
  description: string;
  order: number;
  active: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  active: boolean;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
  order: number;
  active: boolean;
}

interface WhyChooseItem {
  id: string;
  text: string;
  order: number;
  active: boolean;
}

interface CategoryData {
  id: string;
  locale: string;
  slug: string;
  title: string;
  description?: string | null;
  heroImage?: string | null;
  clinicImage?: string | null;
  patientsCount: string;
  experienceYears: string;
  rating: string;
  galleryImages: string[];
  metaTitle?: string | null;
  seoContent?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  published: boolean;
  order: number;
  advantages: Advantage[];
  processSteps: ProcessStep[];
  faqs: FAQ[];
  features: Feature[];
  whyChooseItems: WhyChooseItem[];
}

interface CategoryPageContentProps {
  categoryData: CategoryData;
}

export default function CategoryPageContent({
  categoryData,
}: CategoryPageContentProps) {
  // ✅ Database'den gelen veriler
  const {
    title,
    description,
    heroImage,
    clinicImage,
    patientsCount,
    experienceYears,
    rating,
    galleryImages,
    seoContent,
    advantages,
    processSteps,
    faqs,
    features,
    whyChooseItems,
  } = categoryData;

  // ✅ Stats - Database'den dinamik
  const stats = [
    { icon: Users, value: patientsCount, label: "Mutlu Hasta" },
    { icon: Award, value: experienceYears, label: "Yıllık Deneyim" },
    { icon: Star, value: rating, label: "Hasta Puanı" },
    { icon: Shield, value: "100%", label: "Güvenlik" },
  ];

  // ✅ Features - Static (isterseniz database'e de ekleyebiliriz)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iconMap: Record<string, any> = {
    Zap,
    Heart,
    Clock,
    TrendingUp,
    Shield,
    Award,
    Star,
    CheckCircle,
  };

  const displayFeatures =
    features?.length > 0
      ? features.map((feature) => ({
          icon: iconMap[feature.icon || "Zap"] || Zap,
          title: feature.title,
          description: feature.description,
        }))
      : [
          // Fallback (eğer db'de yoksa)
          {
            icon: Zap,
            title: "Modern Teknoloji",
            description: "En son teknolojik cihazlar ve yöntemler",
          },
          {
            icon: Heart,
            title: "Hasta Odaklı",
            description: "Her hastanın özel ihtiyaçlarına göre planlama",
          },
          {
            icon: Clock,
            title: "Hızlı İyileşme",
            description: "Minimal invaziv yöntemlerle hızlı toparlanma",
          },
          {
            icon: TrendingUp,
            title: "Kanıtlanmış Sonuçlar",
            description: "Bilimsel araştırmalarla desteklenen yöntemler",
          },
        ];

  const defaultHeroImage = "/images/doctors-team.jpg";

  return (
    <>
      {/* Hero Section - ESKİ TASARIM */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container py-16 md:py-24 relative z-10">
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="flex-1 space-y-6" variants={heroVariants}>
              <motion.div
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
                variants={itemVariants}
              >
                <Award className="h-4 w-4" />
                Türkiye&apos;nin En İyi Estetik Kliniği
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl font-bold leading-tight"
                variants={itemVariants}
              >
                {title}
                <span className="block text-primary">Uzman Doktorlar</span>
              </motion.h1>

              <motion.p
                className="text-xl text-muted-foreground leading-relaxed"
                variants={itemVariants}
              >
                {description ||
                  `15+ yıllık deneyimimiz ve modern teknolojimizle ${title.toLowerCase()} konusunda Türkiye'nin lider kliniği olarak hizmet veriyoruz. Güvenli, etkili ve doğal sonuçlar için uzman ekibimizle tanışın.`}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    href="tel:+902121111111"
                    target="_blank"
                    className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg block"
                  >
                    <Phone className="h-5 w-5 inline mr-2" />
                    Ücretsiz Konsültasyon
                  </Link>
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    href="https://wa.me/905309153488"
                    target="_blank"
                    className="border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 block"
                  >
                    <Calendar className="h-5 w-5 inline mr-2" />
                    Randevu Al
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex-1 flex justify-center"
              variants={imageVariants}
            >
              <div className="relative">
                <Image
                  src={heroImage || defaultHeroImage}
                  alt={`${title} - Aura Clinic Uzman Doktorları`}
                  width={500}
                  height={400}
                  className="rounded-2xl shadow-2xl object-cover"
                  priority
                />
                <motion.div
                  className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{rating}</p>
                      <p className="text-sm text-muted-foreground">
                        Hasta Puanı
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - ESKİ TASARIM + DİNAMİK VERİ */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={statsVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                className="stats-card text-center"
                variants={statItemVariants}
              >
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section - ESKİ TASARIM */}
      <section className="py-16">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Neden Aura Clinic?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Türkiye&apos;nin en güvenilir estetik kliniği olarak, her
              hastamıza en yüksek kalitede hizmet sunuyoruz.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {displayFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                variants={featureVariants}
                whileHover={{ y: -5 }}
              >
                <div className="icon-container w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Section - ESKİ TASARIM + DİNAMİK VERİ */}
      {galleryImages && galleryImages.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {title} Galeri
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {title} operasyonlarımızdan örnekler ve sonuçlar
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <GallerySlider
                images={galleryImages}
                alt={`${title} - Aura Clinic Galeri`}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section - ESKİ TASARIM */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="space-y-6" variants={whyChooseVariants}>
              <h2 className="text-3xl md:text-4xl font-bold">
                {title} Konusunda Neden Bizi Seçmelisiniz?
              </h2>
              <p className="text-lg text-muted-foreground">
                Uzman doktorlarımız, modern teknolojimiz ve hasta odaklı
                yaklaşımımızla en güvenli ve etkili tedavi yöntemlerini
                uyguluyoruz.
              </p>

              <motion.div className="space-y-4" variants={containerVariants}>
                {(whyChooseItems?.length > 0
                  ? whyChooseItems
                  : [
                      { text: "Uzman ve deneyimli doktor kadrosu" },
                      { text: "Modern ve güvenli teknoloji" },
                      { text: "Kişiselleştirilmiş tedavi planları" },
                      { text: "Hızlı iyileşme süreçleri" },
                      { text: "Sürekli hasta takibi" },
                      { text: "Uygun fiyat garantisi" },
                    ]
                ).map((item) => (
                  <motion.div
                    key={item.text}
                    className="flex items-center gap-3"
                    variants={itemVariants}
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div className="relative" variants={whyChooseImageVariants}>
              <Image
                src={clinicImage || "/images/klinik-resimleri.jpeg"}
                alt="Aura Clinic Modern Klinik Ortamı"
                width={600}
                height={400}
                className="rounded-2xl shadow-xl object-cover"
              />
              <motion.div
                className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">İstanbul, Nişantaşı</p>
                    <p className="text-sm text-muted-foreground">
                      Merkezi Konum
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SEO Content Section - ESKİ TASARIM + DİNAMİK VERİ */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              {title} - Türkiye&apos;nin En İyi Estetik Kliniği
            </h1>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
                {title} Nedir?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {description ||
                  `${title}, modern tıbbi teknolojiler ve uzman doktor kadromuzla gerçekleştirilen güvenli ve etkili estetik cerrahi işlemlerinden biridir.`}
              </p>

              {/* Advantages - DİNAMİK */}
              {advantages && advantages.length > 0 && (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
                    {title} Avantajları
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {advantages.map((advantage) => (
                      <div
                        key={advantage.id}
                        className="bg-white rounded-xl p-6 shadow-lg"
                      >
                        <h3 className="text-xl font-semibold mb-3 text-foreground">
                          {advantage.title}
                        </h3>
                        {advantage.description && (
                          <p className="text-muted-foreground">
                            {advantage.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Process Steps - DİNAMİK */}
              {processSteps && processSteps.length > 0 && (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
                    {title} Süreci
                  </h2>
                  <div className="space-y-6 mb-8">
                    {processSteps.map((step, index) => (
                      <div key={step.id} className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {step.step}
                          </h3>
                          <p className="text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
                {title} Fiyatları
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {title} fiyatları, hastanın özel durumuna ve işlemin kapsamına
                göre değişiklik gösterebilir. Detaylı bilgi ve fiyat teklifi
                için ücretsiz konsültasyon randevusu alabilirsiniz.
              </p>

              <div className="bg-primary/10 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold mb-3 text-primary">
                  Neden Aura Clinic&apos;i Seçmelisiniz?
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    15+ yıllık deneyim ve uzman kadro
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Modern teknoloji ve güvenli ortam
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Kişiselleştirilmiş tedavi planları
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Sürekli hasta takibi ve destek
                  </li>
                </ul>
              </div>

              {/* FAQs - DİNAMİK */}
              {faqs && faqs.length > 0 && (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
                    {title} Hakkında Sık Sorulan Sorular
                  </h2>
                  <div className="space-y-4 mb-8">
                    {faqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="bg-white rounded-xl p-6 shadow-lg"
                      >
                        <h3 className="text-xl font-semibold mb-2 text-foreground">
                          {faq.question}
                        </h3>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ✅ YENİ: SEO Content Section */}
              {seoContent && (
                <div className="bg-gray-50 rounded-xl p-8 mb-8 border border-gray-200">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {seoContent}
                  </p>
                </div>
              )}

              {/* CTA */}
              <motion.div
                className="text-center bg-primary text-primary-foreground rounded-2xl p-8"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {title} İçin Hemen İletişime Geçin
                </h2>
                <p className="text-lg mb-6 opacity-90">
                  Uzman doktorlarımızla ücretsiz konsültasyon için hemen arayın
                  veya WhatsApp&apos;tan mesaj gönderin.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link
                      href="tel:+902121111111"
                      className="bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 block"
                    >
                      <Phone className="h-5 w-5 inline mr-2" />
                      Hemen Ara
                    </Link>
                  </motion.div>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link
                      href="https://wa.me/905309153488"
                      target="_blank"
                      className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300 block"
                    >
                      WhatsApp&apos;tan Mesaj
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
