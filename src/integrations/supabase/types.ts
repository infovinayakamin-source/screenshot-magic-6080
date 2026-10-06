export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      inventory_history: {
        Row: {
          actor: string | null
          change: number
          created_at: string
          id: string
          product_id: string
          reason: string
          stock_after: number
        }
        Insert: {
          actor?: string | null
          change: number
          created_at?: string
          id?: string
          product_id: string
          reason: string
          stock_after: number
        }
        Update: {
          actor?: string | null
          change?: number
          created_at?: string
          id?: string
          product_id?: string
          reason?: string
          stock_after?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer: Json
          id: string
          items: Json
          notes: string | null
          paid_at: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          customer?: Json
          id?: string
          items?: Json
          notes?: string | null
          paid_at?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer?: Json
          id?: string
          items?: Json
          notes?: string | null
          paid_at?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
        }
        Relationships: []
      }
      product_branding_settings: {
        Row: {
          enabled: boolean
          id: number
          logo_url: string | null
          opacity: number
          padding: number
          position: string
          size: string
          updated_at: string
        }
        Insert: {
          enabled?: boolean
          id?: number
          logo_url?: string | null
          opacity?: number
          padding?: number
          position?: string
          size?: string
          updated_at?: string
        }
        Update: {
          enabled?: boolean
          id?: number
          logo_url?: string | null
          opacity?: number
          padding?: number
          position?: string
          size?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          branded_image_url: string | null
          branding_error: string | null
          created_at: string
          id: string
          is_primary: boolean
          original_image_url: string
          product_id: string
          sort_order: number
        }
        Insert: {
          branded_image_url?: string | null
          branding_error?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          original_image_url: string
          product_id: string
          sort_order?: number
        }
        Update: {
          branded_image_url?: string | null
          branding_error?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          original_image_url?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          apply_branding: boolean
          created_at: string
          description: string | null
          featured: boolean
          id: string
          low_stock_threshold: number
          name: string
          name_hi: string | null
          original_price: number | null
          price: number
          product_info: string | null
          short_description: string | null
          sku: string
          slug: string
          status: string
          stock: number
          stones: string | null
          updated_at: string
          zodiac_sign_id: number
        }
        Insert: {
          apply_branding?: boolean
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          low_stock_threshold?: number
          name: string
          name_hi?: string | null
          original_price?: number | null
          price: number
          product_info?: string | null
          short_description?: string | null
          sku: string
          slug: string
          status?: string
          stock?: number
          stones?: string | null
          updated_at?: string
          zodiac_sign_id: number
        }
        Update: {
          apply_branding?: boolean
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          low_stock_threshold?: number
          name?: string
          name_hi?: string | null
          original_price?: number | null
          price?: number
          product_info?: string | null
          short_description?: string | null
          sku?: string
          slug?: string
          status?: string
          stock?: number
          stones?: string | null
          updated_at?: string
          zodiac_sign_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_zodiac_sign_id_fkey"
            columns: ["zodiac_sign_id"]
            isOneToOne: false
            referencedRelation: "zodiac_signs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      zodiac_signs: {
        Row: {
          id: number
          name_en: string
          name_hi: string
          slug: string
          symbol: string
        }
        Insert: {
          id: number
          name_en: string
          name_hi: string
          slug: string
          symbol: string
        }
        Update: {
          id?: number
          name_en?: string
          name_hi?: string
          slug?: string
          symbol?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_admin: { Args: { _user_id: string }; Returns: boolean }
      consume_stock: {
        Args: { _items: Json; _reason: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
