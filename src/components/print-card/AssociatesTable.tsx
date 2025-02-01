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
import { ChevronDown, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Associate {
  id: string;
  name: string;
  rg: string;
  cpf: string;
  role: string;
  company: string;
  association_date: string;
  expiration_date: string;
  photo_url?: string | null;
  dependents?: Dependent[];
}

interface Dependent {
  id: string;
  name: string;
  rg: string;
  cpf: string;
  photo_url?: string | null;
}

interface AssociatesTableProps {
  associates: Associate[];
  expandedRows: Set<string>;
  selectedId: string;
  selectedDependentIds: Set<string>;
  toggleRow: (id: string) => void;
  setSelectedId: (id: string) => void;
  toggleDependentSelection: (id: string) => void;
  formatDate: (date: string) => string;
}

const AssociatesTable = ({
  associates,
  expandedRows,
  selectedId,
  selectedDependentIds,
  toggleRow,
  setSelectedId,
  toggleDependentSelection,
  formatDate,
}: AssociatesTableProps) => {
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
            <TableHead>Data Associação</TableHead>
            <TableHead>Data Expiração</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {associates?.map((associate) => (
            <React.Fragment key={associate.id}>
              <TableRow
                className={selectedId === associate.id ? "bg-muted/50" : ""}
                onClick={() => setSelectedId(associate.id)}
              >
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRow(associate.id);
                    }}
                  >
                    {expandedRows.has(associate.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{associate.name}</TableCell>
                <TableCell>{associate.cpf}</TableCell>
                <TableCell>{associate.rg}</TableCell>
                <TableCell>{associate.role}</TableCell>
                <TableCell>{associate.company}</TableCell>
                <TableCell>{formatDate(associate.association_date)}</TableCell>
                <TableCell>{formatDate(associate.expiration_date)}</TableCell>
              </TableRow>
              {expandedRows.has(associate.id) && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="pl-12 py-4">
                      <h3 className="font-semibold mb-4">Dependentes</h3>
                      {associate.dependents && associate.dependents.length > 0 ? (
                        <div className="space-y-4">
                          {associate.dependents.map((dependent) => (
                            <div
                              key={dependent.id}
                              className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                            >
                              <div className="flex items-center gap-4">
                                <Checkbox
                                  checked={selectedDependentIds.has(dependent.id)}
                                  onCheckedChange={() =>
                                    toggleDependentSelection(dependent.id)
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                />
                                {dependent.photo_url ? (
                                  <img
                                    src={`${
                                      import.meta.env.VITE_SUPABASE_URL
                                    }/storage/v1/object/public/photos/${
                                      dependent.photo_url
                                    }`}
                                    alt={`Foto de ${dependent.name}`}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                                )}
                                <div>
                                  <p className="font-medium">{dependent.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    CPF: {dependent.cpf} | RG: {dependent.rg}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          Nenhum dependente cadastrado
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssociatesTable;