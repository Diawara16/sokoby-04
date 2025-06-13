
import { render, screen } from '@/components/ui/test-utils';
import { AuthForm } from '@/components/auth/AuthForm';

describe('Auth Flow', () => {
  it('renders login form', () => {
    render(<AuthForm defaultIsSignUp={false} />);
    expect(screen.getByRole('form')).toBeInTheDocument();
  });
});
