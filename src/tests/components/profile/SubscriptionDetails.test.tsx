import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import SubscriptionDetails from '@/components/profile/SubscriptionDetails';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: '123' } } }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(),
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
  it('displays loading state initially', () => {
    render(<SubscriptionDetails />);
    expect(screen.getByText(/Détails de l'abonnement/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays subscription details when data is loaded', async () => {
    const mockSubscription = {
      status: 'active',
      current_period_end: '2025-01-01T00:00:00Z',
      created_at: '2024-01-01T00:00:00Z',
    };

    vi.mocked(supabase.from)().single.mockResolvedValue({
      data: mockSubscription,
      error: null,
    });

    render(<SubscriptionDetails />);

    await waitFor(() => {
      expect(screen.getByText('Actif')).toBeInTheDocument();
      expect(screen.getByText(/1 janvier 2025/i)).toBeInTheDocument();
      expect(screen.getByText(/1 janvier 2024/i)).toBeInTheDocument();
    });
  });

  it('displays error message when loading fails', async () => {
    const mockError = new Error('Failed to load subscription');
    vi.mocked(supabase.from)().single.mockResolvedValue({
      data: null,
      error: mockError,
    });

    const mockToast = vi.fn();
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: []
    });

    render(<SubscriptionDetails />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Erreur',
          variant: 'destructive',
        })
      );
    });
  });

  it('displays no subscription message when no data is found', async () => {
    vi.mocked(supabase.from)().single.mockResolvedValue({
      data: null,
      error: null,
    });

    render(<SubscriptionDetails />);

    await waitFor(() => {
      expect(screen.getByText(/Aucun abonnement actif/i)).toBeInTheDocument();
    });
  });
});