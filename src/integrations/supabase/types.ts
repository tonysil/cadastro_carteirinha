export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      associates: {
        Row: {
          association_date: string
          company: string
          cpf: string
          created_at: string
          expiration_date: string
          id: string
          name: string
          photo_url: string | null
          rg: string
          role: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          association_date: string
          company: string
          cpf: string
          created_at?: string
          expiration_date: string
          id?: string
          name: string
          photo_url?: string | null
          rg: string
          role: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          association_date?: string
          company?: string
          cpf?: string
          created_at?: string
          expiration_date?: string
          id?: string
          name?: string
          photo_url?: string | null
          rg?: string
          role?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      dependents: {
        Row: {
          associate_id: string | null
          association_date: string | null
          company: string | null
          cpf: string
          created_at: string
          expiration_date: string | null
          id: string
          name: string
          name_associado: string | null
          photo_url: string | null
          rg: string
          updated_at: string
        }
        Insert: {
          associate_id?: string | null
          association_date?: string | null
          company?: string | null
          cpf: string
          created_at?: string
          expiration_date?: string | null
          id?: string
          name: string
          name_associado?: string | null
          photo_url?: string | null
          rg: string
          updated_at?: string
        }
        Update: {
          associate_id?: string | null
          association_date?: string | null
          company?: string | null
          cpf?: string
          created_at?: string
          expiration_date?: string | null
          id?: string
          name?: string
          name_associado?: string | null
          photo_url?: string | null
          rg?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dependents_associate_id_fkey"
            columns: ["associate_id"]
            isOneToOne: false
            referencedRelation: "associates"
            referencedColumns: ["id"]
          },
        ]
      }
      layouts: {
        Row: {
          association_date_position: Json
          background_image: string | null
          company_position: Json
          cpf_position: Json
          created_at: string | null
          dependent_name_position: Json
          expiration_date_position: Json
          id: string
          name_position: Json
          photo_position: Json
          rg_position: Json
          role_position: Json
          show_association_date: boolean
          show_company: boolean
          show_cpf: boolean
          show_dependent_name: boolean
          show_expiration_date: boolean
          show_name: boolean
          show_photo: boolean
          show_rg: boolean
          show_role: boolean
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          association_date_position: Json
          background_image?: string | null
          company_position: Json
          cpf_position: Json
          created_at?: string | null
          dependent_name_position: Json
          expiration_date_position: Json
          id: string
          name_position: Json
          photo_position: Json
          rg_position: Json
          role_position: Json
          show_association_date?: boolean
          show_company?: boolean
          show_cpf?: boolean
          show_dependent_name?: boolean
          show_expiration_date?: boolean
          show_name?: boolean
          show_photo?: boolean
          show_rg?: boolean
          show_role?: boolean
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          association_date_position?: Json
          background_image?: string | null
          company_position?: Json
          cpf_position?: Json
          created_at?: string | null
          dependent_name_position?: Json
          expiration_date_position?: Json
          id?: string
          name_position?: Json
          photo_position?: Json
          rg_position?: Json
          role_position?: Json
          show_association_date?: boolean
          show_company?: boolean
          show_cpf?: boolean
          show_dependent_name?: boolean
          show_expiration_date?: boolean
          show_name?: boolean
          show_photo?: boolean
          show_rg?: boolean
          show_role?: boolean
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      table_name: {
        Row: {
          data: Json | null
          id: number
          inserted_at: string
          name: string | null
          updated_at: string
        }
        Insert: {
          data?: Json | null
          id?: number
          inserted_at?: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          data?: Json | null
          id?: number
          inserted_at?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
