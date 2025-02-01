import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import DependentItem from "./DependentItem";

interface Dependent {
  id: string;
  name: string;
  rg: string;
  cpf: string;
  photo_url?: string | null;
}

interface DependentsSectionProps {
  dependents?: Dependent[];
  onAddDependent: () => void;
  onEditDependent: (dependent: Dependent) => void;
  onDeleteDependent: (id: string) => void;
}

const DependentsSection = ({
  dependents,
  onAddDependent,
  onEditDependent,
  onDeleteDependent,
}: DependentsSectionProps) => {
  return (
    <div className="pl-12 py-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Dependentes</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddDependent}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Adicionar Dependente
        </Button>
      </div>
      {dependents && dependents.length > 0 ? (
        <div className="space-y-4">
          {dependents.map((dependent) => (
            <DependentItem
              key={dependent.id}
              dependent={dependent}
              onEdit={() => onEditDependent(dependent)}
              onDelete={() => onDeleteDependent(dependent.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Nenhum dependente cadastrado</p>
      )}
    </div>
  );
};

export default DependentsSection;