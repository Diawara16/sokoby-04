import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { SidebarMenu } from "./navigation/SidebarMenu";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">Menu</h2>
            <ScrollArea className="h-[calc(100vh-10rem)] px-2">
              <SidebarMenu />
            </ScrollArea>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}