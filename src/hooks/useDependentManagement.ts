import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Dependent {
  id: string;
  name: string;
  rg: string;
  cpf: string;
  photo?: File | null;
  photo_url?: string | null;
}

const initialDependentState = {
  id: "",
  name: "",
  rg: "",
  cpf: "",
  photo: null as File | null,
  photo_url: null as string | null,
};

const formatDocument = (value: string, type: 'cpf' | 'rg') => {
  const cleanValue = value.replace(/\D/g, "");
  
  if (type === 'cpf') {
    return cleanValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  }
  
  return cleanValue
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{1})\d+?$/, "$1");
};

export const useDependentManagement = (associateId?: string) => {
  const { toast } = useToast();
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [newDependent, setNewDependent] = useState(initialDependentState);
  const [isEditingDependent, setIsEditingDependent] = useState(false);

  const fetchDependents = async () => {
    if (!associateId) {
      setDependents([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("dependents")
        .select("*")
        .eq("associate_id", associateId);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar dependentes",
          variant: "destructive",
        });
        return;
      }

      setDependents(data || []);
    } catch (error) {
      console.error("Error fetching dependents:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dependentes",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (associateId) {
      fetchDependents();
    } else {
      setDependents([]);
    }
  }, [associateId]);

  const handleDependentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = name === 'cpf' || name === 'rg' 
      ? formatDocument(value, name as 'cpf' | 'rg')
      : value;

    setNewDependent(prev => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleAddDependent = () => {
    if (isEditingDependent) {
      setDependents(dependents.map(dep => 
        dep.id === newDependent.id 
          ? { ...dep, name: newDependent.name, rg: newDependent.rg, cpf: newDependent.cpf }
          : dep
      ));
    } else {
      const newId = crypto.randomUUID();
      setDependents([...dependents, { 
        id: newId,
        name: newDependent.name,
        rg: newDependent.rg,
        cpf: newDependent.cpf,
        photo_url: null,
      }]);
    }
    
    resetDependentForm();
  };

  const handleEditDependent = (dependent: Dependent) => {
    setNewDependent({
      id: dependent.id,
      name: dependent.name,
      rg: dependent.rg,
      cpf: dependent.cpf,
      photo: null,
      photo_url: dependent.photo_url,
    });
    setIsEditingDependent(true);
  };

  const handleDeleteDependent = (id: string) => {
    setDependents(dependents.filter((dep) => dep.id !== id));
  };

  const resetDependentForm = () => {
    setNewDependent(initialDependentState);
    setIsEditingDependent(false);
  };

  const resetDependents = () => {
    setDependents([]);
    resetDependentForm();
  };

  return {
    dependents,
    newDependent,
    isEditingDependent,
    handleDependentInputChange,
    handleAddDependent,
    handleEditDependent,
    handleDeleteDependent,
    resetDependents,
    fetchDependents,
  };
};