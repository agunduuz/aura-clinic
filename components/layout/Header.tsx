// components/layout/Header.tsx
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ThemeSwitcher } from "@/components/Header/ThemeSwitcher";
import LanguageSwitcher from "@/components/Header/LanguageSwitcher";
import { DynamicNavigation } from "@/components/Header/DynamicNavigation";
import { Menu, X } from "lucide-react";
import { useLocale } from "@/lib/i18n/context";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale } = useLocale();

  // Mobil menü açıldığında scroll'u engelle
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [isMenuOpen]);

  const homeHref = locale === "en" ? "/en" : "/";

  return (
    <header className="pt-4 pb-4 bg-background">
      <div className="container">
        <nav className="flex justify-between items-center">
          <Link
            href={homeHref}
            className="logo font-playfair text-2xl font-semibold tracking-tight text-foreground"
          >
            Aura <span className="text-primary-dark">Clinic</span>
          </Link>

          {/* Desktop Navigation - DİNAMİK */}
          <div className="hidden md:block">
            <DynamicNavigation />
          </div>

          {/* Kontroller (Theme + Dil) */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-muted transition-colors duration-200 z-30"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu - DİNAMİK */}
        <div
          className={`fixed inset-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 z-20 transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden overflow-y-auto`}
        >
          <div className="flex flex-col h-full px-6 pt-16">
            <div className="mobile-navigation">
              <DynamicNavigation
                isMobile={true}
                onNavigate={() => setIsMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
