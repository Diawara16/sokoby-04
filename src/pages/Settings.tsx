import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/settings') {
      navigate('/settings/general');
    }
  }, [location.pathname, navigate]);

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