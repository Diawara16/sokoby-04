import { Button } from "@/components/ui/button";

export const ConnectedServices = () => {
  return (
    <div>
      <h4 className="text-lg font-medium mb-4">Services de connexion</h4>
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Applications externes</p>
            <p className="text-sm text-gray-600">
              Autoriser les employés à utiliser les services externes
            </p>
          </div>
          <Button variant="outline">Configurer</Button>
        </div>
      </div>
    </div>
  );
};