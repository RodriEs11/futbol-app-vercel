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

const venueSchema = z.object({
  name: z.string().min(2, { message: "El nombre es requerido." }),
  address: z.string().optional(),
  cost_per_match: z.coerce.number().min(0).optional(),
  surface: z.enum(["cesped_natural", "cesped_sintetico", "cemento", "otra"]).optional(),
  contact_info: z.string().optional(),
});

type VenueFormValues = z.infer<typeof venueSchema>;

export function VenueFormDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: "",
      address: "",
      contact_info: "",
      cost_per_match: 0,
    },
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(data: VenueFormValues) {
    setLoading(true);
    setErrorMsg(null);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from("venues").insert([data]);

    setLoading(false);
    
    if (error) {
      console.error(error);
      setErrorMsg(error.message || "Error al guardar en la base de datos.");
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
          Nueva Cancha
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Cancha</DialogTitle>
          <DialogDescription>
            Registra una nueva sede para organizar partidos.
          </DialogDescription>
        </DialogHeader>
        {errorMsg && <div className="text-sm text-destructive">{errorMsg}</div>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Futbol 5 El Papi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Av. Siempre Viva 123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="surface"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Superficie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cesped_sintetico">Sintético</SelectItem>
                        <SelectItem value="cesped_natural">Natural</SelectItem>
                        <SelectItem value="cemento">Cemento</SelectItem>
                        <SelectItem value="otra">Otra</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost_per_match"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cancha"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
