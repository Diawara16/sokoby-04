import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Trash } from "lucide-react";

interface PhotoUploadProps {
  maxFiles?: number;
  onPhotosChange: (files: File[]) => void;
}

export const PhotoUpload = ({
  maxFiles = 4,
  onPhotosChange,
}: PhotoUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prev) => {
      const newFiles = [...prev, ...files].slice(0, maxFiles);
      onPhotosChange(newFiles);
      return newFiles;
    });
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      onPhotosChange(newFiles);
      return newFiles;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => document.getElementById("photo-upload")?.click()}
        >
          <Image className="h-4 w-4 mr-2" />
          Ajouter des photos
        </Button>
        <Input
          type="file"
          id="photo-upload"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={selectedFiles.length >= maxFiles}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="h-full w-full rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1"
                onClick={() => handleRemoveFile(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};