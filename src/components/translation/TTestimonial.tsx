
import React from 'react';
import { useDeepLTranslation } from '@/hooks/useDeepLTranslation';

interface TTestimonialProps {
  name: string;
  role: string;
  content: string;
  className?: string;
}

export function TTestimonial({ name, role, content, className }: TTestimonialProps) {
  const { translatedText: translatedName } = useDeepLTranslation(name, {
    fallback: name,
  });
  
  const { translatedText: translatedRole } = useDeepLTranslation(role, {
    fallback: role,
  });
  
  const { translatedText: translatedContent } = useDeepLTranslation(content, {
    fallback: content,
  });

  return (
    <div className={className}>
      <div className="font-semibold">{translatedName}</div>
      <div className="text-sm text-gray-500 mb-2">{translatedRole}</div>
      <div className="text-gray-700 italic">"{translatedContent}"</div>
    </div>
  );
}
