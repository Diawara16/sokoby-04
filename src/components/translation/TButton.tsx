import React from 'react';
import { useDeepLTranslation } from '@/hooks/useDeepLTranslation';
import { Button, ButtonProps } from '@/components/ui/button';

interface TButtonProps extends Omit<ButtonProps, 'children'> {
  children: string;
  fallback?: string;
}

export function TButton({ children, fallback, ...props }: TButtonProps) {
  const { translatedText } = useDeepLTranslation(children, {
    fallback: fallback || children,
  });

  return (
    <Button {...props}>
      {translatedText}
    </Button>
  );
}