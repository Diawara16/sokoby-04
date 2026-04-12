import { SaveStatus } from "@/hooks/useAutosave";
import { Check, Loader2, AlertCircle } from "lucide-react";

interface Props {
  status: SaveStatus;
}

export function AutosaveIndicator({ status }: Props) {
  if (status === "idle") return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {status === "saving" && (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Sauvegarde…</span>
        </>
      )}
      {status === "saved" && (
        <>
          <Check className="h-3 w-3 text-green-500" />
          <span className="text-green-600">Sauvegardé</span>
        </>
      )}
      {status === "error" && (
        <>
          <AlertCircle className="h-3 w-3 text-destructive" />
          <span className="text-destructive">Erreur</span>
        </>
      )}
    </div>
  );
}
