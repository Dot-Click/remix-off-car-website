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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      enquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          source: string
          status: string
          subject: string | null
          updated_at: string
          vehicle_id: string | null
          vehicle_label: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          source?: string
          status?: string
          subject?: string | null
          updated_at?: string
          vehicle_id?: string | null
          vehicle_label?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          source?: string
          status?: string
          subject?: string | null
          updated_at?: string
          vehicle_id?: string | null
          vehicle_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt_text: string | null
          created_at: string
          file_name: string
          height: number | null
          id: string
          mime_type: string | null
          path: string
          size_bytes: number | null
          updated_at: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_name: string
          height?: number | null
          id?: string
          mime_type?: string | null
          path: string
          size_bytes?: number | null
          updated_at?: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_name?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          path?: string
          size_bytes?: number | null
          updated_at?: string
          width?: number | null
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          created_at: string
          enabled: boolean
          group_label: string | null
          id: string
          label: string
          location: string
          parent_id: string | null
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          group_label?: string | null
          id?: string
          label: string
          location?: string
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          group_label?: string | null
          id?: string
          label?: string
          location?: string
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          notes: string | null
          payment_type: string
          provider: string | null
          provider_payment_id: string | null
          provider_session_id: string | null
          reference: string
          status: string
          updated_at: string
          vehicle_id: string | null
          vehicle_label: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          payment_type?: string
          provider?: string | null
          provider_payment_id?: string | null
          provider_session_id?: string | null
          reference?: string
          status?: string
          updated_at?: string
          vehicle_id?: string | null
          vehicle_label?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          payment_type?: string
          provider?: string | null
          provider_payment_id?: string | null
          provider_session_id?: string | null
          reference?: string
          status?: string
          updated_at?: string
          vehicle_id?: string | null
          vehicle_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      page_sections: {
        Row: {
          background_image_path: string | null
          body_html: string | null
          button_text: string | null
          button_url: string | null
          created_at: string
          description: string | null
          eyebrow: string | null
          heading: string | null
          id: string
          image_path: string | null
          items: Json
          name: string
          page_id: string
          secondary_button_text: string | null
          secondary_button_url: string | null
          section_key: string
          settings: Json
          sort_order: number
          status: string
          subheading: string | null
          updated_at: string
        }
        Insert: {
          background_image_path?: string | null
          body_html?: string | null
          button_text?: string | null
          button_url?: string | null
          created_at?: string
          description?: string | null
          eyebrow?: string | null
          heading?: string | null
          id?: string
          image_path?: string | null
          items?: Json
          name: string
          page_id: string
          secondary_button_text?: string | null
          secondary_button_url?: string | null
          section_key: string
          settings?: Json
          sort_order?: number
          status?: string
          subheading?: string | null
          updated_at?: string
        }
        Update: {
          background_image_path?: string | null
          body_html?: string | null
          button_text?: string | null
          button_url?: string | null
          created_at?: string
          description?: string | null
          eyebrow?: string | null
          heading?: string | null
          id?: string
          image_path?: string | null
          items?: Json
          name?: string
          page_id?: string
          secondary_button_text?: string | null
          secondary_button_url?: string | null
          section_key?: string
          settings?: Json
          sort_order?: number
          status?: string
          subheading?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string
          id: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_path: string | null
          created_at: string
          customer_location: string | null
          customer_name: string
          id: string
          rating: number
          review: string
          sort_order: number
          status: string
          updated_at: string
          vehicle: string | null
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string
          customer_location?: string | null
          customer_name: string
          id?: string
          rating?: number
          review: string
          sort_order?: number
          status?: string
          updated_at?: string
          vehicle?: string | null
        }
        Update: {
          avatar_path?: string | null
          created_at?: string
          customer_location?: string | null
          customer_name?: string
          id?: string
          rating?: number
          review?: string
          sort_order?: number
          status?: string
          updated_at?: string
          vehicle?: string | null
        }
        Relationships: []
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
      vehicle_categories: {
        Row: {
          created_at: string
          description: string | null
          enabled: boolean
          id: string
          image_path: string | null
          kind: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          image_path?: string | null
          kind?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          image_path?: string | null
          kind?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          body_type: string | null
          created_at: string
          description: string | null
          engine: string | null
          exterior_color: string | null
          featured: boolean
          fuel_type: string | null
          gallery_images: string[]
          id: string
          interior_color: string | null
          main_image: string | null
          make: string
          mileage: number
          model: string
          price: number
          published: boolean
          status: Database["public"]["Enums"]["vehicle_status"]
          transmission: string | null
          updated_at: string
          year: number
        }
        Insert: {
          body_type?: string | null
          created_at?: string
          description?: string | null
          engine?: string | null
          exterior_color?: string | null
          featured?: boolean
          fuel_type?: string | null
          gallery_images?: string[]
          id?: string
          interior_color?: string | null
          main_image?: string | null
          make: string
          mileage?: number
          model: string
          price?: number
          published?: boolean
          status?: Database["public"]["Enums"]["vehicle_status"]
          transmission?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          body_type?: string | null
          created_at?: string
          description?: string | null
          engine?: string | null
          exterior_color?: string | null
          featured?: boolean
          fuel_type?: string | null
          gallery_images?: string[]
          id?: string
          interior_color?: string | null
          main_image?: string | null
          make?: string
          mileage?: number
          model?: string
          price?: number
          published?: boolean
          status?: Database["public"]["Enums"]["vehicle_status"]
          transmission?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      vehicle_status: "Available" | "Reserved" | "Sold"
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
      app_role: ["admin", "moderator", "user"],
      vehicle_status: ["Available", "Reserved", "Sold"],
    },
  },
} as const
