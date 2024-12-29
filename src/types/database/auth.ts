export interface AuthSchema {
  Tables: {
    users: {
      Row: {
        id: string;
        email?: string;
        created_at: string;
      };
    };
  };
}