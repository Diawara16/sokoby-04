import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const UserSettings = () => {
  const [allowCustomerAccounts, setAllowCustomerAccounts] = useState(true);
  const [multipleAddresses, setMultipleAddresses] = useState(true);
  const [guestCheckout, setGuestCheckout] = useState(true);
  const [accountApproval, setAccountApproval] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('store_settings')
        .update({
          customer_settings: {
            allow_customer_accounts: allowCustomerAccounts,
            multiple_addresses: multipleAddresses,
            guest_checkout: guestCheckout,
            require_account_approval: accountApproval
          }
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres utilisateurs ont été sauvegardés avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Paramètres utilisateurs</h1>
        <p className="text-muted-foreground">
          Gérez la façon dont les clients peuvent interagir avec votre boutique
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Comptes clients</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="customer-accounts">Comptes clients</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Permettre aux clients de créer un compte sur votre boutique</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Les clients pourront créer un compte et suivre leurs commandes
                  </p>
                </div>
                <Switch
                  id="customer-accounts"
                  checked={allowCustomerAccounts}
                  onCheckedChange={setAllowCustomerAccounts}
                />
              </div>

              {allowCustomerAccounts && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="multiple-addresses">Adresses multiples</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Autoriser plusieurs adresses de livraison par client</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Les clients peuvent sauvegarder plusieurs adresses
                      </p>
                    </div>
                    <Switch
                      id="multiple-addresses"
                      checked={multipleAddresses}
                      onCheckedChange={setMultipleAddresses}
                    />
                  </div>

                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="account-approval">Approbation des comptes</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Approuver manuellement les nouveaux comptes clients</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Les nouveaux comptes devront être approuvés avant de pouvoir commander
                      </p>
                    </div>
                    <Switch
                      id="account-approval"
                      checked={accountApproval}
                      onCheckedChange={setAccountApproval}
                    />
                  </div>
                </>
              )}

              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="guest-checkout">Commande invité</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Permettre aux clients de commander sans créer de compte</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Les clients peuvent passer commande sans créer de compte
                  </p>
                </div>
                <Switch
                  id="guest-checkout"
                  checked={guestCheckout}
                  onCheckedChange={setGuestCheckout}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            Sauvegarder les modifications
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UserSettings;