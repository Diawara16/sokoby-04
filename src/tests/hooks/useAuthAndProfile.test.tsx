import { renderHook } from '@testing-library/react';
import { useAuthAndProfile } from '@/hooks/useAuthAndProfile';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn(),
      url: '',
      headers: {},
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn()
    }))
  }
}));

describe('useAuthAndProfile', () => {
  it('handles authentication state', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString()
    };

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: mockUser } });

    const { result } = renderHook(() => useAuthAndProfile());
    expect(result.current.isLoading).toBe(true);
  });
});