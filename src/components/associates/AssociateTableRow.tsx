import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import EditAssociateDialog from "./EditAssociateDialog";
import EditDependentDialog from "../registration/EditDependentDialog";
import AddDependentDialog from "../registration/AddDependentDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import DependentsSection from "./DependentsSection";
import { useQueryClient } from "@tanstack/react-query";

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
  dependents?: Dependent[];
}

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

interface AssociateTableRowProps {
  associate: Associate;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  formatDate: (date: string) => string;
}

const AssociateTableRow = ({
  associate,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  formatDate,
}: AssociateTableRowProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editDependentDialogOpen, setEditDependentDialogOpen] = React.useState(false);
  const [addDependentDialogOpen, setAddDependentDialogOpen] = React.useState(false);
  const [selectedDependent, setSelectedDependent] = React.useState<Dependent | null>(null);
  const [newDependent, setNewDependent] = React.useState({
    name: "",
    rg: "",
    cpf: "",
    photo: null as File | null,
    photo_url: null as string | null,
    company: associate.company,
    association_date: associate.association_date,
    expiration_date: associate.expiration_date,
  });

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["associates"] });
  };

  const handleEditDependent = async (dependent: Dependent) => {
    setSelectedDependent(dependent);
    setEditDependentDialogOpen(true);
  };

  const handleSaveDependent = async (updatedDependent: Dependent) => {
    try {
      const cleanCpf = updatedDependent.cpf.replace(/\D/g, '');
      const cleanRg = updatedDependent.rg.replace(/\D/g, '');

      const { error } = await supabase
        .from("dependents")
        .update({
          name: updatedDependent.name,
          rg: cleanRg,
          cpf: cleanCpf,
          photo_url: updatedDependent.photo_url,
          company: updatedDependent.company,
          association_date: updatedDependent.association_date,
          expiration_date: updatedDependent.expiration_date,
        })
        .eq("id", updatedDependent.id);

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
      refreshData();
      setEditDependentDialogOpen(false);
    } catch (error) {
      console.error("Error updating dependent:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar dependente",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDependent = async (dependentId: string) => {
    try {
      const { error } = await supabase
        .from("dependents")
        .delete()
        .eq("id", dependentId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Dependente excluído com sucesso",
      });
      refreshData();
    } catch (error) {
      console.error("Error deleting dependent:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir dependente",
        variant: "destructive",
      });
    }
  };

  const handleAddDependent = async () => {
    try {
      const cleanCpf = newDependent.cpf.replace(/\D/g, '');
      const cleanRg = newDependent.rg.replace(/\D/g, '');

      const { error } = await supabase.from("dependents").insert([
        {
          associate_id: associate.id,
          name: newDependent.name,
          rg: cleanRg,
          cpf: cleanCpf,
          company: newDependent.company,
          association_date: newDependent.association_date,
          expiration_date: newDependent.expiration_date,
        },
      ]);

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
        description: "Dependente adicionado com sucesso",
      });
      setAddDependentDialogOpen(false);
      setNewDependent({
        name: "",
        rg: "",
        cpf: "",
        photo: null,
        photo_url: null,
        company: "",
        association_date: "",
        expiration_date: "",
      });
      refreshData();
    } catch (error) {
      console.error("Error adding dependent:", error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar dependente",
        variant: "destructive",
      });
    }
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <Button variant="ghost" size="icon" onClick={onToggleExpand}>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
        <TableCell className="font-medium">{associate.name}</TableCell>
        <TableCell>{associate.cpf}</TableCell>
        <TableCell>{associate.rg}</TableCell>
        <TableCell>{associate.role}</TableCell>
        <TableCell>{associate.company}</TableCell>
        <TableCell>{formatDate(associate.association_date)}</TableCell>
        <TableCell>{formatDate(associate.expiration_date)}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditDialogOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow>
          <TableCell colSpan={9}>
            <DependentsSection
              dependents={associate.dependents}
              onAddDependent={() => setAddDependentDialogOpen(true)}
              onEditDependent={handleEditDependent}
              onDeleteDependent={handleDeleteDependent}
            />
          </TableCell>
        </TableRow>
      )}

      <AddDependentDialog
        open={addDependentDialogOpen}
        onOpenChange={setAddDependentDialogOpen}
        newDependent={newDependent}
        handlePhotoChange={(file) => {
          setNewDependent((prev) => ({ ...prev, photo: file }));
        }}
        handleAddDependent={handleAddDependent}
        handleInputChange={(e) => {
          setNewDependent((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
        }}
        associateInfo={{
          company: associate.company,
          association_date: associate.association_date,
          expiration_date: associate.expiration_date,
        }}
      />

      <EditAssociateDialog
        associate={associate}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={() => {
          setEditDialogOpen(false);
          refreshData();
        }}
      />

      {selectedDependent && (
        <EditDependentDialog
          open={editDependentDialogOpen}
          onOpenChange={setEditDependentDialogOpen}
          dependent={selectedDependent}
          onInputChange={(e) => {
            if (selectedDependent) {
              setSelectedDependent({
                ...selectedDependent,
                [e.target.name]: e.target.value,
              });
            }
          }}
          onPhotoChange={() => {}}
          onSave={() => handleSaveDependent(selectedDependent)}
        />
      )}
    </React.Fragment>
  );
};

export default AssociateTableRow;
