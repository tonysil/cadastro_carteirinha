import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintCardHeaderProps {
  selectedLayout: string;
  layouts: Array<{ title: string }>;
  onLayoutChange: (value: string) => void;
  onPrint: () => void;
  isDisabled: boolean;
}

const PrintCardHeader = ({
  selectedLayout,
  layouts,
  onLayoutChange,
  onPrint,
  isDisabled,
}: PrintCardHeaderProps) => {
  return (
    <div className="flex flex-col gap-8 mb-8 print:hidden">
      <h1 className="text-2xl font-bold">Impressão de Carteirinha</h1>
      <div className="flex items-center justify-end gap-4">
        <Select value={selectedLayout} onValueChange={onLayoutChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione o layout" />
          </SelectTrigger>
          <SelectContent>
            {layouts.map((layout) => (
              <SelectItem key={layout.title} value={layout.title}>
                {layout.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={onPrint} disabled={isDisabled}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimir
        </Button>
      </div>
    </div>
  );
};

export default PrintCardHeader;