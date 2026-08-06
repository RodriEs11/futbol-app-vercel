"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { useRouter } from "next/navigation";

export function AddPlayerDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const nickname = formData.get("nickname") as string;
    const position = formData.get("position") as string;
    const foot = formData.get("foot") as string;

    const { error } = await supabase.from("players").insert({
      first_name: firstName,
      last_name: lastName,
      nickname: nickname || null,
      favorite_position: position || null,
      preferred_foot: foot || null,
    });

    setIsLoading(false);

    if (error) {
      console.error("Error al agregar jugador:", error);
      // Ideally show a toast here
    } else {
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Jugador
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Agregar nuevo jugador</DialogTitle>
            <DialogDescription>
              Completa los datos del jugador para añadirlo a la base de datos de Tukas.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                Nombre
              </Label>
              <Input id="firstName" name="firstName" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Apellido
              </Label>
              <Input id="lastName" name="lastName" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nickname" className="text-right">
                Apodo
              </Label>
              <Input id="nickname" name="nickname" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Posición
              </Label>
              <Select name="position">
                <SelectTrigger className="col-span-3" id="position">
                  <SelectValue placeholder="Selecciona una posición" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portero">Portero</SelectItem>
                  <SelectItem value="defensor">Defensor</SelectItem>
                  <SelectItem value="mediocampista">Mediocampista</SelectItem>
                  <SelectItem value="delantero">Delantero</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="foot" className="text-right">
                Pie hábil
              </Label>
              <Select name="foot">
                <SelectTrigger className="col-span-3" id="foot">
                  <SelectValue placeholder="Selecciona un pie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="derecha">Derecha</SelectItem>
                  <SelectItem value="izquierda">Izquierda</SelectItem>
                  <SelectItem value="ambas">Ambas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar jugador"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
