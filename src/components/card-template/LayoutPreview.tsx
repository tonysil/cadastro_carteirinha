import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Layout, Position } from "@/types/layout";

interface LayoutPreviewProps {
  layout: Layout;
  formatDate: (date: string) => string;
}

const LayoutPreview = ({ layout, formatDate }: LayoutPreviewProps) => {
  const PreviewField = ({ 
    position, 
    content, 
    visible 
  }: { 
    position: Position; 
    content: React.ReactNode;
    visible: boolean;
  }) => {
    if (!visible) return null;
    
    return (
      <div 
        className="absolute group cursor-move"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <div className="p-1 -m-1 rounded group-hover:bg-blue-50 group-hover:ring-2 ring-blue-500">
          {content}
        </div>
        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
          x: {position.x}, y: {position.y}
        </div>
      </div>
    );
  };

  return (
    <Card className="relative w-[825px] h-[260px] border shadow">
      <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(50px,1fr))] opacity-10 pointer-events-none">
        {Array.from({ length: Math.ceil(825/50) * Math.ceil(260/50) }).map((_, i) => (
          <div key={i} className="border border-gray-400 h-[50px]" />
        ))}
      </div>

      <CardContent className="relative p-0 h-full">
        {layout.background_image && (
          <div 
            className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover"
            style={{ backgroundImage: `url(${layout.background_image})` }}
          />
        )}
        <div className="relative h-full">
          {layout.show_photo && (
            <div 
              className="absolute group cursor-move"
              style={{
                transform: `translate(${layout.photo_position.x}px, ${layout.photo_position.y}px)`,
              }}
            >
              <div className="w-[100px] h-[130px] bg-gray-200 rounded group-hover:ring-2 ring-blue-500 ring-offset-2" />
              <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                x: {layout.photo_position.x}, y: {layout.photo_position.y}
              </div>
            </div>
          )}
          
          <PreviewField
            position={layout.name_position}
            content={<h2 className="text-[0.9rem] font-bold">Nome do Associado</h2>}
            visible={layout.show_name}
          />
          
          <PreviewField
            position={layout.rg_position}
            content={<p className="text-[0.85rem]"><span className="font-semibold">RG:</span> 00.000.000-0</p>}
            visible={layout.show_rg}
          />
          
          <PreviewField
            position={layout.cpf_position}
            content={<p className="text-[0.85rem]"><span className="font-semibold">CPF:</span> 000.000.000-00</p>}
            visible={layout.show_cpf}
          />
          
          <PreviewField
            position={layout.role_position}
            content={<p className="text-[0.9rem]"><span className="font-semibold">Cargo:</span> Exemplo</p>}
            visible={layout.show_role}
          />
          
          <PreviewField
            position={layout.company_position}
            content={<p className="text-[0.9rem]"><span className="font-semibold">Empresa:</span> Exemplo</p>}
            visible={layout.show_company}
          />
          
          <PreviewField
            position={layout.association_date_position}
            content={
              <p className="text-[0.9rem]">
                <span className="font-semibold">Associação:</span> {formatDate(new Date().toISOString())}
              </p>
            }
            visible={layout.show_association_date}
          />
          
          <PreviewField
            position={layout.expiration_date_position}
            content={
              <p className="text-[0.9rem]">
                <span className="font-semibold">Validade:</span> {formatDate(new Date().toISOString())}
              </p>
            }
            visible={layout.show_expiration_date}
          />
          
          <PreviewField
            position={layout.dependent_name_position}
            content={<p className="text-[0.9rem] font-bold">Nome do Dependente</p>}
            visible={layout.show_dependent_name}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LayoutPreview;