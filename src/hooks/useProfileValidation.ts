
import { useState, useCallback } from 'react';

interface ValidationErrors {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
}

export const useProfileValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validatePhoneNumber = useCallback((phone: string): boolean => {
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone);
  }, []);

  const validateFullName = useCallback((name: string): boolean => {
    return name.trim().length >= 2;
  }, []);

  const validateProfile = useCallback((data: {
    fullName: string;
    phoneNumber: string;
    email?: string;
  }) => {
    const newErrors: ValidationErrors = {};

    if (!validateFullName(data.fullName)) {
      newErrors.fullName = 'Le nom complet doit contenir au moins 2 caractères';
    }

    if (!validatePhoneNumber(data.phoneNumber)) {
      newErrors.phoneNumber = 'Le numéro de téléphone n\'est pas valide';
    }

    if (data.email && !validateEmail(data.email)) {
      newErrors.email = 'L\'adresse email n\'est pas valide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateEmail, validatePhoneNumber, validateFullName]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateProfile,
    clearErrors,
    validateEmail,
    validatePhoneNumber,
    validateFullName,
  };
};
