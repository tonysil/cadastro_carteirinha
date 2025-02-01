import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Save, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import useAuth from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { Layout, Position, jsonToPosition, positionToJson } from "@/types/layout";
import LayoutSelector from "@/components/card-template/LayoutSelector";
import LayoutPreview from "@/components/card-template/LayoutPreview";
import PositionControl from "@/components/card-template/PositionControls";

const defaultLayout: Layout = {
  id: crypto.randomUUID(),
  title: "Novo Layout",
  background_image: null,
  photo_position: { x: 0, y: 0 },
  name_position: { x: 0, y: 0 },
  rg_position: { x: 0, y: 0 },
  cpf_position: { x: 0, y: 0 },
  role_position: { x: 0, y: 0 },
  company_position: { x: 0, y: 0 },
  association_date_position: { x: 0, y: 0 },
  expiration_date_position: { x: 0, y: 0 },
  dependent_name_position: { x: 0, y: 0 },
  show_photo: false,
  show_name: false,
  show_rg: false,
  show_cpf: false,
  show_role: false,
  show_company: false,
  show_association_date: false,
  show_expiration_date: false,
  show_dependent_name: false
};

const CardTemplateEditor = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [layouts, setLayouts] = useState<Layout[]>([defaultLayout]);
  const [currentLayoutIndex, setCurrentLayoutIndex] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLayouts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: dbLayouts, error: layoutsError } = await supabase
          .from('layouts')
          .select('*')
          .order('updated_at', { ascending: false });

        if (layoutsError) throw layoutsError;

        if (dbLayouts && dbLayouts.length > 0) {
          const parsedLayouts = dbLayouts.map(layout => ({
            ...layout,
            photo_position: jsonToPosition(layout.photo_position),
            name_position: jsonToPosition(layout.name_position),
            rg_position: jsonToPosition(layout.rg_position),
            cpf_position: jsonToPosition(layout.cpf_position),
            role_position: jsonToPosition(layout.role_position),
            company_position: jsonToPosition(layout.company_position),
            association_date_position: jsonToPosition(layout.association_date_position),
            expiration_date_position: jsonToPosition(layout.expiration_date_position),
            dependent_name_position: jsonToPosition(layout.dependent_name_position),
          })) as Layout[];

          setLayouts(parsedLayouts);
          toast({
            title: "Sucesso",
            description: `${parsedLayouts.length} layouts carregados`,
          });
        }

      } catch (err) {
        console.error('Erro ao carregar layouts:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        toast({
          title: "Erro",
          description: err instanceof Error ? err.message : 'Erro ao carregar dados',
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLayouts();
  }, [toast]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `card-template-${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      const updatedLayouts = [...layouts];
      updatedLayouts[currentLayoutIndex] = {
        ...updatedLayouts[currentLayoutIndex],
        background_image: publicUrl,
      };
      setLayouts(updatedLayouts);
      
      toast({
        title: "Sucesso",
        description: "Imagem de fundo atualizada com sucesso",
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem",
        variant: "destructive",
      });
    }
  };

  const handleSaveLayout = async () => {
    try {
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para salvar layouts",
          variant: "destructive"
        });
        return;
      }

      const currentLayout = layouts[currentLayoutIndex];
      
      const layoutToSave = {
        ...currentLayout,
        photo_position: positionToJson(currentLayout.photo_position),
        name_position: positionToJson(currentLayout.name_position),
        rg_position: positionToJson(currentLayout.rg_position),
        cpf_position: positionToJson(currentLayout.cpf_position),
        role_position: positionToJson(currentLayout.role_position),
        company_position: positionToJson(currentLayout.company_position),
        association_date_position: positionToJson(currentLayout.association_date_position),
        expiration_date_position: positionToJson(currentLayout.expiration_date_position),
        dependent_name_position: positionToJson(currentLayout.dependent_name_position),
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('layouts')
        .upsert(layoutToSave)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const parsedData = {
          ...data,
          photo_position: jsonToPosition(data.photo_position),
          name_position: jsonToPosition(data.name_position),
          rg_position: jsonToPosition(data.rg_position),
          cpf_position: jsonToPosition(data.cpf_position),
          role_position: jsonToPosition(data.role_position),
          company_position: jsonToPosition(data.company_position),
          association_date_position: jsonToPosition(data.association_date_position),
          expiration_date_position: jsonToPosition(data.expiration_date_position),
          dependent_name_position: jsonToPosition(data.dependent_name_position)
        } as Layout;

        const updatedLayouts = [...layouts];
        updatedLayouts[currentLayoutIndex] = parsedData;
        setLayouts(updatedLayouts);
        
        setShowSuccessDialog(true);
        toast({
          title: "Sucesso",
          description: "Layout salvo com sucesso"
        });
      }

    } catch (error) {
      console.error('Erro ao salvar layout:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o layout",
        variant: "destructive"
      });
    }
  };

  const handleDeleteLayout = async () => {
    try {
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para excluir layouts",
          variant: "destructive"
        });
        return;
      }

      if (!layouts[currentLayoutIndex]) return;

      if (layouts.length <= 1) {
        toast({
          title: "Aviso",
          description: "Não é possível excluir o único layout existente",
          variant: "destructive"
        });
        setShowDeleteAlert(false);
        return;
      }

      const { error } = await supabase
        .from('layouts')
        .delete()
        .eq('id', layouts[currentLayoutIndex].id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Layout excluído com sucesso",
      });

      const newLayouts = layouts.filter((_, index) => index !== currentLayoutIndex);
      setLayouts(newLayouts);

      if (currentLayoutIndex >= newLayouts.length) {
        setCurrentLayoutIndex(Math.max(0, newLayouts.length - 1));
      }

      setShowDeleteAlert(false);

    } catch (error) {
      console.error('Erro ao excluir layout:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o layout",
        variant: "destructive"
      });
    }
  };

  const handleDuplicateLayout = async () => {
    try {
      const currentLayout = layouts[currentLayoutIndex];
      if (!currentLayout) return;

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Erro de Autenticação",
          description: "Você precisa estar logado para duplicar layouts",
          variant: "destructive"
        });
        return;
      }

      const newLayout = {
        ...currentLayout,
        id: crypto.randomUUID(),
        title: `${currentLayout.title} (Cópia)`,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const layoutToSave = {
        ...newLayout,
        photo_position: positionToJson(newLayout.photo_position),
        name_position: positionToJson(newLayout.name_position),
        rg_position: positionToJson(newLayout.rg_position),
        cpf_position: positionToJson(newLayout.cpf_position),
        role_position: positionToJson(newLayout.role_position),
        company_position: positionToJson(newLayout.company_position),
        association_date_position: positionToJson(newLayout.association_date_position),
        expiration_date_position: positionToJson(newLayout.expiration_date_position),
        dependent_name_position: positionToJson(newLayout.dependent_name_position),
      };

      const { error } = await supabase
        .from('layouts')
        .insert([layoutToSave]);

      if (error) throw error;

      const newLayouts = [...layouts, newLayout];
      setLayouts(newLayouts);
      setCurrentLayoutIndex(newLayouts.length - 1);

      toast({
        title: "Sucesso",
        description: "Layout duplicado com sucesso",
      });

    } catch (error) {
      console.error('Erro ao duplicar layout:', error);
      toast({
        title: "Erro",
        description: "Não foi possível duplicar o layout",
        variant: "destructive"
      });
    }
  };

  const handleAddLayout = () => {
    const newLayout = {
      ...defaultLayout,
      id: crypto.randomUUID(),
      title: `Layout ${layouts.length + 1}`
    };
    setLayouts([...layouts, newLayout]);
    setCurrentLayoutIndex(layouts.length);
  };

  const updateLayoutTitle = (title: string) => {
    const updatedLayouts = [...layouts];
    updatedLayouts[currentLayoutIndex] = {
      ...updatedLayouts[currentLayoutIndex],
      title,
    };
    setLayouts(updatedLayouts);
  };

  const updatePosition = (field: keyof Layout, newPosition: Position) => {
    const updatedLayouts = [...layouts];
    updatedLayouts[currentLayoutIndex] = {
      ...updatedLayouts[currentLayoutIndex],
      [field]: newPosition,
    };
    setLayouts(updatedLayouts);
  };

  const updateVisibility = (field: string, value: boolean) => {
    const updatedLayouts = [...layouts];
    const fieldMap = {
      'photo': 'show_photo',
      'name': 'show_name',
      'rg': 'show_rg',
      'cpf': 'show_cpf',
      'role': 'show_role',
      'company': 'show_company',
      'association_date': 'show_association_date',
      'expiration_date': 'show_expiration_date',
      'dependent_name': 'show_dependent_name'
    };

    const key = fieldMap[field as keyof typeof fieldMap];
    if (key) {
      updatedLayouts[currentLayoutIndex] = {
        ...updatedLayouts[currentLayoutIndex],
        [key]: value
      };
      setLayouts(updatedLayouts);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600">Carregando editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-red-600 text-xl">⚠️</div>
          <p className="text-gray-800 font-medium">Erro ao carregar o editor</p>
          <p className="text-gray-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  const currentLayout = layouts[currentLayoutIndex];

  return (
    <div className="container p-4">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <LayoutSelector
            layouts={layouts}
            currentLayoutIndex={currentLayoutIndex}
            onLayoutChange={setCurrentLayoutIndex}
            onAddLayout={handleAddLayout}
            onDuplicateLayout={handleDuplicateLayout}
            onDeleteClick={() => setShowDeleteAlert(true)}
          />

          <Button 
            onClick={handleSaveLayout}
            className="w-full lg:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Layout
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr,auto] gap-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Configurações do Layout</h2>
            <div className="flex gap-4 items-center">
              <Label htmlFor="layoutTitle" className="min-w-[100px]">
                Título
              </Label>
              <Input
                id="layoutTitle"
                value={currentLayout.title}
                onChange={(e) => updateLayoutTitle(e.target.value)}
                className="max-w-md"
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800">Imagem de Fundo</h2>
            <div className="flex flex-col gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="background-upload"
              />
              <Label
                htmlFor="background-upload"
                className="inline-block"
              >
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary cursor-pointer transition-colors">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {currentLayout.background_image 
                        ? 'Clique para trocar a imagem' 
                        : 'Clique para fazer upload da imagem'}
                    </span>
                    <span className="text-xs text-gray-400">
                      PNG, JPG ou WEBP (max. 2MB)
                    </span>
                  </div>
                </div>
              </Label>

              {currentLayout.background_image && (
                <div className="relative rounded-lg overflow-hidden border">
                  <img
                    src={currentLayout.background_image}
                    alt="Preview do template"
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800">Posicionamento dos Campos</h2>
            <div className="grid gap-6">
              <PositionControl
                label="Foto do Associado"
                position={currentLayout.photo_position}
                onChange={(newPosition) => updatePosition('photo_position', newPosition)}
                field="photo"
                visible={currentLayout.show_photo}
                onVisibilityChange={(value) => updateVisibility('photo', value)}
              />
              <PositionControl
                label="Nome do Associado"
                position={currentLayout.name_position}
                onChange={(newPosition) => updatePosition('name_position', newPosition)}
                field="name"
                visible={currentLayout.show_name}
                onVisibilityChange={(value) => updateVisibility('name', value)}
              />
              <PositionControl
                label="RG"
                position={currentLayout.rg_position}
                onChange={(newPosition) => updatePosition('rg_position', newPosition)}
                field="rg"
                visible={currentLayout.show_rg}
                onVisibilityChange={(value) => updateVisibility('rg', value)}
              />
              <PositionControl
                label="CPF"
                position={currentLayout.cpf_position}
                onChange={(newPosition) => updatePosition('cpf_position', newPosition)}
                field="cpf"
                visible={currentLayout.show_cpf}
                onVisibilityChange={(value) => updateVisibility('cpf', value)}
              />
              <PositionControl
                label="Cargo"
                position={currentLayout.role_position}
                onChange={(newPosition) => updatePosition('role_position', newPosition)}
                field="role"
                visible={currentLayout.show_role}
                onVisibilityChange={(value) => updateVisibility('role', value)}
              />
              <PositionControl
                label="Empresa"
                position={currentLayout.company_position}
                onChange={(newPosition) => updatePosition('company_position', newPosition)}
                field="company"
                visible={currentLayout.show_company}
                onVisibilityChange={(value) => updateVisibility('company', value)}
              />
              <PositionControl
                label="Data de Associação"
                position={currentLayout.association_date_position}
                onChange={(newPosition) => updatePosition('association_date_position', newPosition)}
                field="association_date"
                visible={currentLayout.show_association_date}
                onVisibilityChange={(value) => updateVisibility('association_date', value)}
              />
              <PositionControl
                label="Data de Validade"
                position={currentLayout.expiration_date_position}
                onChange={(newPosition) => updatePosition('expiration_date_position', newPosition)}
                field="expiration_date"
                visible={currentLayout.show_expiration_date}
                onVisibilityChange={(value) => updateVisibility('expiration_date', value)}
              />
              <PositionControl
                label="Nome do Dependente"
                position={currentLayout.dependent_name_position}
                onChange={(newPosition) => updatePosition('dependent_name_position', newPosition)}
                field="dependent_name"
                visible={currentLayout.show_dependent_name}
                onVisibilityChange={(value) => updateVisibility('dependent_name', value)}
              />
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-4 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Preview da Carteirinha</h2>
            <div className="bg-white p-4 rounded-lg shadow-sm overflow-hidden">
              <LayoutPreview layout={currentLayout} formatDate={formatDate} />
            </div>
          </div>
        </div>

        <div className="lg:hidden space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Preview da Carteirinha</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
            <LayoutPreview layout={currentLayout} formatDate={formatDate} />
          </div>
        </div>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              Layout Salvo com Sucesso!
            </DialogTitle>
            <DialogDescription className="text-center pt-2 pb-4">
              Todas as alterações foram salvas com sucesso.
              O que você deseja fazer agora?
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button 
              variant="outline"
              onClick={() => setShowSuccessDialog(false)}
            >
              Continuar Editando
            </Button>
            <Button 
              onClick={() => setShowSuccessDialog(false)}
              className="bg-green-600 hover:bg-green-700"
            >
              Ir para Impressão
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o layout
              "{currentLayout.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLayout}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CardTemplateEditor;