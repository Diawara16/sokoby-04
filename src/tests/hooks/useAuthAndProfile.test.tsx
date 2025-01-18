import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuthAndProfile } from '@/hooks/useAuthAndProfile';
import { supabase } from '@/lib/supabase';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    }),
  },
}));

describe('useAuthAndProfile', () => {
  it('returns initial state correctly', () => {
    const { result } = renderHook(() => useAuthAndProfile());
    
    expect(result.current).toEqual({
      isAuthenticated: false,
      isLoading: true,
      hasProfile: false,
      session: null,
      profile: null
    });
  });

  it('updates state when user is authenticated', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockProfile = { id: '123', email: 'test@example.com' };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    });
    
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      }),
    });

    const { result } = renderHook(() => useAuthAndProfile());

    await waitFor(() => {
      expect(result.current).toEqual({
        isAuthenticated: true,
        isLoading: false,
        hasProfile: true,
        session: expect.objectContaining({ user: mockUser }),
        profile: mockProfile
      });
    });
  });

  it('handles authentication errors correctly', async () => {
    const mockError = new Error('Auth error');
    vi.mocked(supabase.auth.getSession).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthAndProfile());

    await waitFor(() => {
      expect(result.current).toEqual({
        isAuthenticated: false,
        isLoading: false,
        hasProfile: false,
        session: null,
        profile: null
      });
    });
  });
});