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
      user: null,
    });
  });

  it('updates state when user is authenticated', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockProfile = { id: '123', email: 'test@example.com' };
    
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: mockUser } },
    });
    
    (supabase.from as jest.Mock)().single.mockResolvedValue({
      data: mockProfile,
      error: null,
    });

    const { result } = renderHook(() => useAuthAndProfile());

    await waitFor(() => {
      expect(result.current).toEqual({
        isAuthenticated: true,
        isLoading: false,
        hasProfile: true,
        user: mockUser,
      });
    });
  });

  it('handles authentication errors correctly', async () => {
    const mockError = new Error('Auth error');
    (supabase.auth.getSession as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthAndProfile());

    await waitFor(() => {
      expect(result.current).toEqual({
        isAuthenticated: false,
        isLoading: false,
        hasProfile: false,
        user: null,
      });
    });
  });

  it('handles profile loading errors correctly', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: mockUser } },
    });
    
    (supabase.from as jest.Mock)().single.mockResolvedValue({
      data: null,
      error: new Error('Profile error'),
    });

    const { result } = renderHook(() => useAuthAndProfile());

    await waitFor(() => {
      expect(result.current).toEqual({
        isAuthenticated: true,
        isLoading: false,
        hasProfile: false,
        user: mockUser,
      });
    });
  });
});