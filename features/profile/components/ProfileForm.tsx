"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const profileSchema = z.object({
  firstName: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  lastName: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres." }),
  nickname: z.string().optional(),
  favoritePosition: z.enum(["portero", "defensor", "mediocampista", "delantero"]).optional(),
  preferredFoot: z.enum(["izquierda", "derecha", "ambas"]).optional(),
  jerseyNumber: z.coerce.number().min(0).max(99).optional(),
  heightCm: z.coerce.number().min(100).max(250).optional(),
  weightKg: z.coerce.number().min(30).max(200).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      nickname: "",
    },
  });

  function onSubmit(data: ProfileFormValues) {
    // Aquí conectaremos con Supabase para actualizar la tabla players
    console.log(data);
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Perfil de Jugador</CardTitle>
        <CardDescription>
          Actualiza tu información personal y preferencias en la cancha.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Lionel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Messi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apodo</FormLabel>
                    <FormControl>
                      <Input placeholder="La Pulga" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="favoritePosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posición Favorita</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una posición" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="portero">Portero</SelectItem>
                        <SelectItem value="defensor">Defensor</SelectItem>
                        <SelectItem value="mediocampista">Mediocampista</SelectItem>
                        <SelectItem value="delantero">Delantero</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredFoot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pierna Hábil</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu pierna hábil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="derecha">Derecha</SelectItem>
                        <SelectItem value="izquierda">Izquierda</SelectItem>
                        <SelectItem value="ambas">Ambas</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jerseyNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Camiseta</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto">Guardar Cambios</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
