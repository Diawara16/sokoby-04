
import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent } from '@/components/ui/test-utils';
import { PricingPlans } from '@/components/pricing/PricingPlans';

describe('PricingPlans', () => {
  const mockOnSubscribe = vi.fn();

  beforeEach(() => {
    mockOnSubscribe.mockClear();
  });

  it('renders all pricing plans', () => {
    render(<PricingPlans currentLanguage="en" onSubscribe={mockOnSubscribe} />);
    
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('calls onSubscribe when subscribe button is clicked', () => {
    render(<PricingPlans currentLanguage="en" onSubscribe={mockOnSubscribe} />);
    
    const subscribeButtons = screen.getAllByText(/subscribe/i);
    fireEvent.click(subscribeButtons[0]);
    
    expect(mockOnSubscribe).toHaveBeenCalled();
  });
});
