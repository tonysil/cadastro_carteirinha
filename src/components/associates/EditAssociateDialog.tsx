import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditPersonalInfoForm from "./EditPersonalInfoForm";
import { useEditAssociate } from "@/hooks/useEditAssociate";

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

interface EditAssociateDialogProps {
  associate: Associate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditAssociateDialog = ({
  associate,
  open,
  onOpenChange,
  onSuccess,
}: EditAssociateDialogProps) => {
  const {
    formData,
    handleInputChange,
    handlePhotoChange,
    handleSubmit,
  } = useEditAssociate(associate, onSuccess);

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Associado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <EditPersonalInfoForm
            formData={formData}
            handleInputChange={handleInputChange}
            handlePhotoChange={handlePhotoChange}
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAssociateDialog;