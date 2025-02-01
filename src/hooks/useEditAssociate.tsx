import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

export const useEditAssociate = (associate: Associate | null, onSuccess: () => void) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Associate | null>(associate);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;

    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handlePhotoChange = async (file: File | null) => {
    if (!file || !formData) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${formData.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev!,
        photo_url: publicUrl
      }));

    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da foto",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      // Clean CPF and RG values
      const cleanCpf = formData.cpf.replace(/\D/g, '');
      const cleanRg = formData.rg.replace(/\D/g, '');

      const { error } = await supabase
        .from("associates")
        .update({
          name: formData.name,
          rg: cleanRg,
          cpf: cleanCpf,
          role: formData.role,
          company: formData.company,
          association_date: formData.association_date,
          expiration_date: formData.expiration_date,
          photo_url: formData.photo_url,
        })
        .eq("id", formData.id);

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
        description: "Associado atualizado com sucesso!",
      });
      onSuccess();
    } catch (error) {
      console.error("Error updating associate:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar associado",
        variant: "destructive",
      });
    }
  };

  return {
    formData,
    handleInputChange,
    handlePhotoChange,
    handleSubmit,
  };
};