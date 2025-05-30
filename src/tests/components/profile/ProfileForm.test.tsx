import { render, screen } from '@testing-library/react';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { vi, describe, it, expect } from 'vitest';

describe('ProfileForm', () => {
  const defaultProps = {
    user: {
      id: 'user-1',
      email: 'test@example.com',
      fullName: 'Test User',
    },
    onSave: vi.fn(),
    isSaving: false,
    error: null,
  };

  it('renders form fields with user data', () => {
    render(<ProfileForm {...defaultProps} />);
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/nom complet/i)).toHaveValue('Test User');
  });

  it('calls onSave when form is submitted', () => {
    render(<ProfileForm {...defaultProps} />);
    const saveButton = screen.getByRole('button', { name: /enregistrer/i });
    saveButton.click();
    expect(defaultProps.onSave).toHaveBeenCalled();
  });

  it('disables save button when saving', () => {
    render(<ProfileForm {...defaultProps} isSaving={true} />);
    const saveButton = screen.getByRole('button', { name: /enregistrer/i });
    expect(saveButton).toBeDisabled();
  });

  it('displays error message when error prop is set', () => {
    render(<ProfileForm {...defaultProps} error="Erreur lors de la sauvegarde" />);
    expect(screen.getByText(/erreur lors de la sauvegarde/i)).toBeInTheDocument();
  });
});
