// app/layout.tsx - GÜNCELLENMİŞ
import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://auraclinic.com"),
  title: {
    default: "Aura Clinic - Estetik ve Plastik Cerrahi Merkezi",
    template: "%s | Aura Clinic",
  },
  description:
    "İstanbul'da estetik ve plastik cerrahi alanında uzmanlaşmış Aura Clinic. Saç ekimi, lazer epilasyon, ameliyatlı estetik ve daha fazlası için güvenilir çözümler.",
  keywords: [
    "Aura Clinic",
    "İstanbul estetik",
    "plastik cerrahi",
    "saç ekimi",
    "lazer epilasyon",
    "ameliyatlı estetik",
    "burun estetiği",
    "göz estetiği",
    "meme estetiği",
    "liposuction",
    "dermatoloji",
    "estetik cerrahi",
  ],
  authors: [{ name: "Aura Clinic" }],
  creator: "Aura Clinic",
  publisher: "Aura Clinic",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      tr: "/",
      en: "/en",
    },
  },
  icons: {
    icon: [{ url: "/aura-logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/aura-logo.svg", type: "image/svg+xml" }],
    shortcut: "/aura-logo.svg",
  },
  openGraph: {
    type: "website",
    url: "https://auraclinic.com",
    siteName: "Aura Clinic",
    title: "Aura Clinic - Estetik ve Plastik Cerrahi Merkezi",
    description:
      "İstanbul'da estetik ve plastik cerrahi alanında uzmanlaşmış Aura Clinic. Saç ekimi, lazer epilasyon, ameliyatlı estetik ve daha fazlası için güvenilir çözümler.",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura Clinic - Estetik ve Plastik Cerrahi Merkezi",
    description:
      "İstanbul'da estetik ve plastik cerrahi alanında uzmanlaşmış Aura Clinic.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased`}
      >
        <I18nProvider translations={translations}>
          <ConditionalLayout>{children}</ConditionalLayout>
        </I18nProvider>
      </body>
    </html>
  );
}
