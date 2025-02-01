import React from "react";
import DependentsList from "../registration/DependentsList";
import AddDependentDialog from "../registration/AddDependentDialog";

interface Dependent {
  id: string;
  name: string;
  rg: string;
  cpf: string;
  photo_url?: string | null;
  company: string;
  association_date: string;
  expiration_date: string;
}

interface EditDependentsSectionProps {
  dependents: Dependent[];
  newDependent: {
    id: string;
    name: string;
    rg: string;
    cpf: string;
    photo: File | null;
    photo_url: string | null;
    company: string;
    association_date: string;
    expiration_date: string;
  };
  dependentDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoChange: (file: File | null) => void;
  onEdit?: (dependent: Dependent) => void;
}

const EditDependentsSection = ({
  dependents,
  newDependent,
  dependentDialogOpen,
  onOpenChange,
  onDelete,
  onAdd,
  onInputChange,
  onPhotoChange,
  onEdit,
}: EditDependentsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Dependentes</h3>
      </div>

      <DependentsList
        dependents={dependents.map(dep => ({
          ...dep,
          photo_url: dep.photo_url 
            ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/photos/${dep.photo_url}`
            : null
        }))}
        onDelete={onDelete}
        onEdit={onEdit}
      />

      <AddDependentDialog
        open={dependentDialogOpen}
        onOpenChange={onOpenChange}
        newDependent={newDependent}
        handlePhotoChange={onPhotoChange}
        handleAddDependent={onAdd}
        handleInputChange={onInputChange}
      />
    </div>
  );
};

export default EditDependentsSection;