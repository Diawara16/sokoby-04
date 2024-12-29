import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface CouponSectionProps {
  couponCode: string;
  setCouponCode: (code: string) => void;
}

export const CouponSection = ({ couponCode, setCouponCode }: CouponSectionProps) => {
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const { toast } = useToast();

  const validateCoupon = async () => {
    if (!couponCode) return;
    
    setIsValidatingCoupon(true);
    try {
      const { data: coupons, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .single();

      if (error) throw error;

      if (!coupons) {
        toast({
          title: "Coupon invalide",
          description: "Ce code de réduction n'existe pas",
          variant: "destructive",
        });
        return;
      }

      const now = new Date();
      if (coupons.valid_until && new Date(coupons.valid_until) < now) {
        toast({
          title: "Coupon expiré",
          description: "Ce code de réduction a expiré",
          variant: "destructive",
        });
        return;
      }

      if (coupons.max_uses && coupons.current_uses >= coupons.max_uses) {
        toast({
          title: "Coupon épuisé",
          description: "Ce code de réduction a atteint son nombre maximum d'utilisations",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Coupon valide !",
        description: `Vous bénéficiez de ${coupons.discount_percent}% de réduction`,
      });

    } catch (error) {
      console.error('Erreur lors de la validation du coupon:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation du coupon",
        variant: "destructive",
      });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Code promo"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        className="flex-1"
      />
      <Button
        variant="outline"
        onClick={validateCoupon}
        disabled={!couponCode || isValidatingCoupon}
      >
        Valider
      </Button>
    </div>
  );
};