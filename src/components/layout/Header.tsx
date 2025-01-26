import { Logo } from "./navigation/Logo";
import { DesktopNav } from "./navigation/DesktopNav";
import { MobileNav } from "./navigation/MobileNav";

interface HeaderProps {
  isAuthenticated: boolean;
}

export function Header({ isAuthenticated }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-white z-50">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <Logo />
        <DesktopNav isAuthenticated={isAuthenticated} />
        <MobileNav isAuthenticated={isAuthenticated} />
      </div>
    </header>
  );
}