import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SubscriptionDetails } from '@/components/profile/SubscriptionDetails';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn()
        })
      })
    }),
  },
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn().mockReturnValue({
    toast: vi.fn(),
    dismiss: vi.fn(),
    toasts: []
  }),
}));

describe('SubscriptionDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays subscription details when data is loaded', async () => {
    const mockSubscription = {
      id: '123',
      status: 'active',
      current_period_end: '2024-02-01T00:00:00Z',
      created_at: '2024-01-01T00:00:00Z',
    };

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockSubscription, error: null })
        })
      })
    });

    render(<SubscriptionDetails />);

    expect(await screen.findByText(/active/i)).toBeInTheDocument();
    expect(screen.getByText(/February 1, 2024/)).toBeInTheDocument();
  });

  it('displays error message when loading fails', async () => {
    const mockError = new Error('Failed to load subscription');
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: mockError })
        })
      })
    });

    const mockToast = vi.fn();
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: []
    });

    render(<SubscriptionDetails />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to load subscription details',
        variant: 'destructive',
      });
    });
  });

  it('displays no subscription message when no data is found', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null })
        })
      })
    });

    render(<SubscriptionDetails />);

    expect(await screen.findByText(/No subscription found/i)).toBeInTheDocument();
  });
});