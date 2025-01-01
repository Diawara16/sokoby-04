import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Index from '../pages/Index';

// Mock des dépendances
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn((callback) => {
        callback('SIGNED_IN', { user: { id: '1' } });
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
    },
  },
}));

describe('Index Page', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );
    
    // Vérifie que les éléments principaux sont présents
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('has correct meta tags', () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );
    
    // Vérifie les meta tags SEO
    const title = document.title;
    const description = document.querySelector('meta[name="description"]');
    
    expect(title).toBe('Sokoby - Créez votre boutique en ligne en quelques clics');
    expect(description?.getAttribute('content')).toContain('Sokoby vous permet');
  });
});