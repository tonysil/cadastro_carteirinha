import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAssociateForm } from "./useAssociateForm";
import { usePhotoUpload } from "./usePhotoUpload";

export const useRegistrationForm = () => {
  const { toast } = useToast();
  const { formData, handleInputChange, handlePhotoChange, resetForm } = useAssociateForm();
  const { uploadPhoto } = usePhotoUpload();

  const checkExistingAssociate = async (cpf: string, rg: string) => {
    const { data: existingCpf } = await supabase
      .from('associates')
      .select('cpf')
      .eq('cpf', cpf)
      .maybeSingle();

    if (existingCpf) {
      return "CPF já cadastrado no sistema";
    }

    const { data: existingRg } = await supabase
      .from('associates')
      .select('rg')
      .eq('rg', rg)
      .maybeSingle();

    if (existingRg) {
      return "RG já cadastrado no sistema";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      toast({
        title: "Erro ao cadastrar",
        description: "Você precisa estar logado para realizar o cadastro.",
        variant: "destructive",
      });
      return;
    }

    // Check for existing associate with same CPF or RG
    const existingError = await checkExistingAssociate(formData.cpf, formData.rg);
    if (existingError) {
      toast({
        title: "Erro ao cadastrar",
        description: existingError,
        variant: "destructive",
      });
      return;
    }

    let photoUrl = null;
    if (formData.photo) {
      photoUrl = await uploadPhoto(formData.photo, user.user.id);
      if (!photoUrl) {
        toast({
          title: "Erro ao fazer upload da foto",
          description: "Ocorreu um erro ao fazer upload da foto.",
          variant: "destructive",
        });
        return;
      }
    }

    const { data: associate, error: saveError } = await supabase
      .from('associates')
      .insert([
        {
          user_id: user.user.id,
          name: formData.name,
          rg: formData.rg,
          cpf: formData.cpf,
          role: formData.role,
          company: formData.company,
          association_date: formData.associationDate,
          expiration_date: formData.expirationDate,
          photo_url: photoUrl,
        },
      ])
      .select()
      .single();

    if (saveError) {
      console.error('Error saving associate:', saveError);
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao salvar os dados.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Cadastro realizado com sucesso",
      description: "O associado foi cadastrado com sucesso.",
    });

    resetForm();
  };

  return {
    formData,
    handleInputChange,
    handlePhotoChange,
    handleSubmit,
  };
};