"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import type { Database } from "@/types/database.types";

type Venue = Database["public"]["Tables"]["venues"]["Row"];

export function VenuesTable({ venues }: { venues: Venue[] }) {
  if (venues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <MapPin className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No hay canchas registradas</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Agrega tu primera cancha para empezar a organizar partidos.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Superficie</TableHead>
            <TableHead className="text-right">Precio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {venues.map((venue) => (
            <TableRow key={venue.id}>
              <TableCell className="font-medium">{venue.name}</TableCell>
              <TableCell>{venue.address || "-"}</TableCell>
              <TableCell>
                {venue.surface ? (
                  <Badge variant="secondary" className="capitalize">
                    {venue.surface.replace("_", " ")}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right">
                {venue.cost_per_match ? `$${venue.cost_per_match}` : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
