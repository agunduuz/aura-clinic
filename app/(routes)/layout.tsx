// app/(routes)/layout.tsx
import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://aura-clinic-six.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    icon: [
      { url: "/aura-logo.ico", sizes: "any" },
      { url: "/aura-logo.svg", type: "image/svg+xml" },
    ],
    apple: [
      {
        url: "/aura-logo.ico",
        sizes: "180x180",
        type: "image/x-icon",
      },
    ],
    shortcut: "/aura-logo.ico",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Aura Clinic",
    title: "Aura Clinic - Estetik ve Plastik Cerrahi Merkezi",
    description:
      "İstanbul'da estetik ve plastik cerrahi alanında uzmanlaşmış Aura Clinic. Saç ekimi, lazer epilasyon, ameliyatlı estetik ve daha fazlası için güvenilir çözümler.",
    locale: "tr_TR",
    images: [
      {
        url: "/images/aura-clinic-og.jpg",
        width: 1200,
        height: 630,
        alt: "Aura Clinic - Estetik ve Plastik Cerrahi Merkezi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura Clinic - Estetik ve Plastik Cerrahi Merkezi",
    description:
      "İstanbul'da estetik ve plastik cerrahi alanında uzmanlaşmış Aura Clinic.",
    images: ["/images/aura-clinic-og.jpg"],
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Header ve Footer render etme, sadece children
  return <div className="min-h-screen">{children}</div>;
}
