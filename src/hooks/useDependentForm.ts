import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePhotoUpload } from "./usePhotoUpload";
import { useToast } from "@/components/ui/use-toast";

interface Dependent {
  id: string;
  name: string;
  rg: string;
  cpf: string;
  photo: File | null;
  photo_url: string | null;
  company: string;
  association_date: string;
  expiration_date: string;
}

const initialDependentState = {
  id: "",
  name: "",
  rg: "",
  cpf: "",
  photo: null,
  photo_url: null,
  company: "",
  association_date: "",
  expiration_date: "",
};

export const useDependentForm = (associateId?: string) => {
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [newDependent, setNewDependent] = useState<Dependent>(initialDependentState);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { uploadPhoto } = usePhotoUpload();
  const { toast } = useToast();

  const handleDependentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDependent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDependentPhotoChange = (file: File | null) => {
    setNewDependent((prev) => ({
      ...prev,
      photo: file,
    }));
  };

  const saveDependentToDatabase = async (dependent: Dependent, associateId: string) => {
    let photoUrl = null;
    if (dependent.photo) {
      photoUrl = await uploadPhoto(dependent.photo, dependent.id, 'dependent-');
      if (!photoUrl) {
        throw new Error("Failed to upload dependent photo");
      }
    }

    const dependentData = {
      associate_id: associateId,
      name: dependent.name,
      rg: dependent.rg,
      cpf: dependent.cpf,
      photo_url: photoUrl,
      company: dependent.company,
      association_date: dependent.association_date,
      expiration_date: dependent.expiration_date,
    };

    const { error } = await supabase
      .from('dependents')
      .insert([dependentData]);

    if (error) {
      throw error;
    }
  };

  const handleAddDependent = async (associateId?: string) => {
    if (!associateId) {
      setDependents((prev) => [...prev, { ...newDependent, id: crypto.randomUUID() }]);
      setNewDependent(initialDependentState);
      setDialogOpen(false);
      return;
    }

    try {
      await saveDependentToDatabase(newDependent, associateId);
      toast({
        title: "Sucesso",
        description: "Dependente cadastrado com sucesso",
      });
      setNewDependent(initialDependentState);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving dependent:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar dependente",
        variant: "destructive",
      });
    }
  };

  const handleEditDependent = (dependent: Dependent) => {
    setNewDependent({
      ...dependent,
      photo: null,
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDeleteDependent = async (id: string) => {
    if (!associateId) {
      setDependents((prev) => prev.filter((dep) => dep.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from('dependents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Dependente removido com sucesso",
      });
    } catch (error) {
      console.error('Error deleting dependent:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover dependente",
        variant: "destructive",
      });
    }
  };

  return {
    dependents,
    newDependent,
    dialogOpen,
    setDialogOpen,
    handleDependentInputChange,
    handleDependentPhotoChange,
    handleAddDependent,
    handleDeleteDependent,
    handleEditDependent,
  };
};