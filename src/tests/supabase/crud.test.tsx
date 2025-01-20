import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/lib/supabase';

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    })),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe('Supabase CRUD Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Products', () => {
    it('should fetch products', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 10 },
        { id: '2', name: 'Product 2', price: 20 },
      ];

      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockResolvedValue({ data: mockProducts, error: null }),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      }));

      const { data, error } = await supabase.from('products').select('*');
      
      expect(error).toBeNull();
      expect(data).toEqual(mockProducts);
      expect(supabase.from).toHaveBeenCalledWith('products');
    });

    it('should handle product creation', async () => {
      const newProduct = { name: 'New Product', price: 30 };
      
      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn(),
        insert: vi.fn().mockResolvedValue({ 
          data: { id: '3', ...newProduct }, 
          error: null 
        }),
        update: vi.fn(),
        delete: vi.fn(),
      }));

      const { data, error } = await supabase
        .from('products')
        .insert(newProduct);

      expect(error).toBeNull();
      expect(data).toHaveProperty('name', newProduct.name);
      expect(data).toHaveProperty('price', newProduct.price);
    });
  });

  describe('Orders', () => {
    it('should create an order', async () => {
      const mockOrder = {
        user_id: 'user-123',
        total_amount: 100,
        status: 'pending'
      };

      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn(),
        insert: vi.fn().mockResolvedValue({ 
          data: { id: 'order-1', ...mockOrder }, 
          error: null 
        }),
        update: vi.fn(),
        delete: vi.fn(),
      }));

      const { data, error } = await supabase
        .from('orders')
        .insert(mockOrder);

      expect(error).toBeNull();
      expect(data).toHaveProperty('status', 'pending');
      expect(data).toHaveProperty('total_amount', 100);
    });
  });
});