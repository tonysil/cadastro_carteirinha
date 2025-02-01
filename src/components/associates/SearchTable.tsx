import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Associate {
  id: string;
  name: string;
  rg: string;
  cpf: string;
  company: string;
}

interface SearchTableProps {
  associates: Associate[];
  onSelect?: (id: string) => void;
  selectedId?: string;
}

const SearchTable = ({ associates, onSelect, selectedId }: SearchTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAssociates = associates.filter((associate) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      associate.name.toLowerCase().includes(searchLower) ||
      associate.company.toLowerCase().includes(searchLower) ||
      associate.cpf.includes(searchTerm) ||
      associate.rg.includes(searchTerm)
    );
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Pesquisar por nome, empresa, CPF ou RG..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>RG</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssociates.map((associate) => (
              <TableRow
                key={associate.id}
                className={`cursor-pointer hover:bg-muted ${
                  selectedId === associate.id ? "bg-muted" : ""
                }`}
                onClick={() => onSelect?.(associate.id)}
              >
                <TableCell>{associate.name}</TableCell>
                <TableCell>{associate.company}</TableCell>
                <TableCell>{associate.cpf}</TableCell>
                <TableCell>{associate.rg}</TableCell>
              </TableRow>
            ))}
            {filteredAssociates.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Nenhum resultado encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SearchTable;