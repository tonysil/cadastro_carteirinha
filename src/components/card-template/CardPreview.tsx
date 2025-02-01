import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface Position {
  x: number;
  y: number;
}

interface CardPreviewProps {
  backgroundImage: string | null;
  photoPosition: Position;
  namePosition: Position;
  rgPosition: Position;
  cpfPosition: Position;
  rolePosition: Position;
  companyPosition: Position;
  associationDatePosition: Position;
  expirationDatePosition: Position;
  dependentNamePosition: Position;
  showPhoto?: boolean;
  showName?: boolean;
  showRg?: boolean;
  showCpf?: boolean;
  showRole?: boolean;
  showCompany?: boolean;
  showAssociationDate?: boolean;
  showExpirationDate?: boolean;
  showDependentName?: boolean;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  backgroundImage,
  photoPosition,
  namePosition,
  rgPosition,
  cpfPosition,
  rolePosition,
  companyPosition,
  associationDatePosition,
  expirationDatePosition,
  dependentNamePosition,
  showPhoto = true,
  showName = true,
  showRg = true,
  showCpf = true,
  showRole = true,
  showCompany = true,
  showAssociationDate = true,
  showExpirationDate = true,
  showDependentName = true,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Preview da Carteirinha</h2>
      <div className="min-w-[825px]">
        <Card className="relative w-[825px] h-[260px] border shadow">
          <CardContent className="relative p-0 h-full">
            {backgroundImage && (
              <div 
                className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              />
            )}
            <div className="relative h-full">
              {showPhoto && (
                <div 
                  className="absolute"
                  style={{
                    transform: `translate(${photoPosition.x}px, ${photoPosition.y}px)`,
                  }}
                >
                  <div className="w-[100px] h-[130px] bg-gray-200 rounded" />
                </div>
              )}
              
              {showName && (
                <div 
                  className="absolute"
                  style={{
                    transform: `translate(${namePosition.x}px, ${namePosition.y}px)`,
                  }}
                >
                  <h2 className="text-lg font-bold">Nome do Associado</h2>
                </div>
              )}

              {showRg && (
                <div 
                  className="absolute"
                  style={{
                    transform: `translate(${rgPosition.x}px, ${rgPosition.y}px)`,
                  }}
                >
                  <p className="text-sm"><span className="font-semibold">RG:</span> 00.000.000-0</p>
                </div>
              )}

              {showCpf && (
                <div 
                  className="absolute"
                  style={{
                    transform: `translate(${cpfPosition.x}px, ${cpfPosition.y}px)`,
                  }}
                >
                  <p className="text-sm"><span className="font-semibold">CPF:</span> 000.000.000-00</p>
                </div>
              )}

              {showRole && (
                <div 
                  className="absolute"
                  style={{
                    transform: `translate(${rolePosition.x}px, ${rolePosition.y}px)`,
                  }}
                >
                  <p className="text-sm"><span className="font-semibold">Cargo:</span> Exemplo</p>
                </div>
              )}

              {showCompany && (
                <div 
                  className="absolute"
                  style={{
                    transform: `translate(${companyPosition.x}px, ${companyPosition.y}px)`,
                  }}
                >
                  <p className="text-sm"><span className="font-semibold">Empresa:</span> Exemplo</p>
                </div>
              )}

              {showAssociationDate && (
                <div 
                  className="absolute"
                  style={{
                    transform: `translate(${associationDatePosition.x}px, ${associationDatePosition.y}px)`,
                  }}
                >
                  <p className="text-sm">
                    <span className="font-semibold">Associação:</span> {formatDate(new Date().toISOString())}
                  </p>
                </div>
              )}

              {showExpirationDate && (
                <div 
                  className="absolute"
                  style={{
                    transform: `translate(${expirationDatePosition.x}px, ${expirationDatePosition.y}px)`,
                  }}
                >
                  <p className="text-sm">
                    <span className="font-semibold">Validade:</span> {formatDate(new Date().toISOString())}
                  </p>
                </div>
              )}

              {showDependentName && (
                <div 
                  className="absolute"
                  style={{
                    transform: `translate(${dependentNamePosition.x}px, ${dependentNamePosition.y}px)`,
                  }}
                >
                  <p className="text-sm">
                    <span className="font-semibold">Dependente de:</span> Nome do Associado
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};