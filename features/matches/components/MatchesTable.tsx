"use client";

import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export function MatchesTable({ matches }: { matches: any[] }) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <Calendar className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No hay partidos organizados</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Crea el primer partido para empezar a invitar a tus amigos.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha y Hora</TableHead>
            <TableHead>Cancha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <TableRow key={match.id}>
              <TableCell className="font-medium">
                {format(new Date(`${match.match_date}T${match.match_time}`), "PPP 'a las' p", { locale: es })}
              </TableCell>
              <TableCell>{match.venues?.name || "Sin definir"}</TableCell>
              <TableCell>
                <Badge variant={match.status === "programado" ? "default" : "secondary"} className="capitalize">
                  {match.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {match.price ? `$${match.price}` : "-"}
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/partidos/${match.id}`} className="text-primary hover:underline text-sm font-medium">
                  Ver detalles
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
