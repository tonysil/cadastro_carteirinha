import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { useRegistrationForm } from "@/hooks/useRegistrationForm";
import { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { X, Upload, Edit, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Dependent {
  id?: string;
  name: string;
  rg: string;
  cpf: string;
  company: string;
  associationDate: string;
  expirationDate: string;
  photoFile?: File | null;
  photoPreview?: string | null;
}

const RegistrationForm = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [showDependentModal, setShowDependentModal] = useState(false);
  const [newDependent, setNewDependent] = useState<Dependent>({
    name: '',
    rg: '',
    cpf: '',
    company: '',
    associationDate: '',
    expirationDate: '',
    photoFile: null,
    photoPreview: null
  });
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [mainPhotoModalOpen, setMainPhotoModalOpen] = useState(false);
  const [mainPhotoSelected, setMainPhotoSelected] = useState<string | null>(null);
  const mainPhotoRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dependentCropModalOpen, setDependentCropModalOpen] = useState(false);
  const [dependentSelectedImage, setDependentSelectedImage] = useState<string | null>(null);
  const [dependentCrop, setDependentCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
  const [dependentCompletedCrop, setDependentCompletedCrop] = useState<Crop | null>(null);
  const dependentImgRef = useRef<HTMLImageElement>(null);
  const location = useLocation();
  const pageTitle = location.state?.pageTitle || "Novo Associado";
  const navigate = useNavigate();
  const { toast } = useToast();

  const { 
    formData, 
    setFormData,
    photoFile,
    setPhotoFile,
    photoPreview,
    setPhotoPreview,
    handleInputChange: baseHandleInputChange,
    handlePhotoChange, 
    initialFormData
  } = useRegistrationForm();

  // Utility functions for masking and validation
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove non-digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1'); // Limit to 11 digits
  };

  const maskRG = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove non-digits
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{1})\d+?$/, '$1'); // Limit to 9 digits
  };

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    
    // Check for known invalid CPFs
    if (/^(.)\1+$/.test(cleanCPF)) return false;

    // Validate digits
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
    return cleanRG.length === 9; // Basic validation for RG length
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'cpf') {
      newValue = maskCPF(value);
    } else if (name === 'rg') {
      newValue = maskRG(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === 'associationDate' && value
        ? {
            expirationDate: new Date(
              new Date(value).setFullYear(new Date(value).getFullYear() + 1)
            ).toISOString().split('T')[0]
          }
        : {})
    }));

    // Validate CPF and RG after input
    if (name === 'cpf' && value.replace(/\D/g, '').length === 11) {
      const isValid = validateCPF(value);
      if (!isValid) {
        alert('CPF inválido. Por favor, verifique o número informado.');
      }
    } else if (name === 'rg' && value.replace(/\D/g, '').length === 9) {
      const isValid = validateRG(value);
      if (!isValid) {
        alert('RG inválido. Por favor, verifique o número informado.');
      }
    }
  };

  const handleDependentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'cpf') {
      newValue = maskCPF(value);
    } else if (name === 'rg') {
      newValue = maskRG(value);
    }

    setNewDependent((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === 'associationDate' && value
        ? {
            expirationDate: new Date(
              new Date(value).setFullYear(new Date(value).getFullYear() + 1)
            ).toISOString().split('T')[0]
          }
        : {})
    }));

    // Validate CPF and RG after input
    if (name === 'cpf' && value.replace(/\D/g, '').length === 11) {
      const isValid = validateCPF(value);
      if (!isValid) {
        alert('CPF inválido. Por favor, verifique o número informado.');
      }
    } else if (name === 'rg' && value.replace(/\D/g, '').length === 9) {
      const isValid = validateRG(value);
      if (!isValid) {
        alert('RG inválido. Por favor, verifique o número informado.');
      }
    }
  };

  const handleOpenDependentModal = () => {
    setNewDependent(prev => ({
      ...prev,
      company: formData.company || '',
      associationDate: formData.associationDate || '',
      expirationDate: formData.expirationDate || ''
    }));
    setShowDependentModal(true);
  };

  const handleAddDependent = () => {
    if (newDependent.id) {
      setDependents(prev => prev.map(dep => 
        dep.id === newDependent.id ? newDependent : dep
      ));
    } else {
      setDependents(prev => [...prev, { ...newDependent, id: crypto.randomUUID() }]);
    }
    
    setNewDependent({
      name: '',
      rg: '',
      cpf: '',
      company: '',
      associationDate: '',
      expirationDate: '',
      photoFile: null,
      photoPreview: null
    });
    setShowDependentModal(false);
  };

  const handleRemoveDependent = (index: number) => {
    setDependents((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditDependent = (dependent: Dependent, index: number) => {
    setNewDependent(dependent);
    setShowDependentModal(true);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setCropModalOpen(true);
    }
  };

  const handleMainPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainPhotoSelected(URL.createObjectURL(file));
      setMainPhotoModalOpen(true);
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
            handlePhotoChange(file);
          }
        }, 'image/jpeg');
      }
    }
    setCropModalOpen(false);
  };

  const handleMainPhotoSave = () => {
    if (mainPhotoRef.current && completedCrop) {
      const canvas = document.createElement('canvas');
      const scaleX = mainPhotoRef.current.naturalWidth / mainPhotoRef.current.width;
      const scaleY = mainPhotoRef.current.naturalHeight / mainPhotoRef.current.height;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(
          mainPhotoRef.current,
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
            handlePhotoChange(file);
          }
        }, 'image/jpeg');
      }
    }
    setMainPhotoModalOpen(false);
  };

  const handleDependentPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDependentSelectedImage(URL.createObjectURL(file));
      setDependentCropModalOpen(true);
    }
  };

  const handleDependentCropComplete = (crop: Crop) => {
    setDependentCompletedCrop(crop);
  };

  const handleDependentCropSave = () => {
    if (dependentImgRef.current && dependentCompletedCrop) {
      const canvas = document.createElement('canvas');
      const scaleX = dependentImgRef.current.naturalWidth / dependentImgRef.current.width;
      const scaleY = dependentImgRef.current.naturalHeight / dependentImgRef.current.height;
      canvas.width = dependentCompletedCrop.width;
      canvas.height = dependentCompletedCrop.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(
          dependentImgRef.current,
          dependentCompletedCrop.x * scaleX,
          dependentCompletedCrop.y * scaleY,
          dependentCompletedCrop.width * scaleX,
          dependentCompletedCrop.height * scaleY,
          0,
          0,
          dependentCompletedCrop.width,
          dependentCompletedCrop.height
        );

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
            setNewDependent(prev => ({
              ...prev,
              photoFile: file,
              photoPreview: URL.createObjectURL(file)
            }));
          }
        }, 'image/jpeg');
      }
    }
    setDependentCropModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verificar se já existe um associado com este CPF
      const { data: existingAssociate, error: checkError } = await supabase
        .from('associates')
        .select('id, name, cpf')
        .eq('cpf', formData.cpf.replace(/\D/g, ''))
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingAssociate) {
        toast({
          title: "CPF já cadastrado",
          description: `Já existe um associado cadastrado com este CPF: ${existingAssociate.name}`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Verificar se algum dependente tem CPF duplicado
      for (const dependent of dependents) {
        const { data: existingDependent, error: checkDepError } = await supabase
          .from('dependents')
          .select('id, name, cpf')
          .eq('cpf', dependent.cpf.replace(/\D/g, ''))
          .single();

        if (checkDepError && checkDepError.code !== 'PGRST116') {
          throw checkDepError;
        }

        if (existingDependent) {
          toast({
            title: "CPF já cadastrado",
            description: `O dependente ${dependent.name} possui um CPF já cadastrado no sistema`,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      // 1. Upload da foto do associado
      let photoUrl = null;
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `associates/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filePath, photoFile, {
            contentType: photoFile.type,
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath);

        photoUrl = publicUrl;
      }

      // 2. Inserir associado
      const { data: associateData, error: associateError } = await supabase
        .from('associates')
        .insert([
          {
            name: formData.name,
            cpf: formData.cpf.replace(/\D/g, ''),
            rg: formData.rg.replace(/\D/g, ''),
            role: formData.role,
            company: formData.company,
            association_date: formData.associationDate,
            expiration_date: formData.expirationDate,
            photo_url: photoUrl
          }
        ])
        .select()
        .single();

      if (associateError) throw associateError;

      // 3. Inserir dependentes com o nome do associado
      if (dependents.length > 0) {
        const dependentsToInsert = await Promise.all(dependents.map(async (dependent) => {
          let dependentPhotoUrl = null;

          if (dependent.photoFile) {
            const fileExt = dependent.photoFile.name.split('.').pop();
            const fileName = `dependent-${Date.now()}.${fileExt}`;
            const filePath = `dependents/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('photos')
              .upload(filePath, dependent.photoFile, {
                contentType: dependent.photoFile.type,
                upsert: true
              });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('photos')
              .getPublicUrl(filePath);

            dependentPhotoUrl = publicUrl;
          }

          return {
            name: dependent.name,
            cpf: dependent.cpf.replace(/\D/g, ''),
            rg: dependent.rg.replace(/\D/g, ''),
            company: dependent.company,
            association_date: dependent.associationDate,
            expiration_date: dependent.expirationDate,
            photo_url: dependentPhotoUrl,
            associate_id: associateData.id,
            name_associado: formData.name
          };
        }));

        const { error: dependentsError } = await supabase
          .from('dependents')
          .insert(dependentsToInsert);

        if (dependentsError) throw dependentsError;
      }

      // Sucesso - mostrar mensagem e limpar formulário
      toast({
        title: "Sucesso!",
        description: "Associado e dependentes cadastrados com sucesso.",
        variant: "default",
      });

      // Limpar formulário
      setFormData(initialFormData);
      setDependents([]);
      setPhotoFile(null);
      setPhotoPreview(null);
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os dados. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="rg">RG</Label>
                <Input
                  id="rg"
                  name="rg"
                  value={formData.rg}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Cargo</Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="associationDate">Data de Associação</Label>
                <Input
                  type="date"
                  id="associationDate"
                  name="associationDate"
                  value={formData.associationDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="expirationDate">Data de Vencimento</Label>
                <Input
                  type="date"
                  id="expirationDate"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Foto</Label>
              <div className="mt-2 flex items-center gap-4">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainPhotoSelect}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer flex items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400"
                    >
                      <Upload className="w-6 h-6 text-gray-400" />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Dependentes</h3>
              <Button
                type="button"
                onClick={handleOpenDependentModal}
                variant="outline"
              >
                Adicionar Dependente
              </Button>
            </div>

            {dependents.length > 0 && (
              <div className="space-y-4">
                {dependents.map((dependent, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{dependent.name}</p>
                      <p className="text-sm text-gray-500">
                        RG: {dependent.rg} | CPF: {dependent.cpf}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleEditDependent(dependent, index)}
                        className="hover:bg-primary/20"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveDependent(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-white"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⚪</span>
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </div>
      </form>

      <Dialog open={showDependentModal} onOpenChange={setShowDependentModal}>
        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {newDependent.id ? 'Editar Dependente' : 'Adicionar Dependente'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Photo upload section */}
            <div className="space-y-2 col-span-full">
              <Label>Foto</Label>
              <div className="flex items-center gap-4">
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                  {newDependent.photoPreview ? (
                    <img
                      src={newDependent.photoPreview}
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
                    onChange={handleDependentPhotoSelect}
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
                value={newDependent.name}
                onChange={handleDependentInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                name="rg"
                value={newDependent.rg}
                onChange={handleDependentInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                value={newDependent.cpf}
                onChange={handleDependentInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                name="company"
                value={newDependent.company}
                onChange={handleDependentInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="associationDate">Data de Associação</Label>
              <Input
                type="date"
                id="associationDate"
                name="associationDate"
                value={newDependent.associationDate}
                onChange={handleDependentInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="expirationDate">Data de Vencimento</Label>
              <Input
                type="date"
                id="expirationDate"
                name="expirationDate"
                value={newDependent.expirationDate}
                onChange={handleDependentInputChange}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="button" onClick={handleAddDependent}>
                {newDependent.id ? 'Salvar' : 'Adicionar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recortar Foto</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={handleCropComplete}
                aspect={1}
              >
                <img ref={imgRef} src={selectedImage} alt="Crop" />
              </ReactCrop>
              <div className="flex justify-end mt-4">
                <Button onClick={handleCropSave}>Salvar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={mainPhotoModalOpen} onOpenChange={setMainPhotoModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recortar Foto Principal</DialogTitle>
          </DialogHeader>
          {mainPhotoSelected && (
            <div>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={handleCropComplete}
                aspect={1}
              >
                <img ref={mainPhotoRef} src={mainPhotoSelected} alt="Crop" />
              </ReactCrop>
              <div className="flex justify-end mt-4">
                <Button onClick={handleMainPhotoSave}>Salvar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dependentCropModalOpen} onOpenChange={setDependentCropModalOpen}>
        <DialogContent className="max-w-[800px] w-full">
          <DialogHeader>
            <DialogTitle>Recortar Imagem do Dependente</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {dependentSelectedImage && (
              <ReactCrop
                crop={dependentCrop}
                onChange={c => setDependentCrop(c)}
                onComplete={handleDependentCropComplete}
                aspect={1}
              >
                <img
                  ref={dependentImgRef}
                  src={dependentSelectedImage}
                  alt="Crop"
                  className="max-h-[500px] w-auto"
                />
              </ReactCrop>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setDependentCropModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDependentCropSave}>
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastro Realizado!</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>O associado foi cadastrado com sucesso.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/associados');
              }}
            >
              Voltar para Lista
            </Button>
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                setFormData(initialFormData);
              }}
            >
              Novo Cadastro
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationForm;