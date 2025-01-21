import { render, screen } from '@testing-library/react';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { BrowserRouter } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Mock des dépendances
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      upsert: jest.fn(),
      select: jest.fn(),
      url: '',
      headers: {},
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }))
  }
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn()
  }))
}));

describe('ProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile form', () => {
    render(
      <BrowserRouter>
        <ProfileForm />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('form')).toBeInTheDocument();
  });
});