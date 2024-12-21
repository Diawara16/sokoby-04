import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { translations } from "@/translations";

interface NavigationProps {
  currentLanguage: string;
}

export const Navigation = ({ currentLanguage }: NavigationProps) => {
  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="space-x-1">
        <NavigationMenuItem>
          <Link to="/domicile" className={navigationMenuTriggerStyle() + " text-gray-700 hover:text-red-600"}>
            {t.navigation.home}
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/environ" className={navigationMenuTriggerStyle() + " text-gray-700 hover:text-red-600"}>
            {t.navigation.about}
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/services" className={navigationMenuTriggerStyle() + " text-gray-700 hover:text-red-600"}>
            {t.navigation.services}
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/themes" className={navigationMenuTriggerStyle() + " text-gray-700 hover:text-red-600"}>
            {t.navigation.themes}
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/plan-tarifaire" className={navigationMenuTriggerStyle() + " text-gray-700 hover:text-red-600"}>
            {t.navigation.pricing}
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/contact" className={navigationMenuTriggerStyle() + " text-gray-700 hover:text-red-600"}>
            {t.navigation.contact}
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};