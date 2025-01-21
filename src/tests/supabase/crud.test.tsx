import { supabase } from '@/lib/supabase';
import { vi } from 'vitest';

describe('CRUD Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch data successfully', async () => {
    const mockData = [{ id: 1, name: 'Test' }];
    
    const selectMock = vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: mockData, error: null })
    } as any);

    const { data, error } = await supabase
      .from('test')
      .select('*');

    expect(error).toBeNull();
    expect(data).toEqual(mockData);
    expect(selectMock).toHaveBeenCalledWith('test');
  });
});