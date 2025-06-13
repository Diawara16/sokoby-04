
import React from 'react';
import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/components/ui/test-utils';
import { PayPalButton } from '@/components/payments/PayPalButton';

// Mock PayPal
vi.mock('@paypal/react-paypal-js', () => ({
  PayPalButtons: ({ onApprove }: any) => (
    <button onClick={() => onApprove({ orderID: 'test-order' })}>
      PayPal Button
    </button>
  )
}));

describe('Payment Flow', () => {
  it('renders PayPal button correctly', () => {
    render(<PayPalButton amount="29.99" onSuccess={() => {}} onError={() => {}} />);
    
    expect(screen.getByText('PayPal Button')).toBeInTheDocument();
  });

  it('calls onSuccess when payment is approved', async () => {
    const onSuccess = vi.fn();
    render(<PayPalButton amount="29.99" onSuccess={onSuccess} onError={() => {}} />);
    
    const paypalButton = screen.getByText('PayPal Button');
    fireEvent.click(paypalButton);
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({ orderID: 'test-order' });
    });
  });
});
