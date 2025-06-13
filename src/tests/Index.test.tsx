
import React from 'react';
import { render, screen } from '@/components/ui/test-utils';
import Index from '@/pages/Index';

describe('Index Page', () => {
  it('renders without crashing', () => {
    render(<Index />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
