import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditDependentForm from "../associates/EditDependentForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface EditDependentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dependent: {
    id: string;
    name: string;
    rg: string;
    cpf: string;
    photo_url?: string | null;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoChange: (file: File | null) => void;
  onSave: () => void;
}

const EditDependentDialog = ({
  open,
  onOpenChange,
  dependent,
  onInputChange,
  onPhotoChange,
  onSave,
}: EditDependentDialogProps) => {
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      // Clean CPF and RG before updating
      const cleanCpf = dependent.cpf.replace(/\D/g, '');
      const cleanRg = dependent.rg.replace(/\D/g, '');

      const { error } = await supabase
        .from("dependents")
        .update({
          name: dependent.name,
          rg: cleanRg,
          cpf: cleanCpf,
          photo_url: dependent.photo_url,
        })
        .eq("id", dependent.id);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Erro",
            description: "CPF ou RG já cadastrado no sistema",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Dependente atualizado com sucesso",
      });
      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating dependent:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar dependente",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Dependente</DialogTitle>
        </DialogHeader>
        <EditDependentForm
          dependent={dependent}
          onInputChange={onInputChange}
          onPhotoChange={onPhotoChange}
        />
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDependentDialog;