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
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Mon Profil
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="fullName" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t.profile.fullName}
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full shadow-sm"
                placeholder={t.profile.fullName}
              />
            </div>
            <div>
              <label 
                htmlFor="phoneNumber" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t.profile.phoneNumber}
              </label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full shadow-sm"
                placeholder={t.profile.phoneNumber}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-600 text-white py-3" 
              disabled={isLoading}
            >
              {isLoading ? t.profile.updating : t.profile.update}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};