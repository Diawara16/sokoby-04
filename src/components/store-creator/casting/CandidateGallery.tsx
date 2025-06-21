
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search,
  Filter,
  Star,
  Play,
  Euro,
  Clock,
  MapPin,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';
import { useTranslation } from '@/hooks/useDeepLTranslation';

interface CandidateGalleryProps {
  profileCriteria?: any;
  onCandidatesSelected: (candidates: any[]) => void;
  selectedCandidates: any[];
}

export const CandidateGallery = ({ 
  profileCriteria, 
  onCandidatesSelected, 
  selectedCandidates 
}: CandidateGalleryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExperience, setFilterExperience] = useState('all');
  const [filterBudget, setFilterBudget] = useState('all');

  // Données exemple de candidats
  const mockCandidates = [
    {
      id: '1',
      name: 'Alexandre Martin',
      age: 32,
      experience: 'professional',
      rating: 4.8,
      dayRate: 600,
      location: 'Paris',
      specialties: ['B2B', 'Tech', 'E-commerce'],
      portfolio: ['Demo Shopify', 'Présentation SaaS', 'Vidéo corporate'],
      availability: 'Disponible sous 1 semaine',
      bio: 'Présentateur expérimenté spécialisé dans les vidéos B2B et tech. 5 ans d\'expérience.',
      demoVideo: 'https://example.com/demo1',
      contact: { email: 'alex.martin@email.com', phone: '+33 6 12 34 56 78' }
    },
    {
      id: '2', 
      name: 'Sophie Dubois',
      age: 28,
      experience: 'professional',
      rating: 4.9,
      dayRate: 750,
      location: 'Lyon',
      specialties: ['E-commerce', 'Lifestyle', 'Formation'],
      portfolio: ['Démo Prestashop', 'Tuto marketplace', 'Vidéo produit'],
      availability: 'Disponible immédiatement',
      bio: 'Spécialiste des présentations e-commerce avec un style moderne et accessible.',
      demoVideo: 'https://example.com/demo2',
      contact: { email: 'sophie.dubois@email.com', phone: '+33 6 87 65 43 21' }
    },
    {
      id: '3',
      name: 'Thomas Leroy',
      age: 35,
      experience: 'expert',
      rating: 4.7,
      dayRate: 900,
      location: 'Paris',
      specialties: ['Corporate', 'B2B', 'Formations'],
      portfolio: ['Vidéo institutionnelle', 'Formation CRM', 'Présentation produit'],
      availability: 'Disponible dans 2 semaines',
      bio: 'Expert en communication corporate avec 8 ans d\'expérience en vidéo B2B.',
      demoVideo: 'https://example.com/demo3',
      contact: { email: 'thomas.leroy@email.com', phone: '+33 6 11 22 33 44' }
    }
  ];

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesExperience = filterExperience === 'all' || candidate.experience === filterExperience;
    
    const matchesBudget = filterBudget === 'all' || 
                         (filterBudget === 'low' && candidate.dayRate <= 500) ||
                         (filterBudget === 'mid' && candidate.dayRate > 500 && candidate.dayRate <= 800) ||
                         (filterBudget === 'high' && candidate.dayRate > 800);

    return matchesSearch && matchesExperience && matchesBudget;
  });

  const toggleCandidateSelection = (candidate: any) => {
    const isSelected = selectedCandidates.some(c => c.id === candidate.id);
    if (isSelected) {
      onCandidatesSelected(selectedCandidates.filter(c => c.id !== candidate.id));
    } else {
      onCandidatesSelected([...selectedCandidates, candidate]);
    }
  };

  const isSelected = (candidateId: string) => 
    selectedCandidates.some(c => c.id === candidateId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {useTranslation('Candidats disponibles')}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Input
                placeholder={useTranslation('Rechercher par nom ou spécialité...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <select 
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="all">{useTranslation('Tous niveaux')}</option>
              <option value="beginner">{useTranslation('Débutant')}</option>
              <option value="professional">{useTranslation('Professionnel')}</option>
              <option value="expert">{useTranslation('Expert')}</option>
            </select>

            <select 
              value={filterBudget}
              onChange={(e) => setFilterBudget(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="all">{useTranslation('Tous budgets')}</option>
              <option value="low">≤ 500€/jour</option>
              <option value="mid">500-800€/jour</option>
              <option value="high">> 800€/jour</option>
            </select>
          </div>

          {/* Liste des candidats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCandidates.map((candidate) => (
              <Card 
                key={candidate.id}
                className={`cursor-pointer transition-all ${
                  isSelected(candidate.id) ? 'ring-2 ring-primary' : 'hover:shadow-md'
                }`}
                onClick={() => toggleCandidateSelection(candidate)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`} />
                      <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{candidate.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {candidate.location}
                            <span>•</span>
                            {candidate.age} ans
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{candidate.rating}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {candidate.dayRate}€/jour
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {candidate.bio}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {candidate.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">{candidate.availability}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          {useTranslation('Démo')}
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          {useTranslation('Contact')}
                        </Button>

                        {isSelected(candidate.id) && (
                          <Badge className="bg-primary text-primary-foreground">
                            {useTranslation('Sélectionné')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCandidates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{useTranslation('Aucun candidat ne correspond à vos critères')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCandidates.length > 0 && (
        <Card className="border-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">
                  {selectedCandidates.length} {useTranslation('candidat(s) sélectionné(s)')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {useTranslation('Prêt pour l\'étape de casting final')}
                </p>
              </div>
              <Button>
                {useTranslation('Planifier les castings')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
