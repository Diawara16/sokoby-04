import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { sidebarItems } from "./SidebarItems";

export const SidebarMenu = () => {
  const location = useLocation();

  return (
    <div className="space-y-1">
      {sidebarItems.map((item) => (
        <Button
          key={item.href}
          variant={location.pathname === item.href ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start",
            location.pathname === item.href && "bg-secondary",
            item.className
          )}
          asChild
        >
          <Link to={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </div>
  );
};