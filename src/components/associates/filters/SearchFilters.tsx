import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchFiltersProps {
  searchTerm: string;
  filters: {
    name: string;
    cpf: string;
    rg: string;
    role: string;
    company: string;
    status: string;
  };
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

const SearchFilters = ({
  searchTerm,
  filters,
  onSearchChange,
  onFilterChange,
  onClearFilters,
}: SearchFiltersProps) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={onClearFilters}>
          Limpar Filtros
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          placeholder="Nome"
          value={filters.name}
          onChange={(e) => onFilterChange('name', e.target.value)}
        />
        <Input
          placeholder="CPF"
          value={filters.cpf}
          onChange={(e) => onFilterChange('cpf', e.target.value)}
        />
        <Input
          placeholder="RG"
          value={filters.rg}
          onChange={(e) => onFilterChange('rg', e.target.value)}
        />
        <Input
          placeholder="Cargo"
          value={filters.role}
          onChange={(e) => onFilterChange('role', e.target.value)}
        />
        <Input
          placeholder="Empresa"
          value={filters.company}
          onChange={(e) => onFilterChange('company', e.target.value)}
        />
        <select
          className="border rounded-md px-3 py-2"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="active">Ativos</option>
          <option value="expired">Vencidos</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;