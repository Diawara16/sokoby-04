import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { applications } from "@/data/applications";
import { useAppConnections } from "@/hooks/useAppConnections";

const Applications = () => {
  const { connectedApps, isLoading, handleConnect, handleDisconnect } = useAppConnections();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Applications</h1>
          <p className="text-muted-foreground">
            Intégrez des applications populaires pour améliorer votre boutique
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              name={app.name}
              description={app.description}
              icon={app.icon}
              isConnected={!!connectedApps[app.name]}
              onConnect={() => handleConnect(app.name, app.authUrl)}
              onDisconnect={() => handleDisconnect(app.name)}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Applications;