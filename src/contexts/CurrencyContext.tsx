import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Currency = "EUR" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  symbol: string;
  formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

function detectEuropeanRegion(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const lang = navigator.language || "";
    const europeanTimezones = ["Europe/"];
    const europeanLangs = ["fr", "de", "es", "it", "pt", "nl", "pl", "ro", "el", "cs", "hu", "sv", "da", "fi", "sk", "bg", "hr", "lt", "lv", "et", "sl", "mt", "ga"];
    
    if (europeanTimezones.some(prefix => tz.startsWith(prefix))) return true;
    if (europeanLangs.some(l => lang.startsWith(l))) return true;
    return false;
  } catch {
    return false;
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem("sokoby-currency");
    if (saved === "EUR" || saved === "USD") return saved;
    return detectEuropeanRegion() ? "EUR" : "USD";
  });

  useEffect(() => {
    localStorage.setItem("sokoby-currency", currency);
  }, [currency]);

  const symbol = currency === "EUR" ? "€" : "$";

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(currency === "EUR" ? "fr-FR" : "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, symbol, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
