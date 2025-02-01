import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit, Trash2, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Associate {
  id: string;
  name: string;
  cpf: string;
  rg: string;
  role: string;
  company: string;
  expiration_date: string;
  dependents?: Array<{
    id: string;
    name: string;
    cpf: string;
    rg: string;
  }>;
}

interface AssociateTableProps {
  associates: Associate[];
  expandedRows: Set<string>;
  onToggleRow: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteDependent: (info: { id: string; name: string; associateId: string }) => void;
  onEditDependent: (id: string) => void;
}

const AssociateTable = ({
  associates,
  expandedRows,
  onToggleRow,
  onEdit,
  onDelete,
  onDeleteDependent,
  onEditDependent,
}: AssociateTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>RG</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Validade</TableHead>
            <TableHead className="w-[150px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {associates.map((associate) => (
            <React.Fragment key={associate.id}>
              <TableRow>
                <TableCell>
                  {associate.dependents && associate.dependents.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleRow(associate.id)}
                    >
                      {expandedRows.has(associate.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </TableCell>
                <TableCell className="font-medium">{associate.name}</TableCell>
                <TableCell>{associate.cpf}</TableCell>
                <TableCell>{associate.rg}</TableCell>
                <TableCell>{associate.role}</TableCell>
                <TableCell>{associate.company}</TableCell>
                <TableCell>{associate.expiration_date}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/associados/${associate.id}/dependentes/adicionar`)}
                      className="hover:bg-primary/20"
                      title="Adicionar Dependente"
                    >
                      <UserPlus className="h-4 w-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(associate.id)}
                      className="hover:bg-primary/20"
                    >
                      <Edit className="h-4 w-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(associate.id)}
                      className="hover:bg-destructive/20"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              {expandedRows.has(associate.id) &&
                associate.dependents?.map((dependent) => (
                  <TableRow key={dependent.id} className="bg-gray-50">
                    <TableCell></TableCell>
                    <TableCell className="pl-8">
                      <span className="text-gray-500">└─</span> {dependent.name}
                    </TableCell>
                    <TableCell>{dependent.cpf}</TableCell>
                    <TableCell>{dependent.rg}</TableCell>
                    <TableCell colSpan={3} className="text-gray-500">
                      Dependente
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditDependent(dependent.id)}
                          className="hover:bg-primary/20"
                        >
                          <Edit className="h-4 w-4 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            onDeleteDependent({
                              id: dependent.id,
                              name: dependent.name,
                              associateId: associate.id,
                            })
                          }
                          className="hover:bg-destructive/20"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssociateTable;