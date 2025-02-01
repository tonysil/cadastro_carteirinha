import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Copy, Trash2 } from "lucide-react";

interface LayoutControlsProps {
  title: string;
  onTitleChange: (title: string) => void;
  onAddLayout: () => void;
  onDuplicateLayout: () => void;
  onDeleteLayout: () => void;
  layoutCount: number;
  currentLayoutIndex: number;
  onLayoutSelect: (index: number) => void;
  layouts: { title: string }[];
}

export const LayoutControls: React.FC<LayoutControlsProps> = ({
  title,
  onTitleChange,
  onAddLayout,
  onDuplicateLayout,
  onDeleteLayout,
  layoutCount,
  currentLayoutIndex,
  onLayoutSelect,
  layouts,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Label htmlFor="layoutTitle" className="whitespace-nowrap">Título do Layout</Label>
        <Input
          id="layoutTitle"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="max-w-xs"
        />
      </div>
      
      <div className="flex gap-4">
        <Button onClick={onAddLayout}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Layout
        </Button>
        <Button onClick={onDuplicateLayout}>
          <Copy className="w-4 h-4 mr-2" />
          Duplicar Layout
        </Button>
        <Button 
          variant="destructive"
          onClick={onDeleteLayout}
          disabled={layoutCount <= 1}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir Layout
        </Button>
      </div>

      {layouts.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {layouts.map((layout, index) => (
            <Button
              key={index}
              variant={currentLayoutIndex === index ? "default" : "outline"}
              onClick={() => onLayoutSelect(index)}
              className="min-w-[120px]"
            >
              {layout.title}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};