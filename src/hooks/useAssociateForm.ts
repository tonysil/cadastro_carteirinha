import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  name: string;
  rg: string;
  cpf: string;
  role: string;
  company: string;
  associationDate: string;
  expirationDate: string;
  photo: File | null;
}

const initialFormData: FormData = {
  name: "",
  rg: "",
  cpf: "",
  role: "",
  company: "",
  associationDate: "",
  expirationDate: "",
  photo: null,
};

export const useAssociateForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cpf") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    } else if (name === "rg") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{1})\d+?$/, "$1");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handlePhotoChange = (file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      photo: file,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    formData,
    handleInputChange,
    handlePhotoChange,
    resetForm,
  };
};