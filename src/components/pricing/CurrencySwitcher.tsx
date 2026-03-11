import { useCurrency } from "@/contexts/CurrencyContext";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-muted/50 p-0.5 text-sm">
      <button
        onClick={() => setCurrency("EUR")}
        className={`rounded-full px-3 py-1 font-medium transition-colors ${
          currency === "EUR"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        € EUR
      </button>
      <button
        onClick={() => setCurrency("USD")}
        className={`rounded-full px-3 py-1 font-medium transition-colors ${
          currency === "USD"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        $ USD
      </button>
    </div>
  );
}
