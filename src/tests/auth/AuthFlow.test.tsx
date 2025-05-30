import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';

describe('Auth Flow', () => {
  it('renders login form', () => {
    render(
      <BrowserRouter>
        <AuthForm defaultIsSignUp={false} />
      </BrowserRouter>
    );
    expect(screen.getByRole('form')).toBeInTheDocument();
  });
});
