export interface Referral {
  id: string;
  referrer_id: string;
  referred_id?: string;
  code: string;
  status: 'pending' | 'converted' | 'expired';
  reward_claimed: boolean;
  created_at: string;
  converted_at?: string;
}