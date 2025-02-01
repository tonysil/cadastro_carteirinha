import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalCount,
  itemsPerPage,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Mostrando {Math.min(itemsPerPage, totalCount - currentPage * itemsPerPage)} de {totalCount} registros
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          disabled={(currentPage + 1) * itemsPerPage >= totalCount}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
};

export default Pagination;