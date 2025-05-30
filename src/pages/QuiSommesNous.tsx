
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Zap, Globe, Star, Heart, Target } from "lucide-react";
import { Link } from "react-router-dom";

const QuiSommesNous = () => {
  const stats = [
    { label: "Boutiques créées", value: "25K+", icon: "🛍️" },
    { label: "Pays couverts", value: "120+", icon: "🌍" },
    { label: "Satisfaction client", value: "98%", icon: "⭐" },
    { label: "Support disponible", value: "24/7", icon: "💬" }
  ];

  const values = [
    {
      icon: Shield,
      title: "Sécurité",
      description: "Protection maximale de vos données et celles de vos clients avec des standards de sécurité de niveau bancaire."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Une communauté forte d'entrepreneurs qui s'entraident pour réussir ensemble dans le e-commerce."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Technologies de pointe et IA pour vous donner un avantage concurrentiel dans votre marché."
    },
    {
      icon: Globe,
      title: "Accessibilité",
      description: "Outils simples et intuitifs accessibles à tous, quel que soit votre niveau technique."
    }
  ];

  const team = [
    {
      name: "Sarah Martin",
      role: "CEO & Fondatrice",
      bio: "15 ans d'expérience dans le e-commerce et la technologie. Passionnée par l'entrepreneuriat digital.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Thomas Dubois", 
      role: "CTO",
      bio: "Expert en IA et développement. Ancien de Google et Microsoft, spécialisé dans l'automatisation.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Marie Leclerc",
      role: "Head of Design", 
      bio: "Designer UX/UI primée. Créatrice d'expériences utilisateur exceptionnelles pour le e-commerce.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="h-4 w-4 mr-2" />
            Créé avec passion pour les entrepreneurs
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Qui sommes-nous ?
          </h1>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Sokoby est né d'une vision simple : démocratiser le e-commerce en rendant 
            la création de boutiques en ligne accessible à tous grâce à l'intelligence artificielle.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-red-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Target className="h-4 w-4 mr-2" />
                Notre Mission
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Révolutionner le e-commerce avec l'IA
              </h2>
              
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Nous croyons que chaque entrepreneur mérite d'avoir accès aux mêmes outils 
                que les grandes entreprises. Notre plateforme alimentée par l'IA permet de 
                créer des boutiques professionnelles en quelques minutes, sans compétences techniques.
              </p>
              
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Depuis notre lancement, nous avons aidé plus de 25 000 entrepreneurs dans 
                120 pays à concrétiser leurs rêves e-commerce.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/essai-gratuit">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    Commencer gratuitement
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg">
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop" 
                alt="Équipe Sokoby au travail"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">4.9/5</span>
                  <span className="text-gray-500">satisfaction client</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les principes qui guident chacune de nos actions et décisions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <IconComponent className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Équipe</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les visionnaires qui rendent Sokoby possible
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="text-center p-8">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-bold text-xl mb-2">{member.name}</h3>
                  <p className="text-red-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-12 shadow-xl">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à rejoindre l'aventure ?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Rejoignez des milliers d'entrepreneurs qui ont fait confiance à Sokoby 
            pour développer leur business en ligne.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/essai-gratuit">
              <Button size="lg" variant="secondary" className="text-red-600 hover:text-red-700">
                Essai Gratuit 14 jours
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                Planifier une démo
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default QuiSommesNous;
