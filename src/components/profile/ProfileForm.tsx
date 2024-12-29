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
    <div className="w-full max-w-md mx-auto mt-8 space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-900">{t.profile.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder={t.profile.fullName}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Input
            type="tel"
            placeholder={t.profile.phoneNumber}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="w-full"
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
  );
};