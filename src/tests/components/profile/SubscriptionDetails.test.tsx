
import React from 'react';
import { render, screen, waitFor } from '@/components/ui/test-utils';
import { SubscriptionDetails } from '@/components/profile/SubscriptionDetails';

const mockSubscription = {
  id: 'sub_123',
  status: 'active',
  plan: 'pro',
  current_period_end: '2024-12-31',
  cancel_at_period_end: false
};

describe('SubscriptionDetails', () => {
  it('renders subscription information', async () => {
    render(<SubscriptionDetails subscription={mockSubscription} />);
    
    await waitFor(() => {
      expect(screen.getByText('Pro Plan')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  it('shows cancel button for active subscriptions', async () => {
    render(<SubscriptionDetails subscription={mockSubscription} />);
    
    await waitFor(() => {
      expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    });
  });
});
