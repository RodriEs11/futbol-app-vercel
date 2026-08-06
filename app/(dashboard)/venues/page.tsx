import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { VenuesTable } from "@/features/venues/components/VenuesTable";
import { VenueFormDialog } from "@/features/venues/components/VenueFormDialog";
import type { Database } from "@/types/database.types";

export default async function VenuesPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: venues, error } = await supabase
    .from("venues")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching venues:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Canchas</h1>
          <p className="text-muted-foreground">Administra las sedes donde se juegan los partidos.</p>
        </div>
        <VenueFormDialog />
      </div>
      
      <VenuesTable venues={venues || []} />
    </div>
  );
}
