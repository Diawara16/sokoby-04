import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send, Users } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";

const EmailMarketing = () => {
  return (
    <>
      <AppSidebar />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Email Marketing</h2>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Nouvelle campagne
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Abonnés
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +180 depuis le mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taux d'ouverture
              </CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.8%</div>
              <p className="text-xs text-muted-foreground">
                +2.4% depuis la dernière campagne
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Dernières Campagnes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Soldes d'hiver</p>
                  <p className="text-sm text-muted-foreground">
                    Envoyée le 5 janvier 2024
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">45% ouverture</p>
                  <p className="text-sm text-muted-foreground">
                    2,145 destinataires
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Newsletter mensuelle</p>
                  <p className="text-sm text-muted-foreground">
                    Envoyée le 1 janvier 2024
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">38% ouverture</p>
                  <p className="text-sm text-muted-foreground">
                    2,032 destinataires
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EmailMarketing;