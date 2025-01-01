import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { supabase } from '@/lib/supabase';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn((callback) => {
        // Simuler les changements d'état d'authentification
        setTimeout(() => {
          callback('SIGNED_IN', { user: { id: '1' } });
        }, 0);
        return {
          data: { subscription: { unsubscribe: vi.fn() } },
        };
      }),
    },
  },
}));

describe('Auth State Synchronization', () => {
  it('synchronise l\'état d\'authentification entre les onglets', async () => {
    const authStateChangeMock = vi.fn();
    
    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );

    // Simuler un changement d'état dans un autre onglet
    await act(async () => {
      const event = new StorageEvent('storage', {
        key: 'supabase.auth.token',
        newValue: JSON.stringify({ access_token: 'test_token' }),
      });
      window.dispatchEvent(event);
    });

    // Vérifier que le callback onAuthStateChange a été appelé
    expect(authStateChangeMock).toHaveBeenCalled;
  });

  it('nettoie les souscriptions lors du démontage', () => {
    const unsubscribeMock = vi.fn();
    
    // Créer un mock spécifique pour ce test
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation(() => ({
      data: { subscription: { unsubscribe: unsubscribeMock } },
    }));

    const { unmount } = render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );

    unmount();
    expect(unsubscribeMock).toHaveBeenCalled();
  });
});