import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PricingPlans } from '@/components/pricing/PricingPlans';

describe('PricingPlans', () => {
  const mockOnSubscribe = vi.fn();

  beforeEach(() => {
    mockOnSubscribe.mockClear();
  });

  it('renders all pricing plans', () => {
    render(<PricingPlans currentLanguage="fr" onSubscribe={mockOnSubscribe} />);
    
    expect(screen.getByText(/Starter/i)).toBeInTheDocument();
    expect(screen.getByText(/Pro/i)).toBeInTheDocument();
    expect(screen.getByText(/Enterprise/i)).toBeInTheDocument();
  });

  it('calls onSubscribe with correct parameters when subscribing', () => {
    render(<PricingPlans currentLanguage="fr" onSubscribe={mockOnSubscribe} />);
    
    const subscribeButton = screen.getAllByRole('button', { name: /S'abonner/i })[0];
    fireEvent.click(subscribeButton);
    
    expect(mockOnSubscribe).toHaveBeenCalledWith(
      'starter',
      'card',
      undefined
    );
  });

  it('displays prices in correct format', () => {
    render(<PricingPlans currentLanguage="fr" onSubscribe={mockOnSubscribe} />);
    
    const priceElements = screen.getAllByText(/€\/mois/i);
    expect(priceElements.length).toBeGreaterThan(0);
  });

  it('shows features for each plan', () => {
    render(<PricingPlans currentLanguage="fr" onSubscribe={mockOnSubscribe} />);
    
    const featureLists = screen.getAllByRole('list');
    featureLists.forEach(list => {
      expect(list.children.length).toBeGreaterThan(0);
    });
  });
});