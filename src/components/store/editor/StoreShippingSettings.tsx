import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAutosave } from "@/hooks/useAutosave";
import { AutosaveIndicator } from "./AutosaveIndicator";
import { Truck, MapPin, Clock, Euro, Plus, Trash2 } from "lucide-react";

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  enabled: boolean;
}

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  methods: ShippingMethod[];
}

interface ShippingData {
  zones: ShippingZone[];
  freeShippingEnabled: boolean;
  freeShippingThreshold: number;
}

const DEFAULT_ZONES: ShippingZone[] = [
  {
    id: "1",
    name: "France métropolitaine",
    countries: ["FR"],
    methods: [
      { id: "1", name: "Livraison standard", price: 4.9, estimatedDays: "3-5 jours", enabled: true },
      { id: "2", name: "Livraison express", price: 9.9, estimatedDays: "1-2 jours", enabled: true },
      { id: "3", name: "Livraison gratuite", price: 0, estimatedDays: "5-7 jours", enabled: false },
    ],
  },
  {
    id: "2",
    name: "Europe",
    countries: ["DE", "IT", "ES", "BE", "NL"],
    methods: [
      { id: "4", name: "Livraison standard", price: 12.9, estimatedDays: "5-10 jours", enabled: true },
      { id: "5", name: "Livraison express", price: 24.9, estimatedDays: "3-5 jours", enabled: false },
    ],
  },
];

const COUNTRIES = [
  { code: "FR", name: "France" },
  { code: "DE", name: "Allemagne" },
  { code: "IT", name: "Italie" },
  { code: "ES", name: "Espagne" },
  { code: "BE", name: "Belgique" },
  { code: "NL", name: "Pays-Bas" },
  { code: "CH", name: "Suisse" },
  { code: "UK", name: "Royaume-Uni" },
];

export function StoreShippingSettings() {
  const [data, setData] = useState<ShippingData>({
    zones: DEFAULT_ZONES,
    freeShippingEnabled: true,
    freeShippingThreshold: 50,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: store } = await supabase
          .from("store_settings")
          .select("shipping_settings")
          .eq("user_id", user.id)
          .maybeSingle();
        if (store) {
          const ss = (store as any).shipping_settings;
          if (ss && ss.zones) {
            setData({
              zones: ss.zones || DEFAULT_ZONES,
              freeShippingEnabled: ss.freeShippingEnabled ?? true,
              freeShippingThreshold: ss.freeShippingThreshold ?? 50,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load shipping settings:", err);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const saveToDb = useCallback(async (saveData: ShippingData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { error } = await supabase
      .from("store_settings")
      .update({ shipping_settings: saveData, updated_at: new Date().toISOString() } as any)
      .eq("user_id", user.id);
    return !error;
  }, []);

  const { status, debouncedSave } = useAutosave({ onSave: saveToDb, debounceMs: 1000 });

  const update = (next: ShippingData) => {
    setData(next);
    if (loaded) debouncedSave(next);
  };

  const addZone = () => {
    update({ ...data, zones: [...data.zones, { id: Date.now().toString(), name: "Nouvelle zone", countries: [], methods: [] }] });
  };

  const addMethod = (zoneId: string) => {
    update({
      ...data,
      zones: data.zones.map((z) =>
        z.id === zoneId
          ? { ...z, methods: [...z.methods, { id: Date.now().toString(), name: "Nouvelle méthode", price: 0, estimatedDays: "3-5 jours", enabled: true }] }
          : z
      ),
    });
  };

  const updateMethod = (zoneId: string, methodId: string, patch: Partial<ShippingMethod>) => {
    update({
      ...data,
      zones: data.zones.map((z) =>
        z.id === zoneId
          ? { ...z, methods: z.methods.map((m) => (m.id === methodId ? { ...m, ...patch } : m)) }
          : z
      ),
    });
  };

  const deleteMethod = (zoneId: string, methodId: string) => {
    update({
      ...data,
      zones: data.zones.map((z) =>
        z.id === zoneId ? { ...z, methods: z.methods.filter((m) => m.id !== methodId) } : z
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Livraison</h2>
        <AutosaveIndicator status={status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Euro className="h-5 w-5" />Livraison gratuite</CardTitle>
          <CardDescription>Configurez le seuil pour la livraison gratuite</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><Label className="text-base">Activer la livraison gratuite</Label><p className="text-sm text-muted-foreground">Offrez la livraison gratuite à partir d'un certain montant</p></div>
            <Switch checked={data.freeShippingEnabled} onCheckedChange={(v) => update({ ...data, freeShippingEnabled: v })} />
          </div>
          {data.freeShippingEnabled && (
            <div className="space-y-2">
              <Label>Seuil de livraison gratuite (€)</Label>
              <Input type="number" value={data.freeShippingThreshold} onChange={(e) => update({ ...data, freeShippingThreshold: Number(e.target.value) })} />
              <p className="text-sm text-muted-foreground">Commandes de {data.freeShippingThreshold}€ et plus = livraison gratuite</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Zones de livraison</CardTitle><CardDescription>Configurez les zones géographiques et leurs méthodes de livraison</CardDescription></div>
            <Button onClick={addZone} size="sm"><Plus className="h-4 w-4 mr-2" />Ajouter une zone</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.zones.map((zone) => (
              <div key={zone.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Input value={zone.name} onChange={(e) => update({ ...data, zones: data.zones.map((z) => (z.id === zone.id ? { ...z, name: e.target.value } : z)) })} className="font-medium" />
                    <div className="flex flex-wrap gap-1">
                      {zone.countries.map((cc) => {
                        const c = COUNTRIES.find((ct) => ct.code === cc);
                        return <Badge key={cc} variant="secondary" className="text-xs">{c?.name || cc}</Badge>;
                      })}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => addMethod(zone.id)}><Plus className="h-4 w-4 mr-2" />Méthode</Button>
                </div>
                <div className="space-y-3">
                  {zone.methods.map((method) => (
                    <div key={method.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <Switch checked={method.enabled} onCheckedChange={(v) => updateMethod(zone.id, method.id, { enabled: v })} />
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input value={method.name} onChange={(e) => updateMethod(zone.id, method.id, { name: e.target.value })} />
                        <div className="flex items-center gap-2"><Input type="number" step="0.01" value={method.price} onChange={(e) => updateMethod(zone.id, method.id, { price: Number(e.target.value) })} /><span className="text-sm text-muted-foreground">€</span></div>
                        <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><Input value={method.estimatedDays} onChange={(e) => updateMethod(zone.id, method.id, { estimatedDays: e.target.value })} /></div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => deleteMethod(zone.id, method.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  {zone.methods.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Aucune méthode de livraison configurée pour cette zone</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5" />Transporteurs</CardTitle><CardDescription>Connectez votre boutique avec des transporteurs pour automatiser les envois</CardDescription></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[{ name: "Colissimo", sub: "La Poste", emoji: "📦", bg: "bg-yellow-100" }, { name: "Chronopost", sub: "Livraison express", emoji: "🚚", bg: "bg-red-100" }, { name: "UPS", sub: "International", emoji: "📮", bg: "bg-orange-100" }, { name: "DHL", sub: "Express mondial", emoji: "📦", bg: "bg-purple-100" }].map((t) => (
              <div key={t.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3"><div className={`w-10 h-10 ${t.bg} rounded-lg flex items-center justify-center`}>{t.emoji}</div><div><p className="font-medium">{t.name}</p><p className="text-sm text-muted-foreground">{t.sub}</p></div></div>
                <Badge variant="secondary">Bientôt</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
