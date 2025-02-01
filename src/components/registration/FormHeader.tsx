import React from 'react';
import { Camera } from 'lucide-react';

interface FormHeaderProps {
  onPhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  photoPreview: string | null;
}

const FormHeader = ({ onPhotoSelect, photoPreview }: FormHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Cadastro de Associado</h1>
        <p className="text-muted-foreground">
          Preencha os dados do associado
        </p>
      </div>
      <div className="flex justify-center">
        <div className="relative h-32 w-32">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Preview"
              className="h-full w-full object-cover rounded-full"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-muted flex items-center justify-center">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <label
            htmlFor="photo-upload"
            className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/90"
          >
            <Camera className="h-5 w-5 text-white" />
            <input
              type="file"
              id="photo-upload"
              className="hidden"
              accept="image/*"
              onChange={onPhotoSelect}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;