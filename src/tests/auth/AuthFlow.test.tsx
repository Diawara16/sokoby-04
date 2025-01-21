import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { AuthFlow } from '@/components/auth/AuthFlow';
import { supabase } from '@/lib/supabase';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            user: {
              id: '123',
              email: 'test@example.com',
              app_metadata: {},
              user_metadata: {},
              aud: 'authenticated',
              created_at: '',
            },
            access_token: 'test-token',
            refresh_token: 'test-refresh',
            expires_in: 3600,
            token_type: 'bearer'
          }
        },
        error: null
      })
    }
  }
}));

describe('AuthFlow', () => {
  it('renders correctly', () => {
    render(<AuthFlow />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});