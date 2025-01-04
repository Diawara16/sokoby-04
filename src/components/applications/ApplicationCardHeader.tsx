import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface ApplicationCardHeaderProps {
  name: string;
  Icon: LucideIcon;
  isConnected: boolean;
  status?: 'active' | 'pending' | 'error';
}

export function ApplicationCardHeader({ name, Icon, isConnected, status }: ApplicationCardHeaderProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'error':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        <span className="truncate">{name}</span>
      </CardTitle>
      {isConnected && (
        <Badge variant="secondary" className={`${getStatusColor()} whitespace-nowrap`}>
          {status === 'active' ? 'Connecté' : status === 'pending' ? 'En attente' : 'Erreur'}
        </Badge>
      )}
    </div>
  );
}