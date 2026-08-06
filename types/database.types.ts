/**
 * Este archivo se generará automáticamente con:
 *   npm run db:types
 * (requiere SUPABASE_PROJECT_ID configurado y el CLI de Supabase autenticado)
 *
 * Se deja un esqueleto mínimo para que el proyecto compile mientras
 * tanto — reemplazar por la salida real de `supabase gen types`.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: Record<string, { Row: Record<string, unknown> }>;
    Enums: Record<string, string>;
  };
}
