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
      profiles: {
        Row: {
          id: string
          created_at: string
          custom_id: string | null
          full_name: string
          department: string
          section: string | null
          shift_group: string | null
          role: string
          is_approved: boolean
        }
        Insert: {
          id: string
          created_at?: string
          custom_id?: string | null
          full_name: string
          department: string
          section?: string | null
          shift_group?: string | null
          role: string
          is_approved?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          custom_id?: string | null
          full_name?: string
          department?: string
          section?: string | null
          shift_group?: string | null
          role?: string
          is_approved?: boolean
        }
      }
      shift_entries: {
        Row: {
          id: string
          created_at: string
          employee_id: string
          date: string
          shift_type: string
          other_remark: string | null
          approved: boolean | null
          approved_by: string | null
          approved_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          employee_id: string
          date: string
          shift_type: string
          other_remark?: string | null
          approved?: boolean | null
          approved_by?: string | null
          approved_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          employee_id?: string
          date?: string
          shift_type?: string
          other_remark?: string | null
          approved?: boolean | null
          approved_by?: string | null
          approved_at?: string | null
        }
      }
      managers: {
        Row: {
          id: string
          created_at: string
          full_name: string
          department: string
          section: string | null
          password: string
        }
        Insert: {
          id: string
          created_at?: string
          full_name: string
          department: string
          section?: string | null
          password: string
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string
          department?: string
          section?: string | null
          password?: string
        }
      }
      hr_users: {
        Row: {
          id: string
          created_at: string
          username: string
          password: string
          type: string
          departments: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          username: string
          password: string
          type: string
          departments?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          username?: string
          password?: string
          type?: string
          departments?: string[] | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_uuid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}