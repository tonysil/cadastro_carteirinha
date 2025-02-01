import { useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  name: string;
  rg: string;
  cpf: string;
  role: string;
  company: string;
  associationDate: string;
  expirationDate: string;
}

const initialFormData: FormData = {
  name: "",
  rg: "",
  cpf: "",
  role: "",
  company: "",
  associationDate: "",
  expirationDate: "",
};

export const useRegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (file: File) => {
    setPhotoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, rg, cpf, role, company, associationDate, expirationDate } = formData;

    // Upload photo if it exists
    if (photoFile) {
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(`public/${photoFile.name}`, photoFile);

      if (error) {
        console.error("Error uploading photo:", error);
        return;
      }

      const photoUrl = data?.path; // Changed from data?.Key to data?.path

      // Save form data to the database
      const { error: dbError } = await supabase
        .from('associates')
        .insert([{ name, rg, cpf, role, company, associationDate, expirationDate, photoUrl }]);

      if (dbError) {
        console.error("Error saving data:", dbError);
      }
    } else {
      // Save form data without photo
      const { error: dbError } = await supabase
        .from('associates')
        .insert([{ name, rg, cpf, role, company, associationDate, expirationDate }]);

      if (dbError) {
        console.error("Error saving data:", dbError);
      }
    }

    // Reset form
    setFormData(initialFormData);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  return {
    formData,
    setFormData,
    photoFile,
    setPhotoFile,
    photoPreview,
    setPhotoPreview,
    handleInputChange,
    handlePhotoChange,
    handleSubmit,
    initialFormData,
  };
};

export default useRegistrationForm;