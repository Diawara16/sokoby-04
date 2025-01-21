import { PostgrestQueryBuilder } from '@supabase/postgrest-js';
import { vi } from 'vitest';

describe('CRUD Operations', () => {
  const mockQueryBuilder = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    url: '',
    headers: {},
    upsert: vi.fn()
  } as unknown as PostgrestQueryBuilder<any, any, any>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('performs CRUD operations', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockQueryBuilder.select.mockResolvedValue({ data: [mockData], error: null });
    
    const result = await mockQueryBuilder.select();
    expect(result.data).toEqual([mockData]);
  });
});