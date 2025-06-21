
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Users, 
  Star, 
  Clock, 
  Euro,
  Search,
  Filter,
  Play,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { useTranslation } from '@/hooks/useDeepLTranslation';
import { CastingProfileForm } from './casting/CastingProfileForm';
import { CandidateGallery } from './casting/CandidateGallery';
import { CastingBudgetPlanner } from './casting/CastingBudgetPlanner';
import { CastingTimeline } from './casting/CastingTimeline';

export const CastingManager = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [castingProfile, setCastingProfile] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [budget, setBudget] = useState({ min: 500, max: 1000 });

  const titleText = useTranslation("Casting Présentateur Professionnel");
  const descriptionText = useTranslation("Trouvez le présentateur idéal pour votre vidéo Sokoby");

  const castingSteps = [
    {
      id: 'profile',
      name: useTranslation('Profil recherché'),
      icon: User,
      status: castingProfile ? 'completed' : 'current',
      description: useTranslation('Définir les critères du présentateur idéal')
    },
    {
      id: 'search',
      name: useTranslation('Recherche candidats'),
      icon: Search,
      status: castingProfile ? 'current' : 'pending',
      description: useTranslation('Diffuser l\'annonce et collecter les candidatures')
    },
    {
      id: 'selection',
      name: useTranslation('Sélection'),
      icon: Star,
      status: selectedCandidates.length > 0 ? 'current' : 'pending',
      description: useTranslation('Évaluer et présélectionner les candidats')
    },
    {
      id: 'casting',
      name: useTranslation('Casting final'),
      icon: Play,
      status: 'pending',
      description: useTranslation('Tests de lecture et décision finale')
    },
    {
      id: 'contract',
      name: useTranslation('Contractualisation'),
      icon: CheckCircle,
      status: 'pending',
      description: useTranslation('Négociation et signature du contrat')
    }
  ];

  const getStepStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'current':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>{titleText}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {descriptionText}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              {useTranslation('Processus de casting')}
            </h3>
            <Badge variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {useTranslation('Durée estimée : 5-7 jours')}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {castingSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center text-center space-y-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStepStatus(step.status)}`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{step.name}</h4>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < castingSteps.length - 1 && (
                  <div className="hidden md:block w-full h-0.5 bg-gray-200 mt-6" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {useTranslation('Profil')}
          </TabsTrigger>
          <TabsTrigger value="candidates" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {useTranslation('Candidats')}
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex items-center gap-2">
            <Euro className="h-4 w-4" />
            {useTranslation('Budget')}
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {useTranslation('Planning')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <CastingProfileForm 
            onProfileSaved={setCastingProfile}
            currentProfile={castingProfile}
          />
        </TabsContent>

        <TabsContent value="candidates" className="mt-6">
          <CandidateGallery 
            profileCriteria={castingProfile}
            onCandidatesSelected={setSelectedCandidates}
            selectedCandidates={selectedCandidates}
          />
        </TabsContent>

        <TabsContent value="budget" className="mt-6">
          <CastingBudgetPlanner 
            budget={budget}
            onBudgetChange={setBudget}
            selectedCandidates={selectedCandidates}
          />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <CastingTimeline 
            castingProfile={castingProfile}
            selectedCandidates={selectedCandidates}
            budget={budget}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
