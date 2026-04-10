import { Truck, ShieldCheck, Award } from "lucide-react";

const items = [
  { icon: Truck, title: "Fast Shipping", desc: "Free delivery on orders over $50" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "Your data is always protected" },
  { icon: Award, title: "Quality Guarantee", desc: "Premium products, always" },
];

export function TrustSection() {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {items.map((item, i) => (
          <div
            key={item.title}
            className="flex flex-col items-center text-center gap-4 animate-fade-in"
            style={{ animationDelay: `${i * 120}ms`, animationFillMode: "both" }}
          >
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center">
              <item.icon className="h-6 w-6 text-neutral-500" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900 tracking-tight">{item.title}</h3>
            <p className="text-sm text-neutral-400 max-w-[240px]">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
