import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DependentPhotoUploadProps {
  onPhotoChange: (file: File | null) => void;
  initialPreview?: string | null;
  dependentName: string;
}

const DependentPhotoUpload = ({ onPhotoChange, initialPreview, dependentName }: DependentPhotoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(initialPreview || null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setIsDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width!;
    canvas.height = crop.height!;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      crop.x! * scaleX,
      crop.y! * scaleY,
      crop.width! * scaleX,
      crop.height! * scaleY,
      0,
      0,
      crop.width!,
      crop.height!
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Canvas is empty');
        }
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleCropComplete = async () => {
    if (!imageRef.current || !tempImage) return;

    try {
      const croppedBlob = await getCroppedImg(imageRef.current, crop);
      const fileName = `${dependentName.toLowerCase().replace(/\s+/g, '-')}-photo.jpg`;
      const croppedFile = new File([croppedBlob], fileName, { type: 'image/jpeg' });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onPhotoChange(croppedFile);
      };
      reader.readAsDataURL(croppedFile);
      
      setIsDialogOpen(false);
      setTempImage(null);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-full overflow-hidden">
        {preview ? (
          <img
            src={preview}
            alt={`Foto de ${dependentName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-50">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
        id={`photo-upload-${dependentName}`}
      />
      <label
        htmlFor={`photo-upload-${dependentName}`}
        className="cursor-pointer text-sm text-primary hover:text-primary/80"
      >
        {preview ? "Alterar foto" : "Adicionar foto"}
      </label>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Recortar Foto de {dependentName}</DialogTitle>
          </DialogHeader>
          {tempImage && (
            <div className="flex flex-col gap-4">
              <div className="max-h-[60vh] overflow-auto">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  className="max-w-full"
                >
                  <img
                    ref={imageRef}
                    src={tempImage}
                    alt="Crop"
                    className="max-w-full"
                  />
                </ReactCrop>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setTempImage(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCropComplete}>
                  Confirmar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DependentPhotoUpload;