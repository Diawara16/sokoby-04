import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppSidebar } from "@/components/AppSidebar";
import { InstalledApps } from "@/components/applications/InstalledApps";
import { AppCatalogue } from "@/components/applications/AppCatalogue";

const Applications = () => {
  return (
    <>
      <AppSidebar />
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
          <p className="text-muted-foreground">
            Gérez vos applications installées et découvrez de nouvelles applications pour votre boutique.
          </p>
        </div>

        <Tabs defaultValue="installed" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="installed">Installées</TabsTrigger>
            <TabsTrigger value="catalogue">Catalogue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="installed" className="mt-6">
            <InstalledApps />
          </TabsContent>
          
          <TabsContent value="catalogue" className="mt-6">
            <AppCatalogue />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Applications;