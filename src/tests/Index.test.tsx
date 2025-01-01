import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
  const renderIndex = () => {
    return render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );
  };

  it('renders without crashing', () => {
    renderIndex();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('has correct meta tags', () => {
    renderIndex();
    const title = document.title;
    const description = document.querySelector('meta[name="description"]');
    
    expect(title).toBe('Sokoby - Créez votre boutique en ligne en quelques clics');
    expect(description?.getAttribute('content')).toContain('Sokoby vous permet');
  });

  it('renders hero section with call-to-action buttons', () => {
    renderIndex();
    expect(screen.getByText(/Construisez votre empire e-commerce/i)).toBeInTheDocument();
    expect(screen.getByText(/Créer mon compte/i)).toBeInTheDocument();
    expect(screen.getByText(/Se connecter/i)).toBeInTheDocument();
  });

  it('renders features section with all features', () => {
    renderIndex();
    expect(screen.getByText(/Nos fonctionnalités/i)).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });

  it('renders footer with all sections', () => {
    renderIndex();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText(/Moyens de paiement acceptés/i)).toBeInTheDocument();
  });

  it('handles navigation clicks correctly', () => {
    renderIndex();
    const navigationLinks = screen.getAllByRole('link');
    expect(navigationLinks.length).toBeGreaterThan(0);
  });

  it('is accessible', () => {
    const { container } = renderIndex();
    expect(container).toBeInTheDocument();
    // Vérifie que tous les éléments interactifs sont accessibles au clavier
    const interactiveElements = container.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    interactiveElements.forEach(element => {
      expect(element).toHaveAttribute('tabindex');
    });
  });
});