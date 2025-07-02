import React from 'react';
import { useDeepLTranslation } from '@/hooks/useDeepLTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function TCard({ title, description, children, className }: TCardProps) {
  const { translatedText: translatedTitle } = useDeepLTranslation(title, {
    fallback: title,
  });
  
  const { translatedText: translatedDescription } = useDeepLTranslation(description || '', {
    fallback: description,
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{translatedTitle}</CardTitle>
        {description && <CardDescription>{translatedDescription}</CardDescription>}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
}