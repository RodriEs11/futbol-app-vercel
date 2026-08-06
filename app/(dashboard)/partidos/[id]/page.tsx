import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function MatchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Aquí se conectarían los datos a Supabase utilizando id
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/partidos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detalles del Partido</h1>
          <p className="text-muted-foreground">Revisa los resultados y alineaciones.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Resumen del Partido */}
        <Card className="md:col-span-3">
          <CardHeader className="text-center">
            <CardTitle>Resumen del Partido</CardTitle>
            <p className="text-sm text-muted-foreground">12 de Agosto, 2024 a las 19:00 - Cancha 1</p>
            <Badge variant="outline" className="mt-2 mx-auto w-fit">Finalizado</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-8 py-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Equipo A</h3>
              </div>
              
              <div className="text-5xl font-black text-primary px-8 py-4 bg-muted rounded-xl">
                3 - 2
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Equipo B</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipo A */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Equipo A</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm">
                <span>Juan Pérez <Badge variant="secondary" className="ml-1 text-[10px]">MVP</Badge></span>
                <span className="font-medium">⚽⚽</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span>Carlos Gómez</span>
                <span className="font-medium">⚽</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span>Miguel Rojas</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Detalles extras / Línea de tiempo */}
        <Card className="md:col-span-1 border-dashed">
          <CardHeader>
            <CardTitle className="text-center text-muted-foreground">Cronología</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-full pb-8">
             <p className="text-sm text-muted-foreground text-center">Aquí se mostrarán los goles, tarjetas y eventos del partido de forma cronológica.</p>
          </CardContent>
        </Card>

        {/* Equipo B */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Equipo B</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm">
                <span>Luis Fernández</span>
                <span className="font-medium">⚽</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span>Diego Silva</span>
                <span className="font-medium">⚽ (p)</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span>Fernando Torres</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
