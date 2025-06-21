
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Camera,
  Edit,
  PlayCircle
} from 'lucide-react';
import { useTranslation } from '@/hooks/useDeepLTranslation';

interface CastingTimelineProps {
  castingProfile?: any;
  selectedCandidates: any[];
  budget: { min: number; max: number };
}

export const CastingTimeline = ({ 
  castingProfile, 
  selectedCandidates, 
  budget 
}: CastingTimelineProps) => {
  
  const timelineSteps = [
    {
      id: 'announcement',
      title: useTranslation('Diffusion de l\'annonce'),
      duration: '1-2 jours',
      status: castingProfile ? 'completed' : 'pending',
      tasks: [
        useTranslation('Rédiger l\'annonce de casting'),
        useTranslation('Publier sur plateformes spécialisées'),
        useTranslation('Diffuser dans réseau professionnel'),
        useTranslation('Contacter agences recommandées')
      ],
      deliverable: useTranslation('Annonce publiée et diffusée')
    },
    {
      id: 'applications',
      title: useTranslation('Réception des candidatures'),
      duration: '3-4 jours',
      status: selectedCandidates.length > 0 ? 'completed' : castingProfile ? 'current' : 'pending',
      tasks: [
        useTranslation('Collecter les candidatures'),
        useTranslation('Présélectionner sur CV et démo'),
        useTranslation('Vérifier les références'),
        useTranslation('Présélectionner 3-5 candidats')
      ],
      deliverable: useTranslation('Liste de candidats présélectionnés')
    },
    {
      id: 'casting',
      title: useTranslation('Sessions de casting'),
      duration: '1-2 jours',
      status: selectedCandidates.length > 0 ? 'current' : 'pending',
      tasks: [
        useTranslation('Organiser les rendez-vous'),
        useTranslation('Tests de lecture du script'),
        useTranslation('Évaluation du charisme'),
        useTranslation('Négociation des conditions')
      ],
      deliverable: useTranslation('Présentateur sélectionné et contractualisé')
    },
    {
      id: 'preparation',
      title: useTranslation('Préparation du tournage'),
      duration: '2-3 jours',
      status: 'pending',
      tasks: [
        useTranslation('Briefing du présentateur'),
        useTranslation('Répétition du script'),
        useTranslation('Préparation matériel'),
        useTranslation('Réservation lieu de tournage')
      ],
      deliverable: useTranslation('Tournage planifié et préparé')
    },
    {
      id: 'shooting',
      title: useTranslation('Tournage'),
      duration: '1 jour',
      status: 'pending',
      tasks: [
        useTranslation('Configuration technique'),
        useTranslation('Tournage des séquences'),
        useTranslation('Capture écrans Sokoby'),
        useTranslation('Prises de sécurité')
      ],
      deliverable: useTranslation('Matériel brut de qualité')
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'current':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const completedSteps = timelineSteps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / timelineSteps.length) * 100;

  const totalDuration = timelineSteps.reduce((total, step) => {
    const days = parseInt(step.duration.split('-')[1] || step.duration.split(' ')[0]);
    return total + days;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>{useTranslation('Planning de casting')}</CardTitle>
            </div>
            <Badge variant="outline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {totalDuration} {useTranslation('jours maximum')}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>{useTranslation('Progression globale')}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{completedSteps}</div>
                <div className="text-sm text-muted-foreground">
                  {useTranslation('Étapes terminées')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalDuration}</div>
                <div className="text-sm text-muted-foreground">
                  {useTranslation('Jours maximum')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{budget.max}€</div>
                <div className="text-sm text-muted-foreground">
                  {useTranslation('Budget planifié')}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline détaillée */}
      <div className="space-y-4">
        {timelineSteps.map((step, index) => (
          <Card key={step.id} className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(step.status)}
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg">{step.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(step.status)}>
                        {useTranslation(
                          step.status === 'current' ? 'En cours' :
                          step.status === 'completed' ? 'Terminé' : 'À venir'
                        )}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {step.duration}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">
                        {useTranslation('Tâches à réaliser')}
                      </h5>
                      <ul className="space-y-1">
                        {step.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">
                        {useTranslation('Livrable')}
                      </h5>
                      <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                        {step.deliverable}
                      </p>
                    </div>
                  </div>
                  
                  {step.status === 'current' && (
                    <div className="flex gap-2 pt-3">
                      <Button size="sm">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        {useTranslation('Démarrer cette étape')}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        {useTranslation('Modifier')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conseils timing */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-amber-900">
                {useTranslation('Conseils pour respecter les délais')}
              </h4>
              <ul className="space-y-1 text-sm text-amber-800">
                <li>• {useTranslation('Lancez le casting dès que possible, les bons présentateurs sont demandés')}</li>
                <li>• {useTranslation('Préparez plusieurs créneaux de casting pour s\'adapter aux disponibilités')}</li>
                <li>• {useTranslation('Validez le matériel technique en amont pour éviter les retards')}</li>
                <li>• {useTranslation('Gardez 1-2 jours de marge pour les imprévus')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
