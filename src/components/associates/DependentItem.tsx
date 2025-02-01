import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Dependent {
  id: string;
  name: string;
  rg: string;
  cpf: string;
  photo_url?: string | null;
}

interface DependentItemProps {
  dependent: Dependent;
  onEdit: (dependent: Dependent) => void;
  onDelete: (id: string) => void;
}

const DependentItem = ({ dependent, onEdit, onDelete }: DependentItemProps) => {
  return (
    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-4">
        {dependent.photo_url ? (
          <img
            src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/photos/${
              dependent.photo_url
            }`}
            alt={`Foto de ${dependent.name}`}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200" />
        )}
        <div>
          <p className="font-medium">{dependent.name}</p>
          <p className="text-sm text-muted-foreground">
            CPF: {dependent.cpf} | RG: {dependent.rg}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(dependent)}
          className="h-8 w-8 text-blue-600 hover:text-blue-700"
          title="Editar Dependente"
        >
          <Pencil className="h-4 w-4" />
        </Button>
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
  );
};

export default DependentItem;