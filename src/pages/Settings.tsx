
import { Outlet } from "react-router-dom";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";

const Settings = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SettingsSidebar />
      <div className="flex-1 p-3 sm:p-4 md:p-6 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
