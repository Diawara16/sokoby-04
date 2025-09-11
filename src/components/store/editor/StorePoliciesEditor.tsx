import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StorePolicy {
  id?: string;
  policy_type: string;
  title: string;
  content: string;
}

const POLICY_TYPES = [
  { key: 'faq', title: 'FAQ', description: 'Questions fréquemment posées' },
  { key: 'delivery', title: 'Livraison', description: 'Informations sur la livraison' },
  { key: 'payment', title: 'Paiement sécurisé', description: 'Informations sur le paiement' },
  { key: 'security', title: 'Sécurité', description: 'Politique de sécurité' },
];

export const StorePoliciesEditor = () => {
  const [policies, setPolicies] = useState<Record<string, StorePolicy>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [savingPolicy, setSavingPolicy] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('store_policies')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const policiesMap: Record<string, StorePolicy> = {};
      data?.forEach((policy) => {
        policiesMap[policy.policy_type] = policy;
      });

      // Initialiser les politiques manquantes
      POLICY_TYPES.forEach((type) => {
        if (!policiesMap[type.key]) {
          policiesMap[type.key] = {
            policy_type: type.key,
            title: type.title,
            content: ''
          };
        }
      });

      setPolicies(policiesMap);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les politiques",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePolicy = async (policyType: string) => {
    const policy = policies[policyType];
    if (!policy) return;

    setSavingPolicy(policyType);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabase
        .from('store_policies')
        .upsert({
          user_id: user.id,
          policy_type: policy.policy_type,
          title: policy.title,
          content: policy.content,
          is_active: true
        }, {
          onConflict: 'user_id,policy_type'
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: `${policy.title} sauvegardé`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder",
        variant: "destructive",
      });
    } finally {
      setSavingPolicy(null);
    }
  };

  const updatePolicy = (policyType: string, field: keyof StorePolicy, value: string) => {
    setPolicies(prev => ({
      ...prev,
      [policyType]: {
        ...prev[policyType],
        [field]: value
      }
    }));
  };

  if (isLoading) {
    return <div>Chargement des politiques...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Éditeur de sections</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="faq" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            {POLICY_TYPES.map((type) => (
              <TabsTrigger key={type.key} value={type.key}>
                {type.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {POLICY_TYPES.map((type) => (
            <TabsContent key={type.key} value={type.key} className="space-y-4">
              <div>
                <Label htmlFor={`${type.key}-title`}>Titre de la section</Label>
                <Input
                  id={`${type.key}-title`}
                  value={policies[type.key]?.title || ''}
                  onChange={(e) => updatePolicy(type.key, 'title', e.target.value)}
                  placeholder={type.title}
                />
              </div>

              <div>
                <Label htmlFor={`${type.key}-content`}>Contenu</Label>
                <Textarea
                  id={`${type.key}-content`}
                  value={policies[type.key]?.content || ''}
                  onChange={(e) => updatePolicy(type.key, 'content', e.target.value)}
                  placeholder={`Contenu de la section ${type.title.toLowerCase()}...`}
                  rows={10}
                  className="mt-2"
                />
              </div>

              <Button
                onClick={() => handleSavePolicy(type.key)}
                disabled={savingPolicy === type.key}
              >
                {savingPolicy === type.key ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};