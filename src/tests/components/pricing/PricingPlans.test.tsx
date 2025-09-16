
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/components/ui/test-utils';
import { PricingPlans } from '@/components/pricing/PricingPlans';

describe('PricingPlans', () => {
  const mockOnSubscribe = vi.fn();

  beforeEach(() => {
    mockOnSubscribe.mockClear();
  });

  it('renders all pricing plans', () => {
    render(<PricingPlans currentLanguage="fr" onSubscribe={mockOnSubscribe} />);
    
    expect(screen.getByText(/Essentiel/i)).toBeInTheDocument();
    expect(screen.getByText(/Pro/i)).toBeInTheDocument();
    expect(screen.getByText(/Premium/i)).toBeInTheDocument();
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
    
    expect(screen.getByText(/19/)).toBeInTheDocument();
    expect(screen.getByText(/39/)).toBeInTheDocument();
    expect(screen.getByText(/119/)).toBeInTheDocument();
  });

  it('shows features for each plan', () => {
    render(<PricingPlans currentLanguage="fr" onSubscribe={mockOnSubscribe} />);
    
    const featureLists = screen.getAllByRole('list');
    featureLists.forEach(list => {
      expect(list.children.length).toBeGreaterThan(0);
    });
  });
});
