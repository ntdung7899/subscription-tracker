"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function LandingHeader() {
  const t = useTranslations("landing");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: t("nav.product"), href: "#features" },
    { label: t("nav.howItWorks"), href: "#how-it-works" },
    { label: t("nav.pricing"), href: "/pricing" },
    { label: t("nav.docs"), href: "/docs" },
  ];

  return (
    <header
      className={`fixed top-0 py-3 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-gray-200 bg-white/80 shadow-sm backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Left section - Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <span className="text-sm font-bold text-white">ST</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Subscription Tracker
              </span>
            </Link>
          </div>

          {/* Center navigation - Desktop only */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() =>
                  item.href.startsWith("#")
                    ? scrollToSection(item.href)
                    : (window.location.href = item.href)
                }
                className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right section - Actions */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="hidden text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white sm:block"
            >
              {t("nav.signIn")}
            </Link>
            <Link
              href="/signup"
              className="hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 sm:block"
            >
              {t("nav.getStarted")}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() =>
                    item.href.startsWith("#")
                      ? scrollToSection(item.href)
                      : (window.location.href = item.href)
                  }
                  className="text-left text-base font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t border-gray-200 pt-4 dark:border-gray-800" />
              <div className="pb-2">
                <LanguageSwitcher />
              </div>
              <Link
                href="/login"
                className="text-base font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.signIn")}
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-4 py-3 text-center text-base font-medium text-white transition-all hover:bg-blue-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.getStarted")}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
