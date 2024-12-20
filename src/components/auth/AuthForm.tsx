import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

export const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const minLength = password.length >= 6;
    return minLength;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(password)) {
      toast({
        title: "Erreur de validation",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte",
        });
        navigate('/onboarding');
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center">
        {isLogin ? 'Connexion' : 'Inscription'}
      </h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <p className="text-sm text-gray-500 mt-1">
              Le mot de passe doit contenir au moins 6 caractères
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Chargement...' : isLogin ? 'Se connecter' : "S'inscrire"}
        </Button>
      </form>
      <Button
        variant="link"
        className="w-full"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
      </Button>
    </div>
  );
};