import { Card } from "@/components/ui/card";
import { UserPermissions } from "@/components/store/UserPermissions";

const UserSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Paramètres utilisateurs</h1>
        <p className="text-muted-foreground">
          Gérez votre équipe et les autorisations
        </p>
      </div>

      <UserPermissions />
    </div>
  );
};

export default UserSettings;