import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { translations } from "@/translations";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('currentLanguage') || 'fr';
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentLanguage') {
        setCurrentLanguage(event.newValue || 'fr');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const t = translations[currentLanguage as keyof typeof translations];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            plan: "gratuit",
            trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
      });

      if (error) throw error;

      toast({
        title: t.auth.successTitle,
        description: t.auth.successDescription,
      });
      
      navigate("/onboarding");
    } catch (error) {
      toast({
        title: t.auth.errorTitle,
        description: t.auth.errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.auth.createAccount}</CardTitle>
        <CardDescription>
          {t.auth.trialDescription}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={t.auth.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t.auth.password}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t.auth.creating : t.auth.create}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}