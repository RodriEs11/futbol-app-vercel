import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function JugadoresPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jugadores</h1>
          <p className="text-muted-foreground">Estadísticas individuales</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Jugador
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Jugadores</CardTitle>
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
                {/* Acá irían los datos de la DB (player_stats_view) */}
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Jugador Ejemplo</td>
                  <td className="px-4 py-3 text-center">10</td>
                  <td className="px-4 py-3 text-center font-bold">8</td>
                  <td className="px-4 py-3 text-center text-green-600">5</td>
                  <td className="px-4 py-3 text-center text-yellow-600">2</td>
                  <td className="px-4 py-3 text-center text-red-600">3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
