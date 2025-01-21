import { render, screen, waitFor } from '@testing-library/react';
import SubscriptionDetails from '@/components/profile/SubscriptionDetails';
import { BrowserRouter } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
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

describe('SubscriptionDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders subscription details', async () => {
    render(
      <BrowserRouter>
        <SubscriptionDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });
  });
});