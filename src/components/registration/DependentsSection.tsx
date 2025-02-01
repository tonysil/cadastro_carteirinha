import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import DependentsList from "./DependentsList";
import AddDependentDialog from "./AddDependentDialog";

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

interface DependentsSectionProps {
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
  dialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
  onPhotoChange: (file: File | null) => void;
  onAdd: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit?: (dependent: Dependent) => void;
}

const DependentsSection = ({
  dependents,
  newDependent,
  dialogOpen,
  onOpenChange,
  onDelete,
  onPhotoChange,
  onAdd,
  onInputChange,
  onEdit,
}: DependentsSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Dependentes</h2>
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onOpenChange(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Adicionar Dependente
        </Button>
      </div>

      <DependentsList
        dependents={dependents}
        onDelete={onDelete}
        onEdit={onEdit}
      />

      <AddDependentDialog
        open={dialogOpen}
        onOpenChange={onOpenChange}
        newDependent={newDependent}
        handlePhotoChange={onPhotoChange}
        handleAddDependent={onAdd}
        handleInputChange={onInputChange}
      />
    </div>
  );
};

export default DependentsSection;