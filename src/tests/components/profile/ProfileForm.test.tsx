import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: '123' } } }),
    },
    from: vi.fn().mockReturnValue({
      upsert: vi.fn().mockReturnValue({ error: null }),
    }),
  },
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn().mockReturnValue({
    toast: vi.fn(),
  }),
}));

describe('ProfileForm', () => {
  it('renders the form correctly', () => {
    render(<ProfileForm />);
    
    expect(screen.getByLabelText(/Nom complet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Téléphone/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mettre à jour/i })).toBeInTheDocument();
  });

  it('handles form submission successfully', async () => {
    const mockToast = vi.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });

    render(<ProfileForm />);

    const nameInput = screen.getByLabelText(/Nom complet/i);
    const phoneInput = screen.getByLabelText(/Téléphone/i);
    const submitButton = screen.getByRole('button', { name: /Mettre à jour/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(phoneInput, { target: { value: '+33612345678' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.any(String),
          description: expect.any(String),
        })
      );
    });
  });

  it('handles form submission error', async () => {
    const mockError = new Error('Test error');
    (supabase.from as jest.Mock).mockReturnValue({
      upsert: vi.fn().mockReturnValue({ error: mockError }),
    });

    const mockToast = vi.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });

    render(<ProfileForm />);

    const submitButton = screen.getByRole('button', { name: /Mettre à jour/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
        })
      );
    });
  });
});