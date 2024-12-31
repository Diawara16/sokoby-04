import { Outlet } from "react-router-dom";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";

const Settings = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <SettingsSidebar />
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;