import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';

interface AuthFormProps {
  onSubmit: () => void;
}

describe('Auth Flow', () => {
  it('renders login form', () => {
    render(
      <BrowserRouter>
        <AuthForm onSubmit={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getByRole('form')).toBeInTheDocument();
  });
});