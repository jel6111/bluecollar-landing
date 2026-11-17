export type WorkRecord = {
  user_id: string;
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
          user_id: string;
          record_id: string;
          image_path: string;
          reason: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          record_id: string;
          image_path: string;
          reason: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      work_records: {
        Row: WorkRecord;
        Insert: {
          user_id: string;
          id?: string;
          site_label: string;
          work_date: string;
          title: string;
          description?: string;
          image_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<WorkRecord, "id" | "user_id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
