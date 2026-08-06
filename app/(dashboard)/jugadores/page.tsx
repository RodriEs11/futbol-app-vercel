import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddPlayerDialog } from "@/features/players/components/AddPlayerDialog";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

export default async function JugadoresPage() {
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

  // Intentamos obtener de la vista primero
  const { data: initialPlayers, error } = await supabase.from("player_stats_view" as never).select("*");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let players: any[] | null = initialPlayers;

  // Si hay error (ej: la vista no existe porque no corrieron el SQL), hacemos un fallback a la tabla players
  if (error || !players) {
    const { data: fallbackPlayers } = await supabase.from("players").select("*").order("created_at", { ascending: false });
    if (fallbackPlayers) {
      players = fallbackPlayers.map(p => ({
        player_id: p.id,
        first_name: p.first_name,
        last_name: p.last_name,
        nickname: p.nickname,
        pj: 0,
        pg: 0,
        pe: 0,
        pp: 0,
        g: 0,
        pts: 0
      }));
    }
  }

  const playerList = players || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jugadores</h1>
          <p className="text-muted-foreground">Estadísticas individuales</p>
        </div>
        <AddPlayerDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Jugadores ({playerList.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Nombre</th>
                  <th className="px-4 py-2 font-medium text-center">Partidos</th>
                  <th className="px-4 py-2 font-medium text-center">Goles</th>
                  <th className="px-4 py-2 font-medium text-center">Victorias</th>
                  <th className="px-4 py-2 font-medium text-center">Empates</th>
                  <th className="px-4 py-2 font-medium text-center">Derrotas</th>
                </tr>
              </thead>
              <tbody>
                {playerList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No hay jugadores registrados todavía.
                    </td>
                  </tr>
                ) : (
                  playerList.map((player: { player_id: string; first_name: string; last_name: string; nickname?: string; pj: number; pg: number; pe: number; pp: number; g: number; pts: number; }) => (
                    <tr key={player.player_id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        {player.first_name} {player.last_name}
                        {player.nickname && <span className="ml-1 text-muted-foreground font-normal">&quot;{player.nickname}&quot;</span>}
                      </td>
                      <td className="px-4 py-3 text-center">{player.pj}</td>
                      <td className="px-4 py-3 text-center font-bold">{player.g}</td>
                      <td className="px-4 py-3 text-center text-green-600">{player.pg}</td>
                      <td className="px-4 py-3 text-center text-yellow-600">{player.pe}</td>
                      <td className="px-4 py-3 text-center text-red-600">{player.pp}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
