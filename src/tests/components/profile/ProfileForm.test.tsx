
import { render, screen } from '@testing-library/react';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { vi, describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ 
        data: { user: { id: '1', email: 'test@example.com' } } 
      }),
    },
    from: vi.fn(() => ({
      upsert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

// Mock useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

describe('ProfileForm', () => {
  const renderProfileForm = () => {
    return render(
      <BrowserRouter>
        <ProfileForm />
      </BrowserRouter>
    );
  };

  it('renders form fields correctly', () => {
    renderProfileForm();
    expect(screen.getByLabelText(/nom complet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/numéro de téléphone/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderProfileForm();
    const submitButton = screen.getByRole('button', { name: /mettre à jour/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('has proper form structure', () => {
    renderProfileForm();
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });
});
