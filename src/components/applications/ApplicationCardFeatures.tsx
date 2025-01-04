interface ApplicationCardFeaturesProps {
  features?: string[];
}

export function ApplicationCardFeatures({ features }: ApplicationCardFeaturesProps) {
  if (!features?.length) return null;

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">Fonctionnalités :</p>
      <ul className="text-sm text-muted-foreground space-y-1 max-h-32 overflow-y-auto">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            <span className="line-clamp-1">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}