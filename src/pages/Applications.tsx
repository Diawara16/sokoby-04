import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { applications } from "@/data/applications";
import { useAppConnections } from "@/hooks/useAppConnections";
import { useIsMobile } from "@/hooks/use-mobile";

const Applications = () => {
  const { connectedApps, isLoading, handleConnect, handleDisconnect } = useAppConnections();
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto py-6 px-4 sm:py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Applications</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Intégrez des applications populaires pour améliorer votre boutique
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              name={app.name}
              description={app.description}
              icon={app.icon}
              isConnected={!!connectedApps[app.id]}
              onConnect={() => handleConnect(app.id, app.authUrl)}
              onDisconnect={() => handleDisconnect(app.id)}
              isLoading={isLoading}
              features={isMobile ? app.features?.slice(0, 3) : app.features}
              price={app.price}
              status={connectedApps[app.id]?.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Applications;