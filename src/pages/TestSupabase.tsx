import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { testSupabaseConnection, testBasicSignUp } from "@/utils/supabaseTest";
import { useToast } from "@/hooks/use-toast";

export default function TestSupabase() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const { toast } = useToast();

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const testConnection = async () => {
    setIsLoading(true);
    addResult("Test de connexion en cours...");
    
    const result = await testSupabaseConnection();
    
    if (result.success) {
      addResult("✅ " + result.message);
      toast({
        title: "Test réussi",
        description: result.message,
      });
    } else {
      addResult("❌ " + result.error);
      toast({
        title: "Test échoué",
        description: result.error,
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const testSignUp = async () => {
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir l'email et le mot de passe",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    addResult(`Test d'inscription pour ${email}...`);
    
    const result = await testBasicSignUp(email, password);
    
    if (result.success) {
      addResult("✅ Inscription réussie");
      toast({
        title: "Test réussi",
        description: "L'inscription a fonctionné !",
      });
    } else {
      addResult("❌ " + result.error);
      toast({
        title: "Test échoué",
        description: result.error,
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test de Connexion Supabase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testConnection} 
              disabled={isLoading}
              className="w-full"
            >
              Tester la Connexion
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test d'Inscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-email">Email de test</Label>
              <Input
                id="test-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-password">Mot de passe</Label>
              <Input
                id="test-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
              />
            </div>
            <Button 
              onClick={testSignUp} 
              disabled={isLoading || !email || !password}
              className="w-full"
            >
              Tester l'Inscription
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Résultats des Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={clearResults} variant="outline" size="sm">
              Effacer les résultats
            </Button>
            <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500 italic">Aucun test effectué</p>
              ) : (
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono">
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}