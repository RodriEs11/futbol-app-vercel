import { ProfileForm } from "@/features/profile/components/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información de jugador.
        </p>
      </div>
      <div className="flex justify-center md:justify-start">
        <ProfileForm />
      </div>
    </div>
  );
}
