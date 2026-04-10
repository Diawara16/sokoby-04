import React, { useEffect, useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PremiumNavbarProps {
  storeName: string | null;
}

export function PremiumNavbar({ storeName }: PremiumNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-sm border-b border-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <ShoppingBag className={`h-5 w-5 transition-colors duration-500 ${scrolled ? "text-black" : "text-white"}`} />
          <span
            className={`text-lg font-bold tracking-tight transition-colors duration-500 ${
              scrolled ? "text-black" : "text-white"
            }`}
          >
            {storeName || "Ma Boutique"}
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {["Shop", "Products"].map((label) => (
            <a
              key={label}
              href={label === "Shop" ? "#featured-products" : "#all-products"}
              className={`text-sm font-medium transition-colors duration-500 hover:opacity-70 ${
                scrolled ? "text-black" : "text-white"
              }`}
            >
              {label}
            </a>
          ))}
          <Link to="/tableau-de-bord">
            <Button
              variant="outline"
              size="sm"
              className={`transition-all duration-500 ${
                scrolled
                  ? "border-black/20 text-black hover:bg-black hover:text-white"
                  : "border-white/30 text-white hover:bg-white hover:text-black"
              }`}
            >
              Gérer
            </Button>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className={`md:hidden transition-colors duration-500 ${scrolled ? "text-black" : "text-white"}`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-black/5 animate-fade-in">
          <div className="px-6 py-6 flex flex-col gap-4">
            <a href="#featured-products" onClick={() => setMobileOpen(false)} className="text-black font-medium text-base">Shop</a>
            <a href="#all-products" onClick={() => setMobileOpen(false)} className="text-black font-medium text-base">Products</a>
            <Link to="/tableau-de-bord" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" size="sm" className="w-full border-black/20 text-black">Gérer</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
