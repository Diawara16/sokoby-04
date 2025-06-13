
import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/components/ui/test-utils';
import { AuthForm } from '@/components/auth/AuthForm';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
    }
  }
}));

describe('Auth Error Handling', () => {
  it('displays error message when signup fails', async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    
    (supabase.auth.signUp as any).mockResolvedValue({
      data: null,
      error: { message: 'Email already registered' }
    });

    render(<AuthForm mode="register" />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email already registered')).toBeInTheDocument();
    });
  });
});
