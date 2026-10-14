export type WorkRecord = {
  id: string;
  site_label: string;
  work_date: string;
  title: string;
  description: string;
  image_path: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      storage_cleanup_tasks: {
        Row: {
          id: string;
          record_id: string;
          image_path: string;
          reason: string;
          attempts: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          record_id: string;
          image_path: string;
          reason: string;
          attempts?: number;
          created_at?: string;
        };
        Update: { attempts?: number };
        Relationships: [];
      };
      work_records: {
        Row: WorkRecord;
        Insert: {
          id?: string;
          site_label: string;
          work_date: string;
          title: string;
          description?: string;
          image_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<WorkRecord, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
