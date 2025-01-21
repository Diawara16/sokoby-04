import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';

describe('Auth Flow', () => {
  it('renders auth form correctly', () => {
    render(
      <BrowserRouter>
        <AuthForm mode="signin" />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});