import { render, screen, fireEvent } from '@testing-library/react';
import { ApplicationCard } from '@/components/applications/ApplicationCard';
import { Settings } from 'lucide-react';
import { vi, describe, it, expect } from 'vitest';

describe('ApplicationCard', () => {
  const defaultProps = {
    name: 'Test App',
    description: 'Test Description',
    icon: Settings,
    isConnected: false,
    onConnect: vi.fn(),
    onDisconnect: vi.fn(),
    isLoading: false,
    features: ['Feature 1', 'Feature 2'],
    price: {
      monthly: 10,
      annual: 100
    }
  };

  it('renders correctly with all props', () => {
    render(<ApplicationCard {...defaultProps} />);
    
    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('10€/mois')).toBeInTheDocument();
  });

  it('shows loading state correctly', () => {
    render(<ApplicationCard {...defaultProps} isLoading={true} />);
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('handles connect button click', () => {
    render(<ApplicationCard {...defaultProps} />);
    fireEvent.click(screen.getByText('Connecter'));
    expect(defaultProps.onConnect).toHaveBeenCalled();
  });

  it('handles disconnect button click when connected', () => {
    render(<ApplicationCard {...defaultProps} isConnected={true} />);
    fireEvent.click(screen.getByText('Déconnecter'));
    expect(defaultProps.onDisconnect).toHaveBeenCalled();
  });

  it('shows correct status badge when connected', () => {
    render(<ApplicationCard {...defaultProps} isConnected={true} status="active" />);
    expect(screen.getByText('Connecté')).toBeInTheDocument();
  });

  it('shows error status correctly', () => {
    render(<ApplicationCard {...defaultProps} isConnected={true} status="error" />);
    expect(screen.getByText('Erreur')).toBeInTheDocument();
  });
});
