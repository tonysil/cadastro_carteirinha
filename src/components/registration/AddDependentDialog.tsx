import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DependentPhotoUpload from "../DependentPhotoUpload";
import ReactCrop from "react-image-crop";

interface AddDependentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newDependent: {
    name: string;
    rg: string;
    cpf: string;
    photo: File | null;
    photo_url: string | null;
    company: string;
    association_date: string;
    expiration_date: string;
  };
  handlePhotoChange: (file: File | null) => void;
  handleAddDependent: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  associateInfo?: {
    company: string;
    association_date: string;
    expiration_date: string;
  };
  cropModalOpen: boolean;
  setCropModalOpen: (open: boolean) => void;
  selectedImage: string | null;
  crop: any;
  setCrop: React.Dispatch<React.SetStateAction<any>>;
  imgRef: React.RefObject<HTMLImageElement>;
  handleCropComplete: () => void;
  handleCropSave: () => void;
}

const AddDependentDialog = ({
  open,
  onOpenChange,
  newDependent,
  handlePhotoChange,
  handleAddDependent,
  handleInputChange,
  associateInfo,
  cropModalOpen,
  setCropModalOpen,
  selectedImage,
  crop,
  setCrop,
  imgRef,
  handleCropComplete,
  handleCropSave,
}: AddDependentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Dependente</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center">
            <DependentPhotoUpload
              onPhotoChange={handlePhotoChange}
              initialPreview={newDependent.photo_url}
              dependentName={newDependent.name || "Novo Dependente"}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              value={newDependent.name}
              onChange={handleInputChange}
              placeholder="Nome do dependente"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rg">RG</Label>
            <Input
              id="rg"
              name="rg"
              value={newDependent.rg}
              onChange={handleInputChange}
              placeholder="RG do dependente"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              name="cpf"
              value={newDependent.cpf}
              onChange={handleInputChange}
              placeholder="CPF do dependente"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              name="company"
              value={associateInfo?.company || newDependent.company}
              onChange={handleInputChange}
              placeholder="Empresa"
              readOnly
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="association_date">Data de Associação</Label>
            <Input
              id="association_date"
              name="association_date"
              type="date"
              value={associateInfo?.association_date || newDependent.association_date}
              onChange={handleInputChange}
              readOnly
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expiration_date">Data de Vencimento</Label>
            <Input
              id="expiration_date"
              name="expiration_date"
              type="date"
              value={associateInfo?.expiration_date || newDependent.expiration_date}
              onChange={handleInputChange}
              readOnly
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleAddDependent}>Adicionar</Button>
        </div>
      </DialogContent>
      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent className="max-w-[650px] h-[450px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Recortar Imagem do Dependente</DialogTitle>
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

export default AddDependentDialog;