import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from '@/components/cart/CartContext';
import { CartProvider } from '@/components/cart/CartContext';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/auth';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

describe('Cart Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add item to cart', async () => {
    const mockUser: User = {
      id: 'user-123',
      email: 'test@example.com',
      app_metadata: {
        provider: 'email',
        providers: ['email']
      },
      user_metadata: {
        email: 'test@example.com',
        email_verified: false,
        phone_verified: false,
        sub: 'user-123'
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role: 'authenticated'
    };

    vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    const mockProduct = {
      id: 'product-123',
      name: 'Test Product',
      price: 10,
      quantity: 1,
    };

    await act(async () => {
      await result.current.addItemToCart(mockProduct.id);
    });

    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.total).toBe(10);
  });

  it('should remove item from cart', async () => {
    const mockUser: User = {
      id: 'user-123',
      email: 'test@example.com',
      app_metadata: {
        provider: 'email',
        providers: ['email']
      },
      user_metadata: {
        email: 'test@example.com',
        email_verified: false,
        phone_verified: false,
        sub: 'user-123'
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role: 'authenticated'
    };

    vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    const mockProduct = {
      id: 'product-123',
      name: 'Test Product',
      price: 10,
      quantity: 1,
    };

    await act(async () => {
      await result.current.addItemToCart(mockProduct.id);
      await result.current.removeFromCart(mockProduct.id);
    });

    expect(result.current.state.items).toHaveLength(0);
    expect(result.current.state.total).toBe(0);
  });
});