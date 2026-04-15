import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Crown, Zap, Rocket, Gift, Loader2 } from "lucide-react";
import { useStoreSubscription, Plan } from "@/hooks/useStoreSubscription";

interface StorePlanSelectorProps {
  storeId: string | null;
}

const planIcons: Record<string, React.ReactNode> = {
  free: <Gift className="h-6 w-6" />,
  basic: <Zap className="h-6 w-6" />,
  pro: <Rocket className="h-6 w-6" />,
  business: <Crown className="h-6 w-6" />,
};

const planColors: Record<string, string> = {
  free: "border-muted",
  basic: "border-blue-300",
  pro: "border-primary ring-2 ring-primary/20",
  business: "border-amber-400",
};

const featureLabels: Record<string, string> = {
  products_limit: "Produits",
  domains_allowed: "Domaines",
  staff_accounts: "Membres d'équipe",
  analytics_access: "Analytics",
  custom_domain: "Domaine personnalisé",
  remove_branding: "Supprimer la marque Sokoby",
  advanced_analytics: "Analytics avancés",
  multiple_domains: "Multi-domaines",
};

export const StorePlanSelector = ({ storeId }: StorePlanSelectorProps) => {
  const { plans, subscription, isLoading, isCheckingOut, selectPlan } = useStoreSubscription(storeId);
  const [isYearly, setIsYearly] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currentPlanId = subscription?.plan_id;

  const formatLimit = (value: any): string => {
    if (typeof value === "boolean") return value ? "✓" : "✗";
    if (value === -1) return "Illimité";
    return String(value);
  };

  return (
    <div className="space-y-6">
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
          Mensuel
        </span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
        <span className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
          Annuel
        </span>
        {isYearly && (
          <Badge variant="secondary" className="text-xs">
            Économisez ~17%
          </Badge>
        )}
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const price = isYearly ? plan.price_yearly : plan.price_monthly;
          const features = plan.feature_limits as Record<string, any>;

          return (
            <Card
              key={plan.id}
              className={`relative transition-all ${planColors[plan.slug] || "border-muted"} ${
                plan.slug === "pro" ? "scale-[1.02]" : ""
              }`}
            >
              {plan.slug === "pro" && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Populaire
                </Badge>
              )}

              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-2 text-primary">
                  {planIcons[plan.slug] || <Zap className="h-6 w-6" />}
                </div>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price */}
                <div className="text-center">
                  <span className="text-3xl font-bold">
                    {price === 0 ? "Gratuit" : `${price}€`}
                  </span>
                  {price > 0 && (
                    <span className="text-sm text-muted-foreground">
                      /{isYearly ? "an" : "mois"}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 text-sm">
                  {Object.entries(featureLabels).map(([key, label]) => {
                    const value = features[key];
                    const enabled = typeof value === "boolean" ? value : value !== 0;

                    return (
                      <li key={key} className="flex items-center gap-2">
                        <Check
                          className={`h-4 w-4 flex-shrink-0 ${
                            enabled ? "text-green-500" : "text-muted-foreground/30"
                          }`}
                        />
                        <span className={enabled ? "" : "text-muted-foreground/50"}>
                          {label}: {formatLimit(value)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {/* CTA */}
                <Button
                  className="w-full"
                  variant={isCurrent ? "outline" : plan.slug === "pro" ? "default" : "outline"}
                  disabled={isCurrent || isCheckingOut}
                  onClick={() => selectPlan(plan.id, isYearly ? "yearly" : "monthly")}
                >
                  {isCheckingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {isCurrent ? "Plan actuel" : price === 0 ? "Commencer gratuitement" : "Choisir ce plan"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
