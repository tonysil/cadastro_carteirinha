import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";

interface Dependent {
  id: string;
  name: string;
  rg: string;
  cpf: string;
  photo_url?: string | null;
}

interface DependentsListProps {
  dependents: Dependent[];
  onDelete: (id: string) => void;
  onEdit?: (dependent: Dependent) => void;
}

const DependentsList = ({ dependents, onDelete, onEdit }: DependentsListProps) => {
  if (dependents.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Nenhum dependente cadastrado ainda.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {dependents.map((dependent) => (
        <div
          key={dependent.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg border"
        >
          <div className="flex items-center gap-4">
            {dependent.photo_url ? (
              <img
                src={dependent.photo_url}
                alt={`Foto de ${dependent.name}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200" />
            )}
            <div>
              <h4 className="font-medium">{dependent.name}</h4>
              <p className="text-sm text-gray-500">
                RG: {dependent.rg} | CPF: {dependent.cpf}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(dependent)}
                className="h-8 w-8 text-blue-600 hover:text-blue-700"
                title="Editar Dependente"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(dependent.id)}
              className="h-8 w-8 text-red-600 hover:text-red-700"
              title="Excluir Dependente"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DependentsList;