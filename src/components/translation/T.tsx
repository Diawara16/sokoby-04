
import React from 'react';
import { useDeepLTranslation } from '@/hooks/useDeepLTranslation';

interface TProps {
  children: string;
  fallback?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  skipTranslation?: boolean;
}

export function T({ 
  children, 
  fallback, 
  className, 
  as: Component = 'span',
  skipTranslation = false,
  ...props 
}: TProps) {
  const { translatedText, isLoading } = useDeepLTranslation(children, {
    fallback,
    skipTranslation,
  });

  if (isLoading) {
    return (
      <Component className={`${className} opacity-70`} {...props}>
        {children}
      </Component>
    );
  }

  return (
    <Component className={className} {...props}>
      {translatedText}
    </Component>
  );
}

// Composants spécialisés pour différents éléments HTML
export const TH1 = (props: Omit<TProps, 'as'>) => <T as="h1" {...props} />;
export const TH2 = (props: Omit<TProps, 'as'>) => <T as="h2" {...props} />;
export const TH3 = (props: Omit<TProps, 'as'>) => <T as="h3" {...props} />;
export const TP = (props: Omit<TProps, 'as'>) => <T as="p" {...props} />;
export const TSpan = (props: Omit<TProps, 'as'>) => <T as="span" {...props} />;
