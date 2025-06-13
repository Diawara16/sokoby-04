
import React from 'react';
import { render, screen, fireEvent } from '@/components/ui/test-utils';
import { ApplicationCard } from '@/components/applications/ApplicationCard';

const mockApp = {
  id: '1',
  name: 'Test App',
  description: 'Test Description',
  icon: 'test-icon',
  category: 'productivity',
  price: 'Free',
  rating: 4.5,
  reviews: 100,
  features: ['Feature 1', 'Feature 2'],
  screenshots: [],
  isInstalled: false
};

describe('ApplicationCard', () => {
  it('renders application information correctly', () => {
    render(<ApplicationCard app={mockApp} onInstall={() => {}} />);
    
    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('calls onInstall when install button is clicked', () => {
    const onInstall = vi.fn();
    render(<ApplicationCard app={mockApp} onInstall={onInstall} />);
    
    const installButton = screen.getByText('Installer');
    fireEvent.click(installButton);
    
    expect(onInstall).toHaveBeenCalledWith(mockApp.id);
  });
});
