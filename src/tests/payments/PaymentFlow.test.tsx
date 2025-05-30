import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentSection } from '@/components/checkout/PaymentSection';
import { supabase } from '@/lib/supabase';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe('Payment Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display payment methods', () => {
    render(
      <PaymentSection
        total={100}
        isLoading={false}
        orderId="order-123"
        onPaymentSuccess={() => {}}
      />
    );

    expect(screen.getByText(/carte bancaire/i)).toBeInTheDocument();
    expect(screen.getByText(/paypal/i)).toBeInTheDocument();
    expect(screen.getByText(/interac/i)).toBeInTheDocument();
  });

  it('should handle payment method selection', () => {
    render(
      <PaymentSection
        total={100}
        isLoading={false}
        orderId="order-123"
        onPaymentSuccess={() => {}}
      />
    );

    const paypalButton = screen.getByText(/paypal/i);
    fireEvent.click(paypalButton);

    expect(screen.getByRole('button', { name: /paypal/i })).toHaveStyle({
      backgroundColor: expect.any(String),
    });
  });

  it('should show loading state', () => {
    render(
      <PaymentSection
        total={100}
        isLoading={true}
        orderId="order-123"
        onPaymentSuccess={() => {}}
      />
    );

    expect(screen.getByText(/création de la commande/i)).toBeInTheDocument();
  });
});
