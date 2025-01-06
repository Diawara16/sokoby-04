import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

interface SocialMediaSettingsProps {
  socialMedia: {
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    linkedin: string | null;
    youtube: string | null;
  };
  onChange: (field: string, value: string) => void;
}

export const SocialMediaSettings = ({ socialMedia, onChange }: SocialMediaSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Facebook className="h-5 w-5 text-blue-600" />
        <div className="flex-1">
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            value={socialMedia.facebook || ""}
            onChange={(e) => onChange("social_media.facebook", e.target.value)}
            placeholder="https://facebook.com/votre-page"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Instagram className="h-5 w-5 text-pink-600" />
        <div className="flex-1">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            value={socialMedia.instagram || ""}
            onChange={(e) => onChange("social_media.instagram", e.target.value)}
            placeholder="https://instagram.com/votre-compte"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Twitter className="h-5 w-5 text-blue-400" />
        <div className="flex-1">
          <Label htmlFor="twitter">Twitter</Label>
          <Input
            id="twitter"
            value={socialMedia.twitter || ""}
            onChange={(e) => onChange("social_media.twitter", e.target.value)}
            placeholder="https://twitter.com/votre-compte"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Linkedin className="h-5 w-5 text-blue-700" />
        <div className="flex-1">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={socialMedia.linkedin || ""}
            onChange={(e) => onChange("social_media.linkedin", e.target.value)}
            placeholder="https://linkedin.com/company/votre-entreprise"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Youtube className="h-5 w-5 text-red-600" />
        <div className="flex-1">
          <Label htmlFor="youtube">YouTube</Label>
          <Input
            id="youtube"
            value={socialMedia.youtube || ""}
            onChange={(e) => onChange("social_media.youtube", e.target.value)}
            placeholder="https://youtube.com/c/votre-chaine"
          />
        </div>
      </div>
    </div>
  );
};