// components/CategoryComponent/EnglishCategoryPageContent.tsx
"use client";

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
import GallerySlider from "./GallerySlider";

// Motion variants
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

interface OperationInfo {
  title?: string;
  description?: string;
  advantages?: string[];
  process?: Array<{
    step: string;
    description: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  image?: string;
  images?: string[];
}

interface EnglishCategoryPageContentProps {
  operationInfo: OperationInfo | undefined;
}

export default function EnglishCategoryPageContent({
  operationInfo,
}: EnglishCategoryPageContentProps) {
  const pageTitle = operationInfo?.title || "Aesthetic Operation";
  const stats = [
    { icon: Users, value: "15,000+", label: "Happy Patients" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: Star, value: "4.9/5", label: "Patient Rating" },
    { icon: Shield, value: "100%", label: "Safety" },
  ];

  const features = [
    {
      icon: Zap,
      title: "Modern Technology",
      description: "Latest technological devices and methods",
    },
    {
      icon: Heart,
      title: "Patient-Focused",
      description: "Planning according to each patient's special needs",
    },
    {
      icon: Clock,
      title: "Quick Recovery",
      description: "Fast recovery with minimal invasive methods",
    },
    {
      icon: TrendingUp,
      title: "Proven Results",
      description: "Methods supported by scientific research",
    },
  ];

  return (
    <>
      {/* Hero Section */}
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
                Turkey&apos;s Best Aesthetic Clinic
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl font-bold leading-tight"
                variants={itemVariants}
              >
                {pageTitle}
                <span className="block text-primary">Expert Doctors</span>
              </motion.h1>

              <motion.p
                className="text-xl text-muted-foreground leading-relaxed"
                variants={itemVariants}
              >
                With 15+ years of experience and modern technology, we serve as
                Turkey&apos;s leading clinic in {pageTitle.toLowerCase()}. Meet
                our expert team for safe, effective and natural results.
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
                    Free Consultation
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
                    Book Appointment
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
                  src={operationInfo?.image || "/images/doctors-team.jpg"}
                  alt={`${pageTitle} - Aura Clinic Expert Doctors`}
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
                      <p className="font-bold text-lg">4.9/5</p>
                      <p className="text-sm text-muted-foreground">
                        Patient Rating
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Features Section */}
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
              Why Choose Aura Clinic?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              As Turkey&apos;s most reliable aesthetic clinic, we provide the
              highest quality service to each of our patients.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
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

      {/* Gallery Section */}
      {operationInfo?.images && operationInfo.images.length > 0 && (
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
                {pageTitle} Gallery
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Examples and results from our {pageTitle} operations
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <GallerySlider
                images={operationInfo.images}
                alt={`${pageTitle} - Aura Clinic Gallery`}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
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
                Why Should You Choose Us for {pageTitle}?
              </h2>
              <p className="text-lg text-muted-foreground">
                We apply the safest and most effective treatment methods with
                our expert doctors, modern technology and patient-focused
                approach.
              </p>

              <motion.div className="space-y-4" variants={containerVariants}>
                {[
                  "Expert and experienced doctor staff",
                  "Modern and safe technology",
                  "Personalized treatment plans",
                  "Quick recovery processes",
                  "Continuous patient follow-up",
                  "Affordable price guarantee",
                ].map((item) => (
                  <motion.div
                    key={item}
                    className="flex items-center gap-3"
                    variants={itemVariants}
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div className="relative" variants={whyChooseImageVariants}>
              <Image
                src="/images/klinik-resimleri.jpeg"
                alt="Aura Clinic Modern Clinic Environment"
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
                    <p className="font-semibold">Istanbul, Nisantasi</p>
                    <p className="text-sm text-muted-foreground">
                      Central Location
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SEO Content Section */}
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
              {pageTitle} - Turkey&apos;s Best Aesthetic Clinic
            </h1>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
                What is {pageTitle}?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {operationInfo?.description ||
                  `${pageTitle} is one of the safe and effective aesthetic surgical procedures performed with modern medical technologies and our expert doctor staff. With 15+ years of experience, we prepare personalized treatment plans according to each patient\'s special needs.`}
              </p>

              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
                {pageTitle} Advantages
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {operationInfo?.advantages?.map((advantage: string) => (
                  <div
                    key={advantage}
                    className="bg-white rounded-xl p-6 shadow-lg"
                  >
                    <h3 className="text-xl font-semibold mb-3 text-foreground">
                      {advantage}
                    </h3>
                    <p className="text-muted-foreground">
                      This is one of the important benefits achieved with{" "}
                      {pageTitle}.
                    </p>
                  </div>
                )) || [
                  <div key="1" className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-3 text-foreground">
                      Safe Technology
                    </h3>
                    <p className="text-muted-foreground">
                      Safe operations with latest technological devices and
                      minimal invasive methods.
                    </p>
                  </div>,
                  <div key="2" className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-3 text-foreground">
                      Expert Doctors
                    </h3>
                    <p className="text-muted-foreground">
                      Professional service with expert and experienced surgeons
                      in their field.
                    </p>
                  </div>,
                ]}
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
                {pageTitle} Process
              </h2>
              <div className="space-y-6 mb-8">
                {operationInfo?.process?.map(
                  (step: { step: string; description: string }) => (
                    <div key={step.step} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
                        1
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
                  )
                ) || [
                  <div key="1" className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Initial Consultation
                      </h3>
                      <p className="text-muted-foreground">
                        Detailed meeting with our expert doctor and preparation
                        of personalized treatment plan.
                      </p>
                    </div>
                  </div>,
                ]}
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
                {pageTitle} Prices
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {pageTitle} prices may vary depending on the patient&apos;s
                special condition and the scope of the procedure. You can make a
                free consultation appointment for detailed information and price
                offer.
              </p>

              <div className="bg-primary/10 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold mb-3 text-primary">
                  Why Should You Choose Aura Clinic?
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    15+ years of experience and expert staff
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Modern technology and safe environment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Personalized treatment plans
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Continuous patient follow-up and support
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
                Frequently Asked Questions About {pageTitle}
              </h2>
              <div className="space-y-4 mb-8">
                {operationInfo?.faqs?.map(
                  (faq: { question: string; answer: string }) => (
                    <div
                      key={faq.question}
                      className="bg-white rounded-xl p-6 shadow-lg"
                    >
                      <h3 className="text-xl font-semibold mb-2 text-foreground">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  )
                ) || [
                  <div key="1" className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      How long does {pageTitle} take?
                    </h3>
                    <p className="text-muted-foreground">
                      Surgery duration varies between 1-3 hours depending on the
                      patient&apos;s condition.
                    </p>
                  </div>,
                ]}
              </div>

              <motion.div
                className="text-center bg-primary text-primary-foreground rounded-2xl p-8"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Contact Us Now for {pageTitle}
                </h2>
                <p className="text-lg mb-6 opacity-90">
                  Call now or send a message via WhatsApp for free consultation
                  with our expert doctors.
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
                      Call Now
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
                      Message via WhatsApp
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
