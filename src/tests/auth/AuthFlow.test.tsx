
import React from 'react';
import { render, screen } from '@/components/ui/test-utils';
import { AuthForm } from '@/components/auth/AuthForm';

describe('Authentication Flow', () => {
  it('renders login form correctly', () => {
    render(<AuthForm mode="login" />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders register form correctly', () => {
    render(<AuthForm mode="register" />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });
});
