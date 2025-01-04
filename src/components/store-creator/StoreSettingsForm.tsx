import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, LockKeyhole } from "lucide-react";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";

export const StoreSettingsForm = () => {
  const { profile } = useAuthAndProfile();
  const [storeName, setStoreName] = useState("Ma boutique Sokoby");
  const [storeEmail, setStoreEmail] = useState(profile?.email || "");
  const [storePhone, setStorePhone] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  return (
    <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Configuration IA
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LockKeyhole className="h-4 w-4" />
            Option Premium
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Notre IA va configurer automatiquement votre boutique en fonction de vos préférences
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="store_name">Nom de la boutique</Label>
          <Input
            id="store_name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Ma boutique Sokoby"
            className="border-primary/20"
          />
        </div>
        <div>
          <Label htmlFor="store_email">Email de contact</Label>
          <Input
            id="store_email"
            type="email"
            value={storeEmail}
            onChange={(e) => setStoreEmail(e.target.value)}
            placeholder="contact@maboutique.com"
            className="border-primary/20"
          />
        </div>
        <div>
          <Label htmlFor="store_phone">Téléphone</Label>
          <Input
            id="store_phone"
            value={storePhone}
            onChange={(e) => setStorePhone(e.target.value)}
            placeholder="+33 1 23 45 67 89"
            className="border-primary/20"
          />
        </div>
        <div>
          <Label htmlFor="store_address">Adresse</Label>
          <Input
            id="store_address"
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
            placeholder="123 rue du Commerce, 75001 Paris"
            className="border-primary/20"
          />
        </div>
      </CardContent>
    </Card>
  );
};