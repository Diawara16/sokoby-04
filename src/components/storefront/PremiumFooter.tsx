import { ShoppingBag } from "lucide-react";

interface PremiumFooterProps {
  storeName: string | null;
}

export function PremiumFooter({ storeName }: PremiumFooterProps) {
  const name = storeName || "Ma Boutique";

  return (
    <footer className="bg-[#111] text-white py-16 px-6 mt-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="h-5 w-5 text-white/70" />
              <span className="text-lg font-bold tracking-tight">{name}</span>
            </div>
            <p className="text-sm text-white/40 max-w-[280px] leading-relaxed">
              Premium products crafted for modern lifestyle. Quality you can trust.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50">Quick Links</h4>
            <nav className="flex flex-col gap-2.5">
              {["Shop", "Products", "About", "Contact"].map((l) => (
                <a key={l} href="#" className="text-sm text-white/60 hover:text-white transition-colors duration-300">{l}</a>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50">Support</h4>
            <nav className="flex flex-col gap-2.5">
              {["FAQ", "Shipping", "Returns", "Privacy Policy"].map((l) => (
                <a key={l} href="#" className="text-sm text-white/60 hover:text-white transition-colors duration-300">{l}</a>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
