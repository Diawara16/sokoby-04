
import React from 'react';
import { useDeepLTranslation } from '@/hooks/useDeepLTranslation';

interface TFeatureListProps {
  features: string[];
  className?: string;
  iconComponent?: React.ReactNode;
}

export function TFeatureList({ features, className, iconComponent }: TFeatureListProps) {
  return (
    <ul className={className}>
      {features.map((feature, index) => (
        <TFeatureItem 
          key={index} 
          feature={feature} 
          iconComponent={iconComponent}
        />
      ))}
    </ul>
  );
}

function TFeatureItem({ feature, iconComponent }: { feature: string; iconComponent?: React.ReactNode }) {
  const { translatedText } = useDeepLTranslation(feature, {
    fallback: feature,
  });

  return (
    <li className="flex items-start">
      {iconComponent}
      <span>{translatedText}</span>
    </li>
  );
}
