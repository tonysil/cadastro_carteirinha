import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAssociatePhoto = (associateId: string) => {
  const { toast } = useToast();

  const handlePhotoChange = async (file: File | null) => {
    if (!file) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `associate-${associateId}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      return data?.path || null;
    } catch (error) {
      console.error('Error updating photo:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar a foto. Tente novamente.",
        variant: "destructive",
      });
      return null;
    }
  };

  return { handlePhotoChange };
};