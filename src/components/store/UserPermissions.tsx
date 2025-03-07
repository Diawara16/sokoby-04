import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { StaffManagement } from "./permissions/StaffManagement";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const UserPermissions = () => {
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour accéder à cette page",
          variant: "destructive",
        });
        return;
      }
    };

    checkAuth();
  }, [toast]);

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-gray-600" />
        <h3 className="text-xl font-semibold">Gestion de l'équipe</h3>
      </div>

      <div className="space-y-8">
        <StaffManagement />
      </div>
    </Card>
  );
};