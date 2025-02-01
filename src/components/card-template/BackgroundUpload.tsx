import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface BackgroundUploadProps {
  backgroundImage: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BackgroundUpload: React.FC<BackgroundUploadProps> = ({
  backgroundImage,
  onImageUpload,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Imagem de Fundo</h2>
      <div className="space-y-4">
        <Input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
          id="background-upload"
        />
        <Label
          htmlFor="background-upload"
          className="flex items-center gap-2 cursor-pointer w-fit"
        >
          <Button variant="outline" asChild>
            <span>
              <Upload className="w-4 h-4 mr-2" />
              Upload de Imagem
            </span>
          </Button>
        </Label>
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt="Preview"
            className="max-w-full h-auto rounded-lg border shadow-sm"
          />
        )}
      </div>
    </div>
  );
};