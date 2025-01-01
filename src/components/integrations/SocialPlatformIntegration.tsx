import { socialPlatforms } from './config/platforms';
import { usePlatformIntegration } from './hooks/usePlatformIntegration';
import { PlatformCard } from './PlatformCard';

export const SocialPlatformIntegration = () => {
  const { isLoading, handleIntegration } = usePlatformIntegration();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {socialPlatforms.map((platform) => (
        <PlatformCard
          key={platform.name}
          platform={platform}
          isLoading={isLoading[platform.name]}
          onIntegrate={handleIntegration}
        />
      ))}
    </div>
  );
};