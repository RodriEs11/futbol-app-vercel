export type UserRole = "admin" | "player";

export type PlayerPosition =
  | "portero"
  | "defensor"
  | "mediocampista"
  | "delantero";

export type PreferredFoot = "izquierda" | "derecha" | "ambas";

export type PlayerStatus = "activo" | "inactivo" | "lesionado";

export type MatchStatus =
  | "programado"
  | "suspendido"
  | "finalizado"
  | "cancelado";

export type RsvpStatus = "confirmado" | "no_puede" | "tal_vez" | "pendiente";

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  nickname: string | null;
  avatarUrl: string | null;
  birthDate: string | null;
  favoritePosition: PlayerPosition | null;
  preferredFoot: PreferredFoot | null;
  jerseyNumber: number | null;
  heightCm: number | null;
  weightKg: number | null;
  joinedAt: string;
  status: PlayerStatus;
}

export interface PlayerStats {
  playerId: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  ownGoals: number;
  minutesPlayed: number;
}

export interface Match {
  id: string;
  venueId: string | null;
  date: string;
  time: string;
  price: number | null;
  maxPlayers: number;
  notes: string | null;
  status: MatchStatus;
}

export interface Venue {
  id: string;
  name: string;
  address: string | null;
  costPerMatch: number | null;
}
