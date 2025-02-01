import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DependentPhotoUpload from "../DependentPhotoUpload";

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
}

const AddDependentDialog = ({
  open,
  onOpenChange,
  newDependent,
  handlePhotoChange,
  handleAddDependent,
  handleInputChange,
  associateInfo,
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
    </Dialog>
  );
};

export default AddDependentDialog;