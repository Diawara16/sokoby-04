import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialMediaSettingsProps {
  socialMedia: {
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    linkedin: string | null;
    youtube: string | null;
  };
  onChange: (field: string, value: any) => void;
}

export const SocialMediaSettings = ({ socialMedia, onChange }: SocialMediaSettingsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="facebook">Facebook</Label>
        <Input
          id="facebook"
          value={socialMedia.facebook || ''}
          onChange={(e) =>
            onChange('social_media', { ...socialMedia, facebook: e.target.value })
          }
          placeholder="https://facebook.com/votre-page"
        />
      </div>

      <div>
        <Label htmlFor="instagram">Instagram</Label>
        <Input
          id="instagram"
          value={socialMedia.instagram || ''}
          onChange={(e) =>
            onChange('social_media', { ...socialMedia, instagram: e.target.value })
          }
          placeholder="https://instagram.com/votre-compte"
        />
      </div>

      <div>
        <Label htmlFor="twitter">Twitter</Label>
        <Input
          id="twitter"
          value={socialMedia.twitter || ''}
          onChange={(e) =>
            onChange('social_media', { ...socialMedia, twitter: e.target.value })
          }
          placeholder="https://twitter.com/votre-compte"
        />
      </div>

      <div>
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input
          id="linkedin"
          value={socialMedia.linkedin || ''}
          onChange={(e) =>
            onChange('social_media', { ...socialMedia, linkedin: e.target.value })
          }
          placeholder="https://linkedin.com/company/votre-entreprise"
        />
      </div>

      <div>
        <Label htmlFor="youtube">YouTube</Label>
        <Input
          id="youtube"
          value={socialMedia.youtube || ''}
          onChange={(e) =>
            onChange('social_media', { ...socialMedia, youtube: e.target.value })
          }
          placeholder="https://youtube.com/votre-chaine"
        />
      </div>
    </div>
  );
};