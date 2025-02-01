import React from "react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Erro ao carregar associados</p>
        <Button onClick={onRetry}>Tentar novamente</Button>
      </div>
    </div>
  );
};

export default ErrorState;