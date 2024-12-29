import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';
import { translations } from "@/translations";

export const ProfileForm = () => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const currentLanguage = localStorage.getItem('currentLanguage') || 'fr';
  const t = translations[currentLanguage as keyof typeof translations];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error(t.auth.errorDescription);

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          phone_number: phoneNumber,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: t.profile.success,
        description: t.profile.success,
      });
    } catch (error: any) {
      toast({
        title: t.profile.error,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-16">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Mon Profil</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              {t.profile.fullName}
            </label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full"
              placeholder={t.profile.fullName}
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              {t.profile.phoneNumber}
            </label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full"
              placeholder={t.profile.phoneNumber}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white" 
            disabled={isLoading}
          >
            {isLoading ? t.profile.updating : t.profile.update}
          </Button>
        </form>
      </div>
    </div>
  );
};