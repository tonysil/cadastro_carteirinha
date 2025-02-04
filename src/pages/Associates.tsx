import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import AssociateTable from "@/components/associates/AssociateTable";
import SearchFilters from "@/components/associates/filters/SearchFilters";
import DeleteDialog from "@/components/associates/dialogs/DeleteDialog";
import Pagination from "@/components/associates/Pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Upload, X } from "lucide-react";

const ITEMS_PER_PAGE = 6;

const Associates = () => {
  const [associates, setAssociates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    name: "",
    cpf: "",
    rg: "",
    role: "",
    company: "",
    status: "all",
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteDependentInfo, setDeleteDependentInfo] = useState<{
    id: string;
    name: string;
    associateId: string;
  } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAssociate, setEditingAssociate] = useState<Associate | null>(null);
  const [editCropModalOpen, setEditCropModalOpen] = useState(false);
  const [editSelectedImage, setEditSelectedImage] = useState<string | null>(null);
  const [editCrop, setEditCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
  const [editCompletedCrop, setEditCompletedCrop] = useState<Crop | null>(null);
  const editImgRef = useRef<HTMLImageElement>(null);
  const [editDependentModalOpen, setEditDependentModalOpen] = useState(false);
  const [editingDependent, setEditingDependent] = useState<{
    id: string;
    name: string;
    cpf: string;
    rg: string;
    company: string;
    association_date: string;
    expiration_date: string;
    photo_url: string | null;
    associate_id: string;
  } | null>(null);
  const [editDependentPhotoModalOpen, setEditDependentPhotoModalOpen] = useState(false);
  const [editDependentSelectedImage, setEditDependentSelectedImage] = useState<string | null>(null);
  const [editDependentCrop, setEditDependentCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
  const [editDependentCompletedCrop, setEditDependentCompletedCrop] = useState<Crop | null>(null);
  const editDependentImgRef = useRef<HTMLImageElement>(null);
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
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssociates();
  }, [currentPage, searchTerm, filters]);

  const fetchAssociates = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('associates')
        .select('*, dependents(*)', { count: 'exact' });

      // Apply filters
      if (filters.name) {
        query = query.ilike('name', `%${filters.name}%`);
      }
      if (filters.cpf) {
        query = query.ilike('cpf', `%${filters.cpf}%`);
      }
      if (filters.rg) {
        query = query.ilike('rg', `%${filters.rg}%`);
      }
      if (filters.role) {
        query = query.ilike('role', `%${filters.role}%`);
      }
      if (filters.company) {
        query = query.ilike('company', `%${filters.company}%`);
      }
      if (filters.status !== 'all') {
        const today = new Date().toISOString();
        if (filters.status === 'active') {
          query = query.gte('expiration_date', today);
        } else {
          query = query.lt('expiration_date', today);
        }
      }

      // Apply general search
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%`);
      }

      // Apply pagination
      const from = currentPage * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      const { data, count, error } = await query
        .range(from, to)
        .order('name');

      if (error) throw error;

      setAssociates(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Erro ao buscar associados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os associados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssociate = async () => {
    if (!deleteId) return;

    try {
      const { error: depError } = await supabase
        .from('dependents')
        .delete()
        .eq('associate_id', deleteId);

      if (depError) throw depError;

      const { error: assocError } = await supabase
        .from('associates')
        .delete()
        .eq('id', deleteId);

      if (assocError) throw assocError;

      toast({
        title: "Sucesso",
        description: "Associado excluído com sucesso",
      });

      fetchAssociates();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir associado",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleDeleteDependent = async () => {
    if (!deleteDependentInfo) return;

    try {
      const { error } = await supabase
        .from('dependents')
        .delete()
        .eq('id', deleteDependentInfo.id)
        .eq('associate_id', deleteDependentInfo.associateId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Dependente excluído com sucesso",
      });

      fetchAssociates();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir dependente",
        variant: "destructive",
      });
    } finally {
      setDeleteDependentInfo(null);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      cpf: '',
      rg: '',
      role: '',
      company: '',
      status: 'all'
    });
    setSearchTerm('');
    setCurrentPage(0);
  };

  const toggleRow = (associateId: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(associateId)) {
        next.delete(associateId);
      } else {
        next.add(associateId);
      }
      return next;
    });
  };

  const handleEditClick = async (id: string) => {
    try {
      setLoading(true);
      
      // Buscar dados do associado
      const { data: associateData, error: associateError } = await supabase
        .from('associates')
        .select(`
          id,
          name,
          cpf,
          rg,
          role,
          company,
          association_date,
          expiration_date,
          photo_url,
          created_at,
          updated_at,
          user_id
        `)
        .eq('id', id)
        .single();

      if (associateError) throw associateError;

      // Formatar as datas
      const formattedAssociate = {
        ...associateData,
        cpf: maskCPF(associateData.cpf),
        rg: maskRG(associateData.rg),
        association_date: associateData.association_date ? 
          new Date(associateData.association_date).toISOString().split('T')[0] : '',
        expiration_date: associateData.expiration_date ? 
          new Date(associateData.expiration_date).toISOString().split('T')[0] : ''
      };

      setEditingAssociate(formattedAssociate);
      setEditModalOpen(true);

    } catch (error) {
      console.error('Erro ao buscar associado:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do associado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!editingAssociate) return;

    try {
      setLoading(true);

      // Verificar se já existe outro associado com este CPF
      const { data: existingAssociate, error: checkError } = await supabase
        .from('associates')
        .select('id, name, cpf')
        .eq('cpf', editingAssociate.cpf.replace(/\D/g, ''))
        .neq('id', editingAssociate.id) // Excluir o próprio associado da verificação
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingAssociate) {
        toast({
          title: "CPF já cadastrado",
          description: `Este CPF já está cadastrado para outro associado: ${existingAssociate.name}`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // 1. Atualizar o associado
      const { error: associateError } = await supabase
        .from('associates')
        .update({
          name: editingAssociate.name,
          cpf: editingAssociate.cpf.replace(/\D/g, ''),
          rg: editingAssociate.rg.replace(/\D/g, ''),
          role: editingAssociate.role,
          company: editingAssociate.company,
          association_date: editingAssociate.association_date,
          expiration_date: editingAssociate.expiration_date
        })
        .eq('id', editingAssociate.id);

      if (associateError) throw associateError;

      // 2. Atualizar o nome do associado em todos os dependentes vinculados
      const { error: dependentsError } = await supabase
        .from('dependents')
        .update({ name_associado: editingAssociate.name })
        .eq('associate_id', editingAssociate.id);

      if (dependentsError) throw dependentsError;

      toast({
        title: "Sucesso",
        description: "Associado atualizado com sucesso",
      });

      setEditModalOpen(false);
      fetchAssociates();

    } catch (error) {
      console.error('Erro ao atualizar associado:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o associado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!editingAssociate) return;

    let newValue = value;

    // Aplicar máscaras
    if (name === 'cpf') {
      newValue = maskCPF(value);
    } else if (name === 'rg') {
      newValue = maskRG(value);
    }

    setEditingAssociate(prev => ({
      ...prev!,
      [name]: newValue,
      ...(name === 'association_date' && value
        ? {
            expiration_date: new Date(
              new Date(value).setFullYear(new Date(value).getFullYear() + 1)
            ).toISOString().split('T')[0]
          }
        : {})
    }));
  };

  // Funções de máscara
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

  const handleEditPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditSelectedImage(URL.createObjectURL(file));
      setEditCropModalOpen(true);
    }
  };

  const handleEditCropComplete = (crop: Crop) => {
    setEditCompletedCrop(crop);
  };

  const handleEditCropSave = async () => {
    if (editImgRef.current && editCompletedCrop) {
      const canvas = document.createElement('canvas');
      const scaleX = editImgRef.current.naturalWidth / editImgRef.current.width;
      const scaleY = editImgRef.current.naturalHeight / editImgRef.current.height;
      canvas.width = editCompletedCrop.width;
      canvas.height = editCompletedCrop.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(
          editImgRef.current,
          editCompletedCrop.x * scaleX,
          editCompletedCrop.y * scaleY,
          editCompletedCrop.width * scaleX,
          editCompletedCrop.height * scaleY,
          0,
          0,
          editCompletedCrop.width,
          editCompletedCrop.height
        );

        // Converter para blob e salvar
        canvas.toBlob(async (blob) => {
          if (blob && editingAssociate) {
            const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
            
            try {
              // Upload da nova imagem
              const photoFileName = `associate-${editingAssociate.id}-${Date.now()}.jpg`;
              const { error: uploadError, data: uploadData } = await supabase.storage
                .from('photos')
                .upload(photoFileName, file);

              if (uploadError) throw uploadError;

              if (uploadData) {
                const { data: { publicUrl } } = supabase.storage
                  .from('photos')
                  .getPublicUrl(uploadData.path);

                // Atualizar o associado com a nova URL da foto
                const { error: updateError } = await supabase
                  .from('associates')
                  .update({ photo_url: publicUrl })
                  .eq('id', editingAssociate.id);

                if (updateError) throw updateError;

                // Atualizar o estado local
                setEditingAssociate({
                  ...editingAssociate,
                  photo_url: publicUrl
                });

                toast({
                  title: "Sucesso",
                  description: "Foto atualizada com sucesso",
                });
              }
            } catch (error) {
              console.error('Erro ao salvar foto:', error);
              toast({
                title: "Erro",
                description: "Não foi possível salvar a foto",
                variant: "destructive",
              });
            }
          }
        }, 'image/jpeg');
      }
    }
    setEditCropModalOpen(false);
  };

  const handleRemovePhoto = async () => {
    if (!editingAssociate) return;

    try {
      setLoading(true);

      // Atualizar o associado removendo a URL da foto
      const { error } = await supabase
        .from('associates')
        .update({ photo_url: null })
        .eq('id', editingAssociate.id);

      if (error) throw error;

      // Atualizar estado local
      setEditingAssociate(prev => ({
        ...prev!,
        photo_url: null
      }));

      toast({
        title: "Sucesso",
        description: "Foto removida com sucesso",
      });

    } catch (error) {
      console.error('Erro ao remover foto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a foto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditDependentClick = async (dependentId: string) => {
    try {
      setLoading(true);

      const { data: dependentData, error } = await supabase
        .from('dependents')
        .select(`
          id,
          name,
          cpf,
          rg,
          company,
          association_date,
          expiration_date,
          photo_url,
          associate_id
        `)
        .eq('id', dependentId)
        .single();

      if (error) throw error;

      // Formatar os dados do dependente
      const formattedDependent = {
        ...dependentData,
        cpf: maskCPF(dependentData.cpf),
        rg: maskRG(dependentData.rg),
        association_date: dependentData.association_date ? 
          new Date(dependentData.association_date).toISOString().split('T')[0] : '',
        expiration_date: dependentData.expiration_date ? 
          new Date(dependentData.expiration_date).toISOString().split('T')[0] : ''
      };

      setEditingDependent(formattedDependent);
      setEditDependentModalOpen(true);

    } catch (error) {
      console.error('Erro ao buscar dependente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do dependente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditDependentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!editingDependent) return;

    let newValue = value;

    // Aplicar máscaras
    if (name === 'cpf') {
      newValue = maskCPF(value);
    } else if (name === 'rg') {
      newValue = maskRG(value);
    }

    setEditingDependent(prev => ({
      ...prev!,
      [name]: newValue,
      ...(name === 'association_date' && value
        ? {
            expiration_date: new Date(
              new Date(value).setFullYear(new Date(value).getFullYear() + 1)
            ).toISOString().split('T')[0]
          }
        : {})
    }));
  };

  const handleEditDependentSave = async () => {
    if (!editingDependent) return;

    try {
      setLoading(true);

      // Verificar se já existe outro dependente com este CPF
      const { data: existingDependent, error: checkError } = await supabase
        .from('dependents')
        .select('id, name, cpf')
        .eq('cpf', editingDependent.cpf.replace(/\D/g, ''))
        .neq('id', editingDependent.id) // Excluir o próprio dependente da verificação
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingDependent) {
        toast({
          title: "CPF já cadastrado",
          description: `Este CPF já está cadastrado para outro dependente: ${existingDependent.name}`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('dependents')
        .update({
          name: editingDependent.name,
          cpf: editingDependent.cpf.replace(/\D/g, ''),
          rg: editingDependent.rg.replace(/\D/g, ''),
          company: editingDependent.company,
          association_date: editingDependent.association_date,
          expiration_date: editingDependent.expiration_date
        })
        .eq('id', editingDependent.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Dependente atualizado com sucesso",
      });

      setEditDependentModalOpen(false);
      fetchAssociates();

    } catch (error) {
      console.error('Erro ao atualizar dependente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o dependente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditDependentPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditDependentSelectedImage(URL.createObjectURL(file));
      setEditDependentPhotoModalOpen(true);
    }
  };

  const handleEditDependentCropComplete = (crop: Crop) => {
    setEditDependentCompletedCrop(crop);
  };

  const handleEditDependentCropSave = async () => {
    if (editDependentImgRef.current && editDependentCompletedCrop && editingDependent) {
      const canvas = document.createElement('canvas');
      const scaleX = editDependentImgRef.current.naturalWidth / editDependentImgRef.current.width;
      const scaleY = editDependentImgRef.current.naturalHeight / editDependentImgRef.current.height;
      canvas.width = editDependentCompletedCrop.width;
      canvas.height = editDependentCompletedCrop.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(
          editDependentImgRef.current,
          editDependentCompletedCrop.x * scaleX,
          editDependentCompletedCrop.y * scaleY,
          editDependentCompletedCrop.width * scaleX,
          editDependentCompletedCrop.height * scaleY,
          0,
          0,
          editDependentCompletedCrop.width,
          editDependentCompletedCrop.height
        );

        // Converter para blob e salvar
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
            
            try {
              // Upload da nova imagem
              const photoFileName = `dependent-${editingDependent.id}-${Date.now()}.jpg`;
              const { error: uploadError, data: uploadData } = await supabase.storage
                .from('photos')
                .upload(photoFileName, file);

              if (uploadError) throw uploadError;

              if (uploadData) {
                const { data: { publicUrl } } = supabase.storage
                  .from('photos')
                  .getPublicUrl(uploadData.path);

                // Atualizar o dependente com a nova URL da foto
                const { error: updateError } = await supabase
                  .from('dependents')
                  .update({ photo_url: publicUrl })
                  .eq('id', editingDependent.id);

                if (updateError) throw updateError;

                // Atualizar o estado local
                setEditingDependent({
                  ...editingDependent,
                  photo_url: publicUrl
                });

                toast({
                  title: "Sucesso",
                  description: "Foto atualizada com sucesso",
                });
              }
            } catch (error) {
              console.error('Erro ao salvar foto:', error);
              toast({
                title: "Erro",
                description: "Não foi possível salvar a foto",
                variant: "destructive",
              });
            }
          }
        }, 'image/jpeg');
      }
    }
    setEditDependentPhotoModalOpen(false);
  };

  const handleRemoveDependentPhoto = async () => {
    if (!editingDependent) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('dependents')
        .update({ photo_url: null })
        .eq('id', editingDependent.id);

      if (error) throw error;

      setEditingDependent(prev => ({
        ...prev!,
        photo_url: null
      }));

      toast({
        title: "Sucesso",
        description: "Foto do dependente removida com sucesso",
      });

    } catch (error) {
      console.error('Erro ao remover foto do dependente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a foto do dependente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <SearchFilters
        searchTerm={searchTerm}
        filters={filters}
        onSearchChange={setSearchTerm}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      <AssociateTable
        associates={associates}
        expandedRows={expandedRows}
        onToggleRow={toggleRow}
        onEdit={handleEditClick}
        onDelete={setDeleteId}
        onDeleteDependent={setDeleteDependentInfo}
        onEditDependent={handleEditDependentClick}
      />

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDeleteAssociate}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir este associado? Todos os dependentes vinculados também serão excluídos. Esta ação não pode ser desfeita."
      />

      <DeleteDialog
        open={!!deleteDependentInfo}
        onOpenChange={(open) => !open && setDeleteDependentInfo(null)}
        onConfirm={handleDeleteDependent}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir o dependente ${deleteDependentInfo?.name}? Esta ação não pode ser desfeita.`}
      />

      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Associado</DialogTitle>
          </DialogHeader>
          
          {editingAssociate && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 col-span-full">
                <Label>Foto</Label>
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                    {editingAssociate.photo_url ? (
                      <>
                        <img
                          src={editingAssociate.photo_url}
                          alt="Foto do associado"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                          title="Remover foto"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleEditPhotoSelect}
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
                  value={editingAssociate.name}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <Input
                  id="rg"
                  name="rg"
                  value={editingAssociate.rg}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={editingAssociate.cpf}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>
                <Input
                  id="role"
                  name="role"
                  value={editingAssociate.role}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  name="company"
                  value={editingAssociate.company}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="association_date">Data de Associação</Label>
                <Input
                  type="date"
                  id="association_date"
                  name="association_date"
                  value={editingAssociate.association_date}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiration_date">Data de Vencimento</Label>
                <Input
                  type="date"
                  id="expiration_date"
                  name="expiration_date"
                  value={editingAssociate.expiration_date}
                  onChange={handleEditChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEditSave}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editCropModalOpen} onOpenChange={setEditCropModalOpen}>
        <DialogContent className="max-w-[500px] h-[480px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Recortar Foto do Associado</DialogTitle>
          </DialogHeader>
          {editSelectedImage && (
            <div>
              <ReactCrop
                crop={editCrop}
                onChange={(c) => setEditCrop(c)}
                onComplete={handleEditCropComplete}
              >
                <img
                  ref={editImgRef}
                  src={editSelectedImage}
                  alt="Crop"
                  style={{ height: '300px', width: 'auto' }}
                  className="object-contain"
                />
              </ReactCrop>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditCropModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleEditCropSave}>
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editDependentModalOpen} onOpenChange={setEditDependentModalOpen}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Dependente</DialogTitle>
          </DialogHeader>
          
          {editingDependent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 col-span-full">
                <Label>Foto</Label>
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                    {editingDependent.photo_url ? (
                      <>
                        <img
                          src={editingDependent.photo_url}
                          alt="Foto do dependente"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveDependentPhoto}
                          className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                          title="Remover foto"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleEditDependentPhotoSelect}
                      className="max-w-xs"
                    />
                    <p className="text-sm text-gray-500">
                      Formatos suportados: JPG, PNG. Tamanho máximo: 5MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dep-name">Nome Completo</Label>
                <Input
                  id="dep-name"
                  name="name"
                  value={editingDependent.name}
                  onChange={handleEditDependentChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dep-rg">RG</Label>
                <Input
                  id="dep-rg"
                  name="rg"
                  value={editingDependent.rg}
                  onChange={handleEditDependentChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dep-cpf">CPF</Label>
                <Input
                  id="dep-cpf"
                  name="cpf"
                  value={editingDependent.cpf}
                  onChange={handleEditDependentChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dep-company">Empresa</Label>
                <Input
                  id="dep-company"
                  name="company"
                  value={editingDependent.company}
                  onChange={handleEditDependentChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dep-association_date">Data de Associação</Label>
                <Input
                  type="date"
                  id="dep-association_date"
                  name="association_date"
                  value={editingDependent.association_date}
                  onChange={handleEditDependentChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dep-expiration_date">Data de Vencimento</Label>
                <Input
                  type="date"
                  id="dep-expiration_date"
                  name="expiration_date"
                  value={editingDependent.expiration_date}
                  onChange={handleEditDependentChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setEditDependentModalOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEditDependentSave}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editDependentPhotoModalOpen} onOpenChange={setEditDependentPhotoModalOpen}>
        <DialogContent className="max-w-[500px] h-[480px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Recortar Foto do Dependente</DialogTitle>
          </DialogHeader>
          {editDependentSelectedImage && (
            <div>
              <ReactCrop
                crop={editDependentCrop}
                onChange={(c) => setEditDependentCrop(c)}
                onComplete={handleEditDependentCropComplete}
              >
                <img
                  ref={editDependentImgRef}
                  src={editDependentSelectedImage}
                  alt="Crop"
                  style={{ height: '300px', width: 'auto' }}
                  className="object-contain"
                />
              </ReactCrop>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditDependentPhotoModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleEditDependentCropSave}>
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dependentCropModalOpen} onOpenChange={setDependentCropModalOpen}>
        <DialogContent className="max-w-[500px] h-[480px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Recortar Foto do Dependente</DialogTitle>
          </DialogHeader>
          {dependentSelectedImage && (
            <div>
              <ReactCrop
                crop={dependentCrop}
                onChange={(c) => setDependentCrop(c)}
                onComplete={handleDependentCropComplete}
              >
                <img
                  ref={dependentImgRef}
                  src={dependentSelectedImage}
                  alt="Crop"
                  style={{ height: '300px', width: 'auto' }}
                  className="object-contain"
                />
              </ReactCrop>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setDependentCropModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleDependentCropSave}>
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Associates;