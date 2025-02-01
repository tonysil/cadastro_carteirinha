import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface Associate {
  company: string;
  association_date: string;
  expiration_date: string;
}

interface Crop {
  unit: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

const AddDependentForm = () => {
  const { associateId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [associate, setAssociate] = useState<Associate | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    rg: "",
    cpf: "",
    company: "",
    association_date: "",
    expiration_date: "",
  });

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imgRef = React.createRef<HTMLImageElement>(null);

  useEffect(() => {
    fetchAssociateData();
  }, [associateId]);

  const fetchAssociateData = async () => {
    try {
      const { data, error } = await supabase
        .from("associates")
        .select("company, association_date, expiration_date")
        .eq("id", associateId)
        .single();

      if (error) throw error;

      if (data) {
        setAssociate(data);
        setFormData(prev => ({
          ...prev,
          company: data.company,
          association_date: data.association_date,
          expiration_date: data.expiration_date
        }));
      }
    } catch (error) {
      console.error("Error fetching associate:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do associado",
        variant: "destructive",
      });
    }
  };

  // Utility functions for masking and validation
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const maskRG = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{1})\d+?$/, '$1');
  };

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    
    if (/^(.)\1+$/.test(cleanCPF)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

    return true;
  };

  const validateRG = (rg: string) => {
    const cleanRG = rg.replace(/\D/g, '');
    return cleanRG.length === 9;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'cpf') {
      newValue = maskCPF(value);
    } else if (name === 'rg') {
      newValue = maskRG(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (name === 'cpf' && value.replace(/\D/g, '').length === 11) {
      const isValid = validateCPF(value);
      if (!isValid) {
        toast({
          title: "Aviso",
          description: "CPF inválido. Por favor, verifique o número informado.",
          variant: "destructive",
        });
      }
    } else if (name === 'rg' && value.replace(/\D/g, '').length === 9) {
      const isValid = validateRG(value);
      if (!isValid) {
        toast({
          title: "Aviso",
          description: "RG inválido. Por favor, verifique o número informado.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setCropModalOpen(true);
    }
  };

  const handleCropComplete = (crop: Crop) => {
    setCompletedCrop(crop);
  };

  const handleCropSave = () => {
    if (imgRef.current && completedCrop) {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(
          imgRef.current,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          completedCrop.width,
          completedCrop.height
        );

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
          }
        }, 'image/jpeg');
      }
    }
    setCropModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let photoUrl = null;
      
      if (photoFile) {
        const photoFileName = `${Date.now()}-${photoFile.name}`;
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('photos')
          .upload(photoFileName, photoFile);

        if (uploadError) throw uploadError;

        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('photos')
            .getPublicUrl(uploadData.path);
          photoUrl = publicUrl;
        }
      }

      const { error } = await supabase.from("dependents").insert([
        {
          name: formData.name,
          rg: formData.rg,
          cpf: formData.cpf,
          company: formData.company,
          association_date: formData.association_date,
          expiration_date: formData.expiration_date,
          associate_id: associateId,
          photo_url: photoUrl
        },
      ]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Dependente cadastrado com sucesso!",
      });

      navigate("/associados");
    } catch (error) {
      console.error("Error adding dependent:", error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar dependente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold">Adicionar Dependente</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Photo upload section */}
            <div className="space-y-2 col-span-full">
              <Label>Foto</Label>
              <div className="flex items-center gap-4">
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">Sem foto</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="max-w-xs"
                  />
                  <p className="text-sm text-gray-500">
                    Formatos suportados: JPG, PNG. Tamanho máximo: 5MB
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                required
                maxLength={14}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                name="rg"
                value={formData.rg}
                onChange={handleInputChange}
                required
                maxLength={12}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="association_date">Data de Associação</Label>
              <Input
                id="association_date"
                name="association_date"
                type="date"
                value={formData.association_date}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiration_date">Data de Vencimento</Label>
              <Input
                id="expiration_date"
                name="expiration_date"
                type="date"
                value={formData.expiration_date}
                readOnly
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/associados")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Image Crop Modal */}
      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent className="max-w-[800px] w-full">
          <DialogHeader>
            <DialogTitle>Recortar Imagem</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedImage && (
              <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                onComplete={handleCropComplete}
                aspect={1}
              >
                <img
                  ref={imgRef}
                  src={selectedImage}
                  alt="Crop"
                  className="max-h-[500px] w-auto"
                />
              </ReactCrop>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setCropModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCropSave}>
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddDependentForm;
