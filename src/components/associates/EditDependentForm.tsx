import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DependentPhotoUpload from "../DependentPhotoUpload";

interface EditDependentFormProps {
  dependent: {
    name: string;
    rg: string;
    cpf: string;
    photo?: File | null;
    photo_url?: string | null;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoChange: (file: File | null) => void;
}

const EditDependentForm = ({
  dependent,
  onInputChange,
  onPhotoChange,
}: EditDependentFormProps) => {
  return (
    <div className="space-y-6">
      <DependentPhotoUpload
        onPhotoChange={onPhotoChange}
        initialPreview={dependent.photo_url}
        dependentName={dependent.name || "Dependente"}
      />
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            value={dependent.name}
            onChange={onInputChange}
            placeholder="Nome do dependente"
            autoComplete="off"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="rg">RG</Label>
          <Input
            id="rg"
            name="rg"
            value={dependent.rg}
            onChange={onInputChange}
            placeholder="RG do dependente"
            autoComplete="off"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            name="cpf"
            value={dependent.cpf}
            onChange={onInputChange}
            placeholder="CPF do dependente"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
};

export default EditDependentForm;