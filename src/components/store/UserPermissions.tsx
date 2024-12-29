import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { StaffAccess } from "./permissions/StaffAccess";
import { CollaborationPolicy } from "./permissions/CollaborationPolicy";
import { CollaboratorCode } from "./permissions/CollaboratorCode";
import { ConnectedServices } from "./permissions/ConnectedServices";

export const UserPermissions = () => {
  const [collaboratorCode, setCollaboratorCode] = useState("");
  const [invitePolicy, setInvitePolicy] = useState("restricted");
  const [posAccess, setPosAccess] = useState(false);

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-gray-600" />
        <h3 className="text-xl font-semibold">Utilisateurs et autorisations</h3>
      </div>

      <div className="space-y-8">
        {/* Propriétaire de la boutique */}
        <div>
          <h4 className="text-lg font-medium mb-4">Propriétaire de la boutique</h4>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Users className="h-8 w-8 text-gray-500" />
            <div>
              <p className="font-medium">Boutique principale</p>
              <p className="text-sm text-gray-600">Accès complet aux paramètres et configurations</p>
            </div>
          </div>
        </div>

        <StaffAccess posAccess={posAccess} setPosAccess={setPosAccess} />
        <CollaborationPolicy invitePolicy={invitePolicy} setInvitePolicy={setInvitePolicy} />
        <CollaboratorCode collaboratorCode={collaboratorCode} setCollaboratorCode={setCollaboratorCode} />
        <ConnectedServices />
      </div>
    </Card>
  );
};