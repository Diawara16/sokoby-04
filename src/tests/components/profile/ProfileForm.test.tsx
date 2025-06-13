
import React from 'react';
import { render, screen } from '@/components/ui/test-utils';
import { ProfileForm } from '@/components/profile/ProfileForm';

const mockProfile = {
  full_name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  company: 'Test Company',
  website: 'https://example.com'
};

describe('ProfileForm', () => {
  it('renders profile form fields', () => {
    render(<ProfileForm profile={mockProfile} onSave={() => {}} />);
    
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<ProfileForm profile={mockProfile} onSave={() => {}} />);
    
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });
});
