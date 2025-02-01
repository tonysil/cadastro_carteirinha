import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Copy, Trash2 } from "lucide-react";
import { Layout } from "@/types/layout";

interface LayoutSelectorProps {
  layouts: Layout[];
  currentLayoutIndex: number;
  onLayoutChange: (index: number) => void;
  onAddLayout: () => void;
  onDuplicateLayout: () => void;
  onDeleteClick: () => void;
}

const LayoutSelector = ({
  layouts,
  currentLayoutIndex,
  onLayoutChange,
  onAddLayout,
  onDuplicateLayout,
  onDeleteClick,
}: LayoutSelectorProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="layoutSelect" className="font-medium">
          Layout Atual:
        </label>
        <select
          id="layoutSelect"
          value={currentLayoutIndex}
          onChange={(e) => onLayoutChange(Number(e.target.value))}
          className="border rounded-md px-3 py-1.5 bg-white min-w-[200px]"
        >
          {layouts.map((layout, index) => (
            <option key={index} value={index}>
              {layout.title}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          onClick={onAddLayout} 
          variant="outline" 
          size="sm"
          className="whitespace-nowrap"
        >
          <Plus className="h-4 w-4 mr-1" />
          Novo Layout
        </Button>
        <Button 
          onClick={onDuplicateLayout} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Duplicar
        </Button>
        <Button 
          onClick={onDeleteClick} 
          variant="destructive" 
          size="sm"
          className="whitespace-nowrap"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir
        </Button>
      </div>
    </div>
  );
};

export default LayoutSelector;