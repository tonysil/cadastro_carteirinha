import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface Position {
  x: number;
  y: number;
}

interface PositionControlProps {
  label: string;
  position: Position;
  onChange: (newPosition: Position) => void;
}

export const PositionControl: React.FC<PositionControlProps> = ({
  label,
  position,
  onChange,
}) => {
  return (
    <div className="space-y-2 p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <Label className="text-lg font-semibold text-gray-800">{label}</Label>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label className="text-sm text-gray-600">Posição Horizontal (X)</Label>
            <div className="flex items-center space-x-4">
              <div className="flex-grow">
                <Slider
                  value={[position.x]}
                  onValueChange={(value) => onChange({ ...position, x: value[0] })}
                  max={825}
                  step={1}
                  className="my-2"
                />
              </div>
              <Input
                type="number"
                value={position.x}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                  onChange({ ...position, x: value });
                }}
                className="w-20 text-right font-mono"
                min={0}
                max={825}
                step={1}
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label className="text-sm text-gray-600">Posição Vertical (Y)</Label>
            <div className="flex items-center space-x-4">
              <div className="flex-grow">
                <Slider
                  value={[position.y]}
                  onValueChange={(value) => onChange({ ...position, y: value[0] })}
                  max={260}
                  step={1}
                  className="my-2"
                />
              </div>
              <Input
                type="number"
                value={position.y}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                  onChange({ ...position, y: value });
                }}
                className="w-20 text-right font-mono"
                min={0}
                max={260}
                step={1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};