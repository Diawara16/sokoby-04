import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Index from '../pages/Index';

// Mock des dépendances
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
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

  it('has correct meta tags', async () => {
    renderIndex();
    const title = document.title;
    const description = document.querySelector('meta[name="description"]');
    const keywords = document.querySelector('meta[name="keywords"]');
    const robots = document.querySelector('meta[name="robots"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    
    expect(title).toBe('Sokoby - Créez votre boutique en ligne en quelques clics');
    expect(description?.getAttribute('content')).toContain('Sokoby vous permet');
    expect(keywords?.getAttribute('content')).toContain('e-commerce');
    expect(robots?.getAttribute('content')).toContain('index, follow');
    expect(canonical?.getAttribute('href')).toBe('https://sokoby.com');
  });

  it('has correct Open Graph meta tags', () => {
    renderIndex();
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogType = document.querySelector('meta[property="og:type"]');
    
    expect(ogTitle?.getAttribute('content')).toContain('Sokoby');
    expect(ogDescription?.getAttribute('content')).toBeTruthy();
    expect(ogImage?.getAttribute('content')).toBe('/og-image.png');
    expect(ogType?.getAttribute('content')).toBe('website');
  });

  it('has correct Twitter Card meta tags', () => {
    renderIndex();
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    
    expect(twitterCard?.getAttribute('content')).toBe('summary_large_image');
    expect(twitterTitle?.getAttribute('content')).toContain('Sokoby');
    expect(twitterDescription?.getAttribute('content')).toBeTruthy();
    expect(twitterImage?.getAttribute('content')).toBe('/og-image.png');
  });

  it('has valid structured data', () => {
    renderIndex();
    const scriptTag = document.querySelector('script[type="application/ld+json"]');
    expect(scriptTag).toBeInTheDocument();
    
    const structuredData = JSON.parse(scriptTag?.textContent || '{}');
    expect(structuredData['@context']).toBe('https://schema.org');
    expect(structuredData['@type']).toBe('WebSite');
    expect(structuredData.name).toBe('Sokoby');
    expect(structuredData.publisher).toBeDefined();
    expect(structuredData.offers).toBeDefined();
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

  it('has optimized logo image', () => {
    renderIndex();
    const logo = screen.getByAltText('Logo Sokoby');
    expect(logo).toHaveAttribute('loading', 'eager');
    expect(logo).toHaveAttribute('fetchPriority', 'high');
    expect(logo).toHaveAttribute('decoding', 'async');
    expect(logo).toHaveAttribute('width');
    expect(logo).toHaveAttribute('height');
  });

  it('has correct ARIA roles for accessibility', () => {
    renderIndex();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('handles language changes correctly', async () => {
    renderIndex();
    const htmlTag = document.querySelector('html');
    expect(htmlTag?.getAttribute('lang')).toBe('fr');
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