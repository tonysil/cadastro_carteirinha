export interface Position {
  x: number;
  y: number;
}

export interface Layout {
  id: string;
  title: string;
  background_image: string | null;
  photo_position: Position;
  name_position: Position;
  rg_position: Position;
  cpf_position: Position;
  role_position: Position;
  company_position: Position;
  association_date_position: Position;
  expiration_date_position: Position;
  dependent_name_position: Position;
  show_photo: boolean;
  show_name: boolean;
  show_rg: boolean;
  show_cpf: boolean;
  show_role: boolean;
  show_company: boolean;
  show_association_date: boolean;
  show_expiration_date: boolean;
  show_dependent_name: boolean;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export const jsonToPosition = (json: any): Position => {
  if (typeof json === 'string') {
    try {
      const parsed = JSON.parse(json);
      return {
        x: Number(parsed.x) || 0,
        y: Number(parsed.y) || 0
      };
    } catch {
      return { x: 0, y: 0 };
    }
  }
  return {
    x: Number(json?.x) || 0,
    y: Number(json?.y) || 0
  };
};

export const positionToJson = (position: Position) => {
  return {
    x: position.x,
    y: position.y
  };
};