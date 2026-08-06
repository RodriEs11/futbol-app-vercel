import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function InicioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inicio</h1>
        <p className="text-muted-foreground">Bienvenido a Tukas. Aquí está el resumen de tu actividad.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Partido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold mb-2">12 de Agosto, 2024 - Cancha 1</div>
            <p className="text-sm text-muted-foreground mb-4">Resultado: Equipo A 3 - 2 Equipo B</p>
            <Link href="/partidos/ultimo">
              <Button size="sm" variant="outline">Ver detalles</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Partido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold mb-2">19 de Agosto, 2024 - 19:00</div>
            <p className="text-sm text-muted-foreground">Cancha El Complejo</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tabla General de Jugadores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Nombre</th>
                  <th className="px-4 py-2 font-medium text-center">PJ</th>
                  <th className="px-4 py-2 font-medium text-center">PG</th>
                  <th className="px-4 py-2 font-medium text-center">PE</th>
                  <th className="px-4 py-2 font-medium text-center">PP</th>
                  <th className="px-4 py-2 font-medium text-center">G</th>
                  <th className="px-4 py-2 font-medium text-center">PTS</th>
                </tr>
              </thead>
              <tbody>
                {/* Muestra de ejemplo para la UI, luego se conectará a player_stats_view */}
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Jugador Ejemplo</td>
                  <td className="px-4 py-3 text-center">5</td>
                  <td className="px-4 py-3 text-center">3</td>
                  <td className="px-4 py-3 text-center">1</td>
                  <td className="px-4 py-3 text-center">1</td>
                  <td className="px-4 py-3 text-center">4</td>
                  <td className="px-4 py-3 text-center font-bold text-primary">10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
