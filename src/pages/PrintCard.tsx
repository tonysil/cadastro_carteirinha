import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Layout } from '@/integrations/supabase/types';
import { Search, Eye, ChevronDown, ChevronRight, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

// Adicionar interface para posições
interface Position {
  x: number;
  y: number;
}

interface Associate {
  id: string;
  name: string;
  photo_url?: string;
  cpf?: string;
  rg?: string;
  role?: string;
  company?: string;
  association_date?: string;
  expiration_date?: string;
  dependents?: Dependent[];
}

interface Dependent {
  id: string;
  name: string;
  photo_url?: string;
  cpf?: string;
  rg?: string;
  associate_id: string;
  company?: string;
  association_date?: string;
  expiration_date?: string;
  name_associado?: string;
}

// Atualizar a interface do PrintPreview
interface PrintPreviewProps {
  layouts: Layout[];
  associates: Associate[];
  dependents: Dependent[];
  associateLayouts: Map<string, string>;
  dependentLayouts: Map<string, string>;
  onClose: () => void;
}

const PrintPreview = ({ 
  layouts, 
  associates, 
  dependents,
  associateLayouts,
  dependentLayouts,
  onClose 
}: PrintPreviewProps) => {
  const getLayout = (id: string, isDependent: boolean): Layout | undefined => {
    const layoutId = isDependent ? dependentLayouts.get(id) : associateLayouts.get(id);
    return layouts.find(l => l.id === layoutId);
  };

  const printItems = [
    ...associates.map(associate => ({
      id: associate.id,
      person: associate,
      layout: getLayout(associate.id, false),
      isDependent: false,
      associate: undefined
    })),
    ...dependents.map(dependent => {
      const associateParent = associates.find(a => 
        a.dependents?.some(d => d.id === dependent.id)
      );
      return {
        id: dependent.id,
        person: dependent,
        layout: getLayout(dependent.id, true),
        isDependent: true,
        associate: associateParent
      };
    })
  ].filter(item => item.layout);

  // Dividir itens em páginas de 4
  const pages = [];
  for (let i = 0; i < printItems.length; i += 4) {
    pages.push(printItems.slice(i, i + 4));
  }

  return (
    <div className="print-only">
      <style type="text/css" media="print">
        {`
          @page {
            size: 210mm 297mm;
            margin: 0;
            padding: 0;
          }
          @media print {
            body * {
              visibility: hidden;
            }
            .print-only,
            .print-only * {
              visibility: visible;
            }
            .print-only {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .print-page {
              width: 210mm;
              min-height: 297mm;
              padding: 10mm;
              box-sizing: border-box;
              page-break-after: always;
              display: flex;
              flex-direction: column;
              gap: 10mm;
            }
            .print-page:last-child {
              page-break-after: auto;
            }
            .card-item {
              width: 823px !important;
              height: 258px !important;
              position: relative !important;
              margin: 0 auto !important;
              background: white !important;
              page-break-inside: avoid !important;
            }
          }
        `}
      </style>

      {pages.map((pageItems, pageIndex) => (
        <div key={pageIndex} className="print-page">
          {pageItems.map((item) => (
            <div 
              key={item.id} 
              className="card-item"
              data-card-type={item.isDependent ? 'dependent' : 'associate'}
            >
              <CardWithPhoto 
                person={item.person}
                layout={item.layout}
                isDependent={item.isDependent}
                associate={item.associate}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Atualizar a interface do CardWithPhoto
interface CardWithPhotoProps {
  person: Associate | Dependent;
  layout: Layout;
  isDependent?: boolean;
  associate?: Associate;
}

// Atualizar interface do Layout
interface CardLayout {
  id: string;
  title: string;
  type: 'associate' | 'dependent';
  positions: {
    name: { x: number; y: number };
    photo: { x: number; y: number };
    rg: { x: number; y: number };
    cpf: { x: number; y: number };
    role: { x: number; y: number };
    company: { x: number; y: number };
    association_date: { x: number; y: number };
    expiration_date: { x: number; y: number };
    dependent_name: { x: number; y: number };
    associate_name: { x: number; y: number };
  };
  visibility: {
    show_name: boolean;
    show_photo: boolean;
    show_rg: boolean;
    show_cpf: boolean;
    show_role: boolean;
    show_company: boolean;
    show_association_date: boolean;
    show_expiration_date: boolean;
    show_dependent_name: boolean;
    show_associate_name: boolean;
  };
}

// Atualizar o CardWithPhoto para exibir todas as informações do Associado
const CardWithPhoto = ({ 
  person, 
  layout,
  isDependent = false, 
  associate 
}: CardWithPhotoProps) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Carregar dados do layout
  useEffect(() => {
    if (!layout) return;

    // Aplicar configurações do layout
    const applyLayoutSettings = () => {
      // Posições dos elementos
      const positions = {
        dependent_name: layout.dependent_name_position,
        name: layout.name_position,
        rg: layout.rg_position,
        cpf: layout.cpf_position,
        company: layout.company_position,
        role: layout.role_position,
        photo: layout.photo_position,
        associate_name: layout.associate_name_position,
        association_date: layout.association_date_position,
        expiration_date: layout.expiration_date_position
      };

      // Visibilidade dos elementos
      const visibility = {
        show_name: layout.show_name,
        show_rg: layout.show_rg,
        show_cpf: layout.show_cpf,
        show_company: layout.show_company,
        show_role: layout.show_role,
        show_photo: layout.show_photo,
        show_associate_name: layout.show_associate_name,
        show_association_date: layout.show_association_date,
        show_expiration_date: layout.show_expiration_date,
        show_dependent_name: layout.show_dependent_name
      };

      // Aplicar configurações
      Object.entries(positions).forEach(([key, position]) => {
        const element = document.querySelector(`[data-field="${key}"]`);
        if (element && position) {
          element.setAttribute('style', `left: ${position.x}px; top: ${position.y}px`);
        }
      });

      Object.entries(visibility).forEach(([key, visible]) => {
        const element = document.querySelector(`[data-field="${key}"]`);
        if (element) {
          element.style.display = visible ? 'block' : 'none';
        }
      });
    };

    applyLayoutSettings();
  }, [layout]);

  useEffect(() => {
    const loadAssociatePhoto = async () => {
      try {
        if (!person.photo_url) {
          console.log('Sem foto cadastrada para:', person.name);
          return;
        }

        // Limpar estados
        setPhotoUrl(null);
        setImageError(false);

        // Se já for uma URL completa do Supabase, usar diretamente
        if (person.photo_url.includes('supabase.co')) {
          setPhotoUrl(person.photo_url);
          return;
        }

        // Caso contrário, obter URL pública
        const { data } = await supabase.storage
          .from('photos')
          .getPublicUrl(person.photo_url);

        if (data?.publicUrl) {
          setPhotoUrl(data.publicUrl);
          return;
        }

        // Se não conseguiu obter a URL, marcar erro
        setImageError(true);
        console.error('Não foi possível obter URL da foto:', {
          pessoa: person.name,
          photo_url: person.photo_url
        });

      } catch (error) {
        console.error('Erro ao processar foto:', {
          pessoa: person.name,
          erro: error
        });
        setImageError(true);
      }
    };

    loadAssociatePhoto();
  }, [person.photo_url, person.name]);

  // Formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="w-[825px] h-[260px] relative mx-auto mb-8">
      <Card className="w-full h-full relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {layout.background_image && (
            <img
              src={layout.background_image}
              alt="Background"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Dados da pessoa */}
        <div className="absolute inset-0 p-4">
          {/* Nome do Associado ou Nome do Titular do Dependente */}
          {layout.name_position && (
            <div 
              className="absolute uppercase"
              style={{
                left: `${layout.name_position.x}px`,
                top: `${layout.name_position.y}px`,
                fontSize: '0.95em',
                fontWeight: 'bold'
              }}
            >
              {isDependent ? 
                (person as Dependent).name_associado || 'Não informado' : 
                person.name.toUpperCase()
              }
            </div>
          )}

          {/* Nome do Dependente */}
          {isDependent && layout.dependent_name_position && (
            <div 
              className="absolute uppercase"
              style={{
                left: `${layout.dependent_name_position.x}px`,
                top: `${layout.dependent_name_position.y}px`,
                fontSize: '0.95em',
                fontWeight: 'bold'
              }}
            >
              {person.name.toUpperCase()}
            </div>
          )}

          {/* Nome do Titular usando name_position */}
          {isDependent && associate && layout.name_position && (
            <div 
              className="absolute uppercase"
              style={{
                left: `${layout.name_position.x}px`,
                top: `${layout.name_position.y}px`,
                fontSize: '0.955em',
                fontWeight: 'bold',
                display: 'block'
              }}
            >
              {associate.name.toUpperCase()}
            </div>
          )}

          {/* RG */}
          <div 
            data-field="rg"
            className="absolute uppercase"
            style={{
              display: layout.show_rg ? 'block' : 'none',
              left: layout.rg_position?.x,
              top: layout.rg_position?.y,
              fontSize: '0.85em !important'
            }}
          >
            RG: {person.rg?.toUpperCase()}
          </div>

          {/* CPF */}
          <div 
            data-field="cpf"
            className="absolute uppercase"
            style={{
              display: layout.show_cpf ? 'block' : 'none',
              left: layout.cpf_position?.x,
              top: layout.cpf_position?.y,
              fontSize: '0.85em !important'
            }}
          >
            CPF: {person.cpf?.toUpperCase()}
          </div>

          {/* Nome do Titular (para dependentes) */}
          {isDependent && (
            <div 
              data-field="associate_name"
              className="absolute"
              style={{
                display: layout.show_associate_name ? 'block' : 'none',
                left: layout.associate_name_position?.x,
                top: layout.associate_name_position?.y,
                fontSize: '0.995em'
              }}
            >
              NOME/TIT: {(person as Dependent).name_associado}
            </div>
          )}

          {/* Foto */}
          {layout.show_photo && layout.photo_position && (
            <div 
              className="absolute"
              style={{
                left: `${layout.photo_position.x}px`,
                top: `${layout.photo_position.y}px`,
              }}
            >
              <div className="w-[100px] h-[130px] bg-gray-100 rounded overflow-hidden border">
                {photoUrl && !imageError ? (
                  <img 
                    src={photoUrl}
                    alt={`Foto de ${person.name}`}
                    className="w-full h-full object-cover"
                    onError={() => {
                      console.error('Erro ao exibir imagem:', person.photo_url);
                      setImageError(true);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-xs">
                      {imageError ? 'Erro ao carregar foto' : 'Sem foto'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cargo - 0.79rem */}
          {!isDependent && layout.show_role && layout.role_position && person.role && (
            <div 
              className="absolute uppercase"
              style={{
                left: `${layout.role_position.x}px`,
                top: `${layout.role_position.y}px`,
                fontSize: '0.8em'
              }}
            >
              CARGO: {person.role.toUpperCase()}
            </div>
          )}

          {/* Empresa - Usar dados do próprio dependente */}
          {layout.company_position && (
            <div 
              data-field="company"
              className="absolute uppercase"
              style={{
                left: `${layout.company_position.x}px`,
                top: `${layout.company_position.y}px`,
                fontSize: '0.8em',
                display: 'block'
              }}
            >
              EMPRESA: {isDependent ? 
                (person as Dependent).company || 'Não informada' : 
                (person as Associate).company
              }
            </div>
          )}

          {/* Data de Associação - Usar dados do próprio dependente */}
          {layout.show_association_date && layout.association_date_position && (
            <div 
              className="absolute"
              style={{
                left: `${layout.association_date_position.x}px`,
                top: `${layout.association_date_position.y}px`,
                fontSize: '0.78em'
              }}
            >
              Associação: {formatDate(person.association_date)}
            </div>
          )}

          {/* Data de Validade - Usar dados do próprio dependente */}
          {layout.show_expiration_date && layout.expiration_date_position && (
            <div 
              className="absolute"
              style={{
                left: `${layout.expiration_date_position.x}px`,
                top: `${layout.expiration_date_position.y}px`,
                fontSize: '0.78em'
              }}
            >
              Validade: {formatDate(person.expiration_date)}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

const PrintCard = () => {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [filteredLayouts, setFilteredLayouts] = useState<Layout[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const { toast } = useToast();
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [filteredAssociates, setFilteredAssociates] = useState<Associate[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedAssociates, setSelectedAssociates] = useState<Set<string>>(new Set());
  const [selectedDependents, setSelectedDependents] = useState<Set<string>>(new Set());
  const [associateLayouts, setAssociateLayouts] = useState<Map<string, string>>(new Map());
  const [dependentLayouts, setDependentLayouts] = useState<Map<string, string>>(new Map());
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 6;

  // Carregar layouts
  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('layouts')
          .select('*')
          .order('title');

        if (error) throw error;

        if (data) {
          const parsedLayouts = data.map(layout => ({
            ...layout,
            name_position: typeof layout.name_position === 'string' ? 
              JSON.parse(layout.name_position) : layout.name_position || { x: 10, y: 40 },
            photo_position: typeof layout.photo_position === 'string' ? 
              JSON.parse(layout.photo_position) : layout.photo_position,
            rg_position: typeof layout.rg_position === 'string' ? 
              JSON.parse(layout.rg_position) : layout.rg_position,
            cpf_position: typeof layout.cpf_position === 'string' ? 
              JSON.parse(layout.cpf_position) : layout.cpf_position,
            role_position: typeof layout.role_position === 'string' ? 
              JSON.parse(layout.role_position) : layout.role_position,
            company_position: typeof layout.company_position === 'string' ? 
              JSON.parse(layout.company_position) : layout.company_position,
            association_date_position: typeof layout.association_date_position === 'string' ? 
              JSON.parse(layout.association_date_position) : layout.association_date_position,
            expiration_date_position: typeof layout.expiration_date_position === 'string' ? 
              JSON.parse(layout.expiration_date_position) : layout.expiration_date_position,
            dependent_name_position: typeof layout.dependent_name_position === 'string' ? 
              JSON.parse(layout.dependent_name_position) : layout.dependent_name_position,
          }));

          setLayouts(parsedLayouts);
          setFilteredLayouts(parsedLayouts);
        }
      } catch (error) {
        console.error('Erro ao carregar layouts:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os layouts",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLayouts();
  }, [toast]);

  // Filtrar layouts
  useEffect(() => {
    const filtered = layouts.filter(layout =>
      layout.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLayouts(filtered);
  }, [searchTerm, layouts]);

  // Carregar associados
  useEffect(() => {
    const fetchAssociates = async () => {
      try {
        // Primeiro, obter o total de registros
        const { count } = await supabase
          .from('associates')
          .select('*', { count: 'exact', head: true });

        setTotalCount(count || 0);

        // Depois, buscar os dados paginados
        const from = currentPage * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const { data, error } = await supabase
          .from('associates')
          .select(`
            id,
            name,
            photo_url,
            cpf,
            rg,
            role,
            company,
            association_date,
            expiration_date,
            dependents (
              id,
              name,
              photo_url,
              cpf,
              rg,
              associate_id,
              company,
              association_date,
              expiration_date,
              name_associado
            )
          `)
          .range(from, to)
          .order('name');

        if (error) throw error;

        if (data) {
          const associatesWithDependents = data.map(associate => ({
            ...associate,
            dependents: associate.dependents?.map(dependent => ({
              ...dependent,
              company: dependent.company || associate.company
            }))
          }));

          setAssociates(associatesWithDependents);
          setFilteredAssociates(associatesWithDependents);
        }
      } catch (error) {
        console.error('Erro ao carregar associados:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os associados",
          variant: "destructive"
        });
      }
    };

    fetchAssociates();
  }, [currentPage]);

  // Filtrar associados e dependentes
  useEffect(() => {
    const filtered = associates.filter(associate => {
      const matchAssociate = associate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            associate.cpf?.includes(searchTerm) ||
                            associate.rg?.includes(searchTerm);

      const matchDependents = associate.dependents?.some(dependent =>
        dependent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dependent.cpf?.includes(searchTerm) ||
        dependent.rg?.includes(searchTerm)
      );

      return matchAssociate || matchDependents;
    });

    setFilteredAssociates(filtered);
  }, [searchTerm, associates]);

  // Funções auxiliares
  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const toggleAssociate = (id: string) => {
    const newSelected = new Set(selectedAssociates);
    if (newSelected.has(id)) {
      newSelected.delete(id);
      // Remover dependentes do associado
      const associate = associates.find(a => a.id === id);
      associate?.dependents?.forEach(d => {
        selectedDependents.delete(d.id);
      });
    } else {
      newSelected.add(id);
    }
    setSelectedAssociates(newSelected);
  };

  const toggleDependent = (id: string) => {
    const newSelected = new Set(selectedDependents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDependents(newSelected);
  };

  // Função para imprimir carteirinhas
  const handlePrint = async () => {
    const selectedItems = new Map<string, Layout>();

    // Verificar se há itens selecionados
    if (selectedAssociates.size === 0 && selectedDependents.size === 0) {
      toast({
        title: "Aviso",
        description: "Selecione pelo menos uma carteirinha para impressão",
        variant: "warning"
      });
      return;
    }

    // Coletar layouts selecionados para associados
    for (const associateId of selectedAssociates) {
      const layoutId = associateLayouts.get(associateId);
      if (!layoutId) {
        toast({
          title: "Aviso",
          description: "Selecione um layout para todos os itens selecionados",
          variant: "warning"
        });
        return;
      }
      const layout = layouts.find(l => l.id === layoutId);
      if (layout) selectedItems.set(associateId, layout);
    }

    // Coletar layouts selecionados para dependentes
    for (const dependentId of selectedDependents) {
      const layoutId = dependentLayouts.get(dependentId);
      if (!layoutId) {
        toast({
          title: "Aviso",
          description: "Selecione um layout para todos os itens selecionados",
          variant: "warning"
        });
        return;
      }
      const layout = layouts.find(l => l.id === layoutId);
      if (layout) selectedItems.set(dependentId, layout);
    }

    try {
      // Preparar para impressão
      setShowPrintPreview(true);
      
      // Aguardar o DOM atualizar
      setTimeout(() => {
        window.print();
      }, 100);
    } catch (error) {
      console.error('Erro ao imprimir:', error);
      toast({
        title: "Erro",
        description: "Não foi possível imprimir as carteirinhas",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        {/* Cabeçalho com seleção de layout e busca */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Impressão de Carteirinhas</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CPF ou RG..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
          </div>
        </div>

        {/* Barra de ações */}
        <div className="flex items-center justify-end bg-white p-4 rounded-lg shadow-sm">
          <Button
            onClick={handlePrint}
            disabled={selectedAssociates.size === 0 && selectedDependents.size === 0}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Imprimir Selecionados ({selectedAssociates.size + selectedDependents.size})
          </Button>
        </div>

        {/* Tabela atualizada */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>RG</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Layout</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssociates.map((associate) => (
                <React.Fragment key={associate.id}>
                  {/* Linha do Associado */}
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        checked={selectedAssociates.has(associate.id)}
                        onCheckedChange={() => toggleAssociate(associate.id)}
                      />
                    </TableCell>
                    <TableCell>
                      {associate.dependents && associate.dependents.length > 0 && (
                        <button
                          onClick={() => toggleRow(associate.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {expandedRows.has(associate.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{associate.name}</TableCell>
                    <TableCell>{associate.cpf}</TableCell>
                    <TableCell>{associate.rg}</TableCell>
                    <TableCell>{associate.role}</TableCell>
                    <TableCell>{associate.company}</TableCell>
                    <TableCell>{associate.expiration_date}</TableCell>
                    <TableCell>
                      <select
                        value={associateLayouts.get(associate.id) || ""}
                        onChange={(e) => {
                          const newLayouts = new Map(associateLayouts);
                          newLayouts.set(associate.id, e.target.value);
                          setAssociateLayouts(newLayouts);
                        }}
                        className="border rounded-md px-2 py-1 text-sm w-full"
                        disabled={!selectedAssociates.has(associate.id)}
                      >
                        <option value="">Selecione um layout</option>
                        {layouts.map((layout) => (
                          <option key={layout.id} value={layout.id}>
                            {layout.title}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                  </TableRow>

                  {/* Linhas dos Dependentes */}
                  {expandedRows.has(associate.id) && associate.dependents?.map(dependent => (
                    <TableRow key={dependent.id} className="bg-gray-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedDependents.has(dependent.id)}
                          onCheckedChange={() => toggleDependent(dependent.id)}
                        />
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell className="pl-8">
                        <span className="text-gray-500">└─</span> {dependent.name}
                      </TableCell>
                      <TableCell>{dependent.cpf}</TableCell>
                      <TableCell>{dependent.rg}</TableCell>
                      <TableCell className="font-medium">
                        {dependent.company || 'Não informada'}
                      </TableCell>
                      <TableCell colSpan={2} className="text-gray-500">
                        Dependente
                      </TableCell>
                      <TableCell>
                        <select
                          value={dependentLayouts.get(dependent.id) || ""}
                          onChange={(e) => {
                            const newLayouts = new Map(dependentLayouts);
                            newLayouts.set(dependent.id, e.target.value);
                            setDependentLayouts(newLayouts);
                          }}
                          className="border rounded-md px-2 py-1 text-sm w-full"
                          disabled={!selectedDependents.has(dependent.id)}
                        >
                          <option value="">Selecione um layout</option>
                          {layouts.map((layout) => (
                            <option key={layout.id} value={layout.id}>
                              {layout.title}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Adicionar paginação */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando {filteredAssociates.length} de {totalCount} registros
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              disabled={(currentPage + 1) * ITEMS_PER_PAGE >= totalCount}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>

        {/* Preview de Impressão */}
        {showPrintPreview && (
          <div className="hidden print:block">
            <PrintPreview
              layouts={layouts}
              associates={associates.filter(a => selectedAssociates.has(a.id))}
              dependents={associates
                .flatMap(a => a.dependents || [])
                .filter(d => selectedDependents.has(d.id))}
              associateLayouts={associateLayouts}
              dependentLayouts={dependentLayouts}
              onClose={() => setShowPrintPreview(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintCard;

