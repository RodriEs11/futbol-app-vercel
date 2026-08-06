"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createBrowserClient } from "@supabase/ssr";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

const matchSchema = z.object({
  venue_id: z.string().uuid({ message: "Selecciona una cancha válida." }),
  match_date: z.string().min(10, { message: "La fecha es requerida." }),
  match_time: z.string().min(5, { message: "La hora es requerida (ej. 20:00)." }),
  max_players: z.coerce.number().min(10).max(30),
  price: z.coerce.number().min(0).optional(),
});

type MatchFormValues = z.infer<typeof matchSchema>;

export function MatchFormDialog({ venues }: { venues: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  
  const form = useForm<MatchFormValues>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      max_players: 14,
      price: 0,
      match_time: "20:00",
      match_date: new Date().toISOString().split('T')[0],
    },
  });

  async function onSubmit(data: MatchFormValues) {
    setLoading(true);
    setErrorMsg(null);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from("matches").insert([{
      venue_id: data.venue_id,
      match_date: data.match_date,
      match_time: data.match_time,
      max_players: data.max_players,
      price: data.price,
    }]);

    setLoading(false);
    
    if (error) {
      console.error(error);
      setErrorMsg(error.message || "Error al crear el partido.");
    } else {
      setOpen(false);
      form.reset();
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Crear Partido
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Organizar Partido</DialogTitle>
          <DialogDescription>
            Configura los detalles del próximo partido.
          </DialogDescription>
        </DialogHeader>
        {errorMsg && <div className="text-sm text-destructive">{errorMsg}</div>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="venue_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cancha</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una sede" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {venues.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id}>
                          {venue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="match_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="match_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="max_players"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jugadores Max.</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creando..." : "Crear Partido"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
