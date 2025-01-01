import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { ImagePlus, Trash } from "lucide-react";

interface PhotoUploadProps {
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  maxFiles?: number;
}

export const PhotoUpload = ({ 
  selectedFiles, 
  setSelectedFiles, 
  maxFiles = 4 
}: PhotoUploadProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles([...selectedFiles, ...files].slice(0, maxFiles));
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <FormLabel>Photos (optionnel)</FormLabel>
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("photo-upload")?.click()}
          disabled={selectedFiles.length >= maxFiles}
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          Ajouter des photos
        </Button>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={selectedFiles.length >= maxFiles}
        />
        <span className="text-sm text-gray-500">
          {selectedFiles.length}/{maxFiles} photos
        </span>
      </div>
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="rounded-lg object-cover w-full h-full"
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