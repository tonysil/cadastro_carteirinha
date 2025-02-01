import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Position {
  x: number;
  y: number;
}

interface LayoutData {
  title: string;
  backgroundImage: string | null;
  photoPosition: Position;
  namePosition: Position;
  rgPosition: Position;
  cpfPosition: Position;
}

interface Dependent {
  id: string;
  name: string;
  rg: string;
  cpf: string;
  photo_url?: string | null;
}

interface DependentCardProps {
  dependent: Dependent;
  layout: LayoutData;
  associateName: string;
}

const DependentCard = ({ dependent, layout, associateName }: DependentCardProps) => {
  return (
    <Card className="relative w-[825px] h-[260px] border shadow overflow-hidden">
      <CardContent className="relative p-0 h-full">
        {layout.backgroundImage && (
          <div
            className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover print:!block"
            style={{
              backgroundImage: `url(${layout.backgroundImage})`,
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          />
        )}
        <div className="relative h-full">
          <div
            className="absolute"
            style={{
              transform: `translate(${layout.photoPosition.x}px, ${layout.photoPosition.y}px)`,
            }}
          >
            {dependent.photo_url ? (
              <img
                src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/photos/${dependent.photo_url}`}
                alt={dependent.name}
                className="w-[100px] h-[130px] object-cover"
              />
            ) : (
              <div className="w-[100px] h-[130px] bg-gray-200" />
            )}
          </div>

          <div
            className="absolute"
            style={{
              transform: `translate(${layout.namePosition.x}px, ${layout.namePosition.y}px)`,
            }}
          >
            <h2 className="text-lg font-bold">{dependent.name}</h2>
            <p className="text-sm text-muted-foreground">
              Dependente de {associateName}
            </p>
          </div>
          <div
            className="absolute"
            style={{
              transform: `translate(${layout.rgPosition.x}px, ${layout.rgPosition.y}px)`,
            }}
          >
            <p className="text-sm">
              <span className="font-semibold">RG:</span> {dependent.rg}
            </p>
          </div>
          <div
            className="absolute"
            style={{
              transform: `translate(${layout.cpfPosition.x}px, ${layout.cpfPosition.y}px)`,
            }}
          >
            <p className="text-sm">
              <span className="font-semibold">CPF:</span> {dependent.cpf}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DependentCard;