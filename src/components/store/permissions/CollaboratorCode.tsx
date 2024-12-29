import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CollaboratorCodeProps {
  collaboratorCode: string;
  setCollaboratorCode: (value: string) => void;
}

export const CollaboratorCode = ({ collaboratorCode, setCollaboratorCode }: CollaboratorCodeProps) => {
  const { toast } = useToast();

  const generateNewCode = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCollaboratorCode(newCode);
    toast({
      title: "Nouveau code généré",
      description: "Le code de collaboration a été mis à jour",
    });
  };

  return (
    <div>
      <h4 className="text-lg font-medium mb-4">Code de requête de collaborateur</h4>
      <div className="flex gap-4">
        <Input
          value={collaboratorCode}
          onChange={(e) => setCollaboratorCode(e.target.value)}
          placeholder="Code de collaboration"
          className="max-w-xs"
        />
        <Button onClick={generateNewCode} variant="outline">
          Générer un nouveau code
        </Button>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Partagez ce code pour permettre à quelqu'un de vous envoyer une requête de collaborateur.
      </p>
    </div>
  );
};