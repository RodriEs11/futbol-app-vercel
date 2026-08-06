import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { MatchesTable } from "@/features/matches/components/MatchesTable";
import { MatchFormDialog } from "@/features/matches/components/MatchFormDialog";
import type { Database } from "@/types/database.types";

export default async function MatchesPage() {
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

  // Fetch matches along with their venue names
  const { data: matches, error } = await supabase
    .from("matches")
    .select(`
      *,
      venues(name)
    `)
    .order("match_date", { ascending: false });

  // Fetch venues for the creation form
  const { data: venues } = await supabase
    .from("venues")
    .select("id, name")
    .order("name");

  if (error) {
    console.error("Error fetching matches:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partidos</h1>
          <p className="text-muted-foreground">Organiza nuevos partidos o revisa el historial.</p>
        </div>
        <MatchFormDialog venues={venues || []} />
      </div>
      
      <MatchesTable matches={matches || []} />
    </div>
  );
}
