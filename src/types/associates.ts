export interface Dependent {
  id: string;
  name: string;
  rg: string;
  cpf: string;
  photo_url?: string | null;
  company: string;
  association_date: string;
  expiration_date: string;
}

export interface Associate {
  id: string;
  name: string;
  rg: string;
  cpf: string;
  role: string;
  company: string;
  association_date: string;
  expiration_date: string;
  photo_url?: string | null;
  dependents?: Dependent[];
}