import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditPersonalInfoForm from "./EditPersonalInfoForm";
import { useEditAssociate } from "@/hooks/useEditAssociate";
import ReactCrop from "react-image-crop";

interface Associate {
  id: string;
  name: string;
  rg: string;
  cpf: string;
  role: string;
  company: string;
  association_date: string;
  expiration_date: string;
  photo_url?: string | null;
}

interface EditAssociateDialogProps {
  associate: Associate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  cropModalOpen: boolean;
  setCropModalOpen: (open: boolean) => void;
  selectedImage: string | null;
  crop: any;
  setCrop: (crop: any) => void;
  imgRef: React.RefObject<HTMLImageElement>;
  handleCropComplete: () => void;
  handleCropSave: () => void;
}

const EditAssociateDialog = ({
  associate,
  open,
  onOpenChange,
  onSuccess,
  cropModalOpen,
  setCropModalOpen,
  selectedImage,
  crop,
  setCrop,
  imgRef,
  handleCropComplete,
  handleCropSave,
}: EditAssociateDialogProps) => {
  const {
    formData,
    handleInputChange,
    handlePhotoChange,
    handleSubmit,
  } = useEditAssociate(associate, onSuccess);

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Associado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <EditPersonalInfoForm
            formData={formData}
            handleInputChange={handleInputChange}
            handlePhotoChange={handlePhotoChange}
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </DialogContent>

      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent className="max-w-[650px] h-[450px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Recortar Imagem do Associado</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedImage && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={handleCropComplete}
              >
                <img
                  ref={imgRef}
                  src={selectedImage}
                  alt="Crop"
                  className="max-h-[350px] w-auto"
                />
              </ReactCrop>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setCropModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCropSave}>
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default EditAssociateDialog;