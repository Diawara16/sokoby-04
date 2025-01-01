import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('has correct basic meta tags', () => {
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

  it('has correct Schema.org structured data', () => {
    renderIndex();
    const scriptTags = document.querySelectorAll('script[type="application/ld+json"]');
    const structuredData = JSON.parse(scriptTags[0].textContent || '{}');
    
    expect(structuredData['@context']).toBe('https://schema.org');
    expect(structuredData['@type']).toBe('WebSite');
    expect(structuredData.name).toBe('Sokoby');
    expect(structuredData.description).toContain('Plateforme de création');
    expect(structuredData.url).toBe('https://sokoby.com');
    expect(structuredData.publisher).toBeDefined();
    expect(structuredData.publisher.name).toBe('Sokoby');
    expect(structuredData.offers).toBeDefined();
    expect(structuredData.offers.priceCurrency).toBe('EUR');
  });

  it('renders main content sections', () => {
    renderIndex();
    expect(screen.getByText(/Construisez votre empire e-commerce/i)).toBeInTheDocument();
    expect(screen.getByText(/Créer mon compte/i)).toBeInTheDocument();
  });
});