// types/database.ts
// Generated-style types aligned with Supabase + Green Citizen schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          display_name: string | null
          district: string
          allow_public_profile: boolean
          total_points: number
          created_at: string
        }
        Insert: {
          id: string // must come from auth.users.id
          username: string
          display_name?: string | null
          district: string
          allow_public_profile?: boolean
          total_points?: number
          created_at?: string
        }
        Update: {
          username?: string
          display_name?: string | null
          district?: string
          allow_public_profile?: boolean
          total_points?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      actions: {
        Row: {
          id: string
          user_id: string
          action_type: string
          description: string | null
          video_url: string
          photo_urls: string[] | null
          gps_lat: number | null
          gps_lng: number | null
          privacy_setting: Database["public"]["Enums"]["privacy_setting"]
          verification_level: Database["public"]["Enums"]["verification_level"]
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action_type: string
          description?: string | null
          video_url: string
          photo_urls?: string[] | null
          gps_lat?: number | null
          gps_lng?: number | null
          privacy_setting?: Database["public"]["Enums"]["privacy_setting"]
          verification_level?: Database["public"]["Enums"]["verification_level"]
          points?: number
          created_at?: string
        }
        Update: {
          action_type?: string
          description?: string | null
          video_url?: string
          photo_urls?: string[] | null
          gps_lat?: number | null
          gps_lng?: number | null
          privacy_setting?: Database["public"]["Enums"]["privacy_setting"]
          verification_level?: Database["public"]["Enums"]["verification_level"]
          points?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "actions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }

    Views: {
      [_ in never]: never
    }

    Functions: {
      [_ in never]: never
    }

    Enums: {
      privacy_setting: "anonymous" | "public"
      verification_level: "pending" | "verified" | "rejected"
    }

    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper utility types
export type Tables<
  T extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][T]["Row"]

export type Enums<
  T extends keyof Database["public"]["Enums"]
> = Database["public"]["Enums"][T]
