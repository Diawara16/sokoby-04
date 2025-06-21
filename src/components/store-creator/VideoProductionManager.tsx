
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Upload,
  Settings
} from 'lucide-react';
import { useTranslation } from '@/hooks/useDeepLTranslation';

interface ProductionStage {
  id: string;
  name: string;
  duration: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  description: string;
}

export const VideoProductionManager = () => {
  const [currentStage, setCurrentStage] = useState(0);
  
  const titleText = useTranslation("Gestion de Production Vidéo");
  const descriptionText = useTranslation("Suivez l'avancement de votre vidéo de démonstration Sokoby");
  
  const stages: ProductionStage[] = [
    {
      id: 'preproduction',
      name: useTranslation('Pré-production'),
      duration: '2-3 jours',
      status: 'completed',
      description: useTranslation('Script, storyboard, casting et préparation matériel')
    },
    {
      id: 'production',
      name: useTranslation('Production'),
      duration: '1-2 jours', 
      status: 'in-progress',
      description: useTranslation('Tournage présentateur et capture écrans Sokoby')
    },
    {
      id: 'postproduction',
      name: useTranslation('Post-production'),
      duration: '3-4 jours',
      status: 'pending',
      description: useTranslation('Montage, graphiques, audio et export multi-formats')
    },
    {
      id: 'integration',
      name: useTranslation('Intégration'),
      duration: '1 jour',
      status: 'pending', 
      description: useTranslation('Upload, tests et déploiement sur la plateforme')
    },
    {
      id: 'finalization',
      name: useTranslation('Finalisation'),
      duration: '1 jour',
      status: 'pending',
      description: useTranslation('Sous-titres, traductions et métriques')
    }
  ];

  const getStatusIcon = (status: ProductionStage['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
      case 'blocked':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ProductionStage['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const completedStages = stages.filter(s => s.status === 'completed').length;
  const progressPercentage = (completedStages / stages.length) * 100;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Video className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>{titleText}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {descriptionText}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{useTranslation('Progression globale')}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-start gap-4 p-4 rounded-lg border">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(stage.status)}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{stage.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(stage.status)}>
                      {useTranslation(stage.status === 'in-progress' ? 'En cours' : 
                                     stage.status === 'completed' ? 'Terminé' :
                                     stage.status === 'blocked' ? 'Bloqué' : 'En attente')}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {stage.duration}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {stage.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <h5 className="font-medium">{useTranslation('Présentateur')}</h5>
                  <p className="text-sm text-muted-foreground">
                    {useTranslation('Professionnel confirmé')}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <h5 className="font-medium">{useTranslation('Livraison')}</h5>
                  <p className="text-sm text-muted-foreground">
                    {useTranslation('7-10 jours ouvrés')}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-primary" />
                <div>
                  <h5 className="font-medium">{useTranslation('Format')}</h5>
                  <p className="text-sm text-muted-foreground">
                    {useTranslation('4K, 1080p, 720p')}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            {useTranslation('Télécharger rushes')}
          </Button>
          
          <Button>
            <Play className="h-4 w-4 mr-2" />
            {useTranslation('Prévisualiser démo')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
