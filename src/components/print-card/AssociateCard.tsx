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
  rolePosition: Position;
  companyPosition: Position;
  associationDatePosition: Position;
  expirationDatePosition: Position;
}

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
}

interface AssociateCardProps {
  associate: Associate;
  layout: LayoutData;
  formatDate: (date: string) => string;
}

const AssociateCard = ({ associate, layout, formatDate }: AssociateCardProps) => {
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
            {associate.photo_url ? (
              <img
                src={associate.photo_url}
                alt={associate.name}
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
            <h2 className="text-lg font-bold">{associate.name}</h2>
          </div>
          <div
            className="absolute"
            style={{
              transform: `translate(${layout.rgPosition.x}px, ${layout.rgPosition.y}px)`,
            }}
          >
            <p className="text-sm">
              <span className="font-semibold">RG:</span> {associate.rg}
            </p>
          </div>
          <div
            className="absolute"
            style={{
              transform: `translate(${layout.cpfPosition.x}px, ${layout.cpfPosition.y}px)`,
            }}
          >
            <p className="text-sm">
              <span className="font-semibold">CPF:</span> {associate.cpf}
            </p>
          </div>
          <div
            className="absolute"
            style={{
              transform: `translate(${layout.rolePosition.x}px, ${layout.rolePosition.y}px)`,
            }}
          >
            <p className="text-sm">
              <span className="font-semibold">Cargo:</span> {associate.role}
            </p>
          </div>
          <div
            className="absolute"
            style={{
              transform: `translate(${layout.companyPosition.x}px, ${layout.companyPosition.y}px)`,
            }}
          >
            <p className="text-sm">
              <span className="font-semibold">Empresa:</span> {associate.company}
            </p>
          </div>
          <div
            className="absolute"
            style={{
              transform: `translate(${layout.associationDatePosition.x}px, ${layout.associationDatePosition.y}px)`,
            }}
          >
            <p className="text-sm">
              <span className="font-semibold">Associação:</span>{" "}
              {formatDate(associate.association_date)}
            </p>
          </div>
          <div
            className="absolute"
            style={{
              transform: `translate(${layout.expirationDatePosition.x}px, ${layout.expirationDatePosition.y}px)`,
            }}
          >
            <p className="text-sm">
              <span className="font-semibold">Validade:</span>{" "}
              {formatDate(associate.expiration_date)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssociateCard;