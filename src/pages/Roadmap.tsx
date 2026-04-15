import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Rocket, Zap, TrendingUp, Video, Target, Clock, ShoppingCart,
  BarChart3, Sparkles, Bot, Megaphone, Play, ArrowRight, CheckCircle2,
  Circle, Timer
} from "lucide-react";

const phases = [
  {
    id: 1,
    title: "Phase 1 — Fondations IA",
    status: "active" as const,
    progress: 75,
    color: "hsl(var(--primary))",
    items: [
      { label: "Création de boutique IA en 1 clic", done: true },
      { label: "Sélection de niche automatique", done: true },
      { label: "Branding IA (logo, couleurs, slogan)", done: true },
      { label: "Injection automatique de produits", done: false },
    ],
  },
  {
    id: 2,
    title: "Phase 2 — Moteur Produits Gagnants",
    status: "upcoming" as const,
    progress: 10,
    color: "hsl(262 83% 58%)",
    items: [
      { label: "Détection de tendances en temps réel", done: false },
      { label: "Matching fournisseurs automatique", done: false },
      { label: "Injection produit gagnant en 1 clic", done: false },
      { label: "Score de potentiel par produit", done: false },
    ],
  },
  {
    id: 3,
    title: "Phase 3 — Marketing & Contenu IA",
    status: "planned" as const,
    progress: 0,
    color: "hsl(199 89% 48%)",
    items: [
      { label: "Génération de publicités TikTok", done: false },
      { label: "Copywriting Facebook Ads", done: false },
      { label: "Vidéos produit UGC automatiques", done: false },
      { label: "Posts réseaux sociaux automatisés", done: false },
    ],
  },
];

const kpis = [
  { label: "Temps moyen — 1ère boutique", value: "< 5 min", icon: Clock, trend: "-40%" },
  { label: "Temps moyen — 1er produit", value: "< 2 min", icon: ShoppingCart, trend: "-60%" },
  { label: "Temps moyen — 1ère vente", value: "< 48h", icon: TrendingUp, trend: "objectif" },
  { label: "Conversion par niche", value: "3.2%", icon: BarChart3, trend: "+0.8%" },
];

const featureGroups = [
  {
    title: "Création de Boutique IA",
    icon: Bot,
    description: "Boutique complète générée en moins de 5 minutes",
    features: ["Niche intelligente", "Branding auto", "Produits injectés", "Thème premium"],
    gradient: "from-primary/10 to-primary/5",
    iconColor: "text-primary",
  },
  {
    title: "Moteur Produits Gagnants",
    icon: Sparkles,
    description: "Trouvez et vendez les meilleurs produits automatiquement",
    features: ["Tendances IA", "Score potentiel", "Matching fournisseur", "Import 1-clic"],
    gradient: "from-purple-500/10 to-purple-500/5",
    iconColor: "text-purple-500",
  },
  {
    title: "Marketing Automatisé",
    icon: Megaphone,
    description: "Publicités et contenu générés par l'IA",
    features: ["TikTok Ads", "Facebook copy", "Descriptions produit", "Hooks viraux"],
    gradient: "from-sky-500/10 to-sky-500/5",
    iconColor: "text-sky-500",
  },
  {
    title: "Contenu & Vidéo IA",
    icon: Video,
    description: "Vidéos UGC et contenu social sans effort",
    features: ["Vidéo produit", "Posts sociaux", "Reels/Shorts", "Visuels auto"],
    gradient: "from-amber-500/10 to-amber-500/5",
    iconColor: "text-amber-500",
  },
];

const statusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500/15 text-green-600 border-green-500/30 hover:bg-green-500/20">En cours</Badge>;
    case "upcoming":
      return <Badge className="bg-purple-500/15 text-purple-600 border-purple-500/30 hover:bg-purple-500/20">Bientôt</Badge>;
    default:
      return <Badge variant="outline" className="text-muted-foreground">Planifié</Badge>;
  }
};

export default function Roadmap() {
  return (
    <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-10 max-w-7xl">
      <Helmet>
        <title>Roadmap Produit | Sokoby</title>
        <meta name="description" content="Découvrez la feuille de route IA de Sokoby : le moyen le plus rapide de gagner de l'argent en ligne avec le e-commerce IA." />
      </Helmet>

      {/* Hero */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
          <Rocket className="h-4 w-4" />
          Roadmap Produit 2026
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
          Le moyen le plus rapide de{" "}
          <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            gagner de l'argent en ligne
          </span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
          E-commerce IA — de la création à la première vente, entièrement automatisé.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary">
          <Zap className="h-4 w-4" />
          Commencez gratuitement — payez quand vous vendez
        </div>
      </div>

      {/* KPI Dashboard */}
      <section className="mb-10 sm:mb-14">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Métriques de succès
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="relative overflow-hidden">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">{kpi.label}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight">{kpi.value}</p>
                <span className="text-xs font-medium text-green-600 mt-1 inline-block">{kpi.trend}</span>
              </CardContent>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
            </Card>
          ))}
        </div>
      </section>

      {/* AI Feature Groups */}
      <section className="mb-10 sm:mb-14">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Fonctionnalités IA
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {featureGroups.map((group) => (
            <Card key={group.title} className={`bg-gradient-to-br ${group.gradient} border-0 shadow-sm hover:shadow-md transition-shadow`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-background shadow-sm ${group.iconColor}`}>
                    <group.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{group.title}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">{group.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-1.5">
                  {group.features.map((f) => (
                    <div key={f} className="flex items-center gap-1.5 text-xs text-foreground/80">
                      <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Execution Phases */}
      <section className="mb-10 sm:mb-14">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Play className="h-5 w-5 text-primary" />
          Phases d'exécution
        </h2>
        <div className="space-y-4">
          {phases.map((phase) => (
            <Card key={phase.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white" style={{ backgroundColor: phase.color }}>
                      {phase.id}
                    </span>
                    {phase.title}
                  </CardTitle>
                  {statusBadge(phase.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <Progress value={phase.progress} className="h-2" />
                <div className="grid sm:grid-cols-2 gap-2">
                  {phase.items.map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-sm">
                      {item.done ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                      )}
                      <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Conversion Flow */}
      <section>
        <Card className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-sky-500/5 border-0">
          <CardContent className="p-6 sm:p-8 text-center">
            <Timer className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-1">Flux Conversion-First</h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-4">
              Réduire les étapes d'onboarding. Guider chaque utilisateur vers sa première vente le plus vite possible.
            </p>
            <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium flex-wrap">
              <span className="bg-background rounded-lg px-3 py-1.5 shadow-sm">Inscription</span>
              <ArrowRight className="h-4 w-4 text-primary shrink-0" />
              <span className="bg-background rounded-lg px-3 py-1.5 shadow-sm">Boutique IA</span>
              <ArrowRight className="h-4 w-4 text-primary shrink-0" />
              <span className="bg-background rounded-lg px-3 py-1.5 shadow-sm">Produits</span>
              <ArrowRight className="h-4 w-4 text-primary shrink-0" />
              <span className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 shadow-sm">1ère Vente 🎉</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
