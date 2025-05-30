import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { supabase } from '@/lib/supabase';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

describe('Auth Error Handling', () => {
  const renderAuthForm = () => {
    return render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );
  };

  it('affiche une erreur pour un email invalide', async () => {
    renderAuthForm();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/adresse email invalide/i)).toBeInTheDocument();
    });
  });

  it('affiche une erreur pour des identifiants incorrects', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockRejectedValueOnce(
      new Error('Invalid login credentials')
    );

    renderAuthForm();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/identifiants invalides/i)).toBeInTheDocument();
    });
  });

  it('gère les erreurs réseau', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockRejectedValueOnce(
      new Error('Network error')
    );

    renderAuthForm();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/erreur de connexion/i)).toBeInTheDocument();
    });
  });
});
