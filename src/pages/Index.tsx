import { FacebookIconUploader } from "@/components/facebook/FacebookIconUploader";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    console.log("Page d'index chargée");
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Icône d'application Facebook</h1>
      <FacebookIconUploader />
    </div>
  );
}
