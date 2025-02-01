import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Position } from "@/types/layout";

interface PositionControlProps {
  label: string;
  position: Position;
  onChange: (position: Position) => void;
  field: string;
  visible: boolean;
  onVisibilityChange: (value: boolean) => void;
}

const PositionControl = ({
  label,
  position,
  onChange,
  field,
  visible,
  onVisibilityChange,
}: PositionControlProps) => {
  const handleXChange = (value: string) => {
    const x = Math.min(Math.max(parseInt(value) || 0, 0), 825);
    onChange({ ...position, x });
  };

  const handleYChange = (value: string) => {
    const y = Math.min(Math.max(parseInt(value) || 0, 0), 260);
    onChange({ ...position, y });
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <Label className="font-medium">{label}</Label>
        <div className="flex items-center gap-2">
          <Label className="text-sm text-gray-600">
            {visible ? "Visível" : "Oculto"}
          </Label>
          <Switch
            checked={visible}
            onCheckedChange={onVisibilityChange}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      </div>

      {visible && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">Posição X</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[position.x]}
                  min={0}
                  max={825}
                  step={1}
                  onValueChange={([x]) => onChange({ ...position, x })}
                  className="w-[200px]"
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={position.x}
                    onChange={(e) => handleXChange(e.target.value)}
                    className="w-[80px]"
                    min={0}
                    max={825}
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">Posição Y</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[position.y]}
                  min={0}
                  max={260}
                  step={1}
                  onValueChange={([y]) => onChange({ ...position, y })}
                  className="w-[200px]"
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={position.y}
                    onChange={(e) => handleYChange(e.target.value)}
                    className="w-[80px]"
                    min={0}
                    max={260}
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionControl;