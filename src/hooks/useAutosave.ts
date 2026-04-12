import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";

interface UseAutosaveOptions {
  onSave: (data: any) => Promise<boolean>;
  debounceMs?: number;
  successMessage?: string;
  errorMessage?: string;
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutosave({
  onSave,
  debounceMs = 800,
  successMessage = "Modifications sauvegardées",
  errorMessage = "Échec de la sauvegarde",
}: UseAutosaveOptions) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const pendingRef = useRef<any>(null);

  const save = useCallback(
    async (data: any) => {
      if (savingRef.current) {
        pendingRef.current = data;
        return;
      }

      savingRef.current = true;
      setStatus("saving");

      try {
        const ok = await onSave(data);
        if (ok) {
          setStatus("saved");
          // Reset to idle after 2s
          setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 2000);
        } else {
          setStatus("error");
          toast.error(errorMessage);
        }
      } catch {
        setStatus("error");
        toast.error(errorMessage);
      } finally {
        savingRef.current = false;
        // Process pending save if any
        if (pendingRef.current) {
          const pending = pendingRef.current;
          pendingRef.current = null;
          save(pending);
        }
      }
    },
    [onSave, errorMessage]
  );

  const debouncedSave = useCallback(
    (data: any) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => save(data), debounceMs);
    },
    [save, debounceMs]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { status, debouncedSave, saveNow: save };
}
