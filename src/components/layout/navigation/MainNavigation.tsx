import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { T } from "@/components/translation/T";

export const MainNavigation = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <T>Fonctionnalités</T>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 md:w-[500px] lg:w-[600px] lg:grid-cols-2">
              <NavigationMenuLink asChild>
                <a
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  href="/marketplace"
                >
                  <div className="text-sm font-medium leading-none">
                    <T>Marketplace Extensions</T>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    <T>Plus de 50 extensions pour étendre votre boutique</T>
                  </p>
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  href="/editeur-pages"
                >
                  <div className="text-sm font-medium leading-none">
                    <T>Éditeur Visuel</T>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    <T>Créez des pages personnalisées en drag & drop</T>
                  </p>
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  href="/zapier"
                >
                  <div className="text-sm font-medium leading-none">
                    <T>Intégrations Zapier</T>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    <T>Connectez votre boutique à 6000+ applications</T>
                  </p>
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  href="/boutique-ia"
                >
                  <div className="text-sm font-medium leading-none">
                    <T>Boutique IA</T>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    <T>Créez votre boutique avec l'intelligence artificielle</T>
                  </p>
                </a>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <T>Solutions</T>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <div className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/migration-shopify"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      <T>Migration Facile</T>
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      <T>Migrez depuis Shopify, WooCommerce et autres en 1-clic</T>
                    </p>
                  </a>
                </NavigationMenuLink>
              </div>
              <NavigationMenuLink asChild>
                <a
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  href="/comparaison-modeles"
                >
                  <div className="text-sm font-medium leading-none">
                    <T>Comparaison IA</T>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    <T>Comparez les différents modèles d'IA disponibles</T>
                  </p>
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  href="/fonctionnalites"
                >
                  <div className="text-sm font-medium leading-none">
                    <T>Toutes les fonctionnalités</T>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    <T>Découvrez tout ce que Sokoby peut faire</T>
                  </p>
                </a>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href="/tarifs">
            <T>Tarifs</T>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href="/support">
            <T>Support</T>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};