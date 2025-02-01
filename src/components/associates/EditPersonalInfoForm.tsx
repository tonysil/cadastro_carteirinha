import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhotoUpload from "../PhotoUpload";

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

interface EditPersonalInfoFormProps {
  formData: Associate;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoChange: (file: File | null) => void;
}

const EditPersonalInfoForm = ({
  formData,
  handleInputChange,
  handlePhotoChange,
}: EditPersonalInfoFormProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <PhotoUpload
          onPhotoChange={handlePhotoChange}
          initialPreview={formData.photo_url}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rg">RG</Label>
          <Input
            id="rg"
            name="rg"
            value={formData.rg}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Cargo</Label>
          <Input
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Empresa</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="association_date">Data de Associação</Label>
          <Input
            id="association_date"
            name="association_date"
            type="date"
            value={formData.association_date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiration_date">Data de Validade</Label>
          <Input
            id="expiration_date"
            name="expiration_date"
            type="date"
            value={formData.expiration_date}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default EditPersonalInfoForm;