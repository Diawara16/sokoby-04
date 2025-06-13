
import { render, screen, waitFor } from '@/components/ui/test-utils';
import SubscriptionDetails from '@/components/profile/SubscriptionDetails';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { supabase } from '@/lib/supabase';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ 
        data: { user: { id: '1' } } 
      }),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({ 
                data: { 
                  id: '1', 
                  status: 'active', 
                  current_period_end: '2024-12-31',
                  created_at: '2024-01-01' 
                }, 
                error: null 
              })
            }))
          }))
        }))
      }))
    }))
  }
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

describe('SubscriptionDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders subscription details', async () => {
    render(<SubscriptionDetails />);

    await waitFor(() => {
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });
  });
});
