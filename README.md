# FutGo

Plataforma para organizar partidos de fútbol amateur entre amigos: gestión de
jugadores, convocatorias, resultados, goleadores y estadísticas automáticas.

> Nombre de proyecto temporal — pensado para cambiarse antes del lanzamiento.

## Stack

- **Next.js 15** (App Router, Server Components)
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS** + **shadcn/ui** + **Lucide Icons**
- **Supabase** (Postgres, Auth, RLS, Storage)
- **TanStack Query** para estado de servidor
- **Zustand** para estado de UI puntual (solo donde aporta valor)
- **React Hook Form** + **Zod** para formularios y validación
- **Framer Motion** para animaciones puntuales
- **Vercel** para despliegue

## Estructura de carpetas

```
app/                  Rutas (App Router), agrupadas por (auth) y (dashboard)
components/
  ui/                 Primitivas shadcn/ui (button, input, dialog, ...)
  layout/             Header, sidebar, navegación
  shared/             Componentes compartidos entre features
features/
  players/            UI, hooks y servicios propios de jugadores
  matches/            UI, hooks y servicios propios de partidos
  teams/               ...
  stats/
  venues/
lib/
  supabase/           Clientes de Supabase (browser, server, middleware)
  utils/              Utilidades genéricas (cn, formatters, etc.)
hooks/                Hooks compartidos no ligados a un feature
services/             Acceso a datos compartido (fuera de features/)
types/                Tipos de dominio + tipos generados de la DB
utils/                Helpers puros (fechas, cálculos de stats, etc.)
supabase/
  migrations/         Migraciones SQL versionadas
  seed/               Datos de ejemplo para desarrollo
```

Cada `feature` es independiente: su propia UI, hooks, acceso a datos y tipos.
La comunicación entre features pasa por `types/` y `services/` compartidos,
nunca importando directamente de otro feature.

## Requisitos

- Node.js 20+
- Cuenta de [Supabase](https://supabase.com) (proyecto gratuito alcanza para empezar)
- Cuenta de [Vercel](https://vercel.com) para el despliegue

## Instalación

```bash
git clone <repo>
cd futgo
npm install
cp .env.example .env.local
```

Completar `.env.local` con las credenciales de tu proyecto de Supabase
(Project Settings → API).

### Base de datos

```bash
npx supabase login
npx supabase link --project-ref <tu-project-ref>
npx supabase db push          # aplica supabase/migrations
npm run db:types              # genera types/database.types.ts
```

## Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

Comandos útiles:

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript en modo estricto, sin emitir
npm run format      # Prettier
npm run test        # Vitest (unit/integration)
npm run test:e2e    # Playwright (e2e)
```

## Despliegue (Vercel)

1. Importar el repo en Vercel.
2. Configurar las mismas variables de `.env.example` en
   Project Settings → Environment Variables.
3. Cada push a `main` dispara un deploy de producción; los PRs generan
   preview deployments automáticos.

## Seguridad

- Autenticación vía Supabase Auth.
- Row Level Security activado en todas las tablas (`supabase/migrations/0001_init.sql`):
  lectura abierta al grupo autenticado, escritura restringida a `admin`
  (excepto RSVP propio, que cada jugador gestiona sobre su propio registro).
- Validación de datos con Zod tanto en cliente como en Server Actions.
- Middleware (`middleware.ts`) protege `/dashboard` y `/admin`, redirigiendo
  a `/login` si no hay sesión.

## Checklist — Etapa 1: Fundamentos

- [x] Definición de arquitectura de carpetas
- [x] Configuración de Next.js, TypeScript estricto, Tailwind, ESLint, Prettier
- [x] Diseño de esquema de base de datos normalizado + RLS
- [x] Migración SQL inicial (`0001_init.sql`)
- [x] Clientes de Supabase (browser, server, middleware) con protección de rutas
- [x] Tokens de diseño (dark mode, verde fútbol) vía variables CSS
- [x] Layout raíz, metadata base y SEO mínimo
- [x] `.env.example` documentado
- [ ] Componentes base de shadcn/ui (button, input, card, dialog, etc.)
- [ ] Sistema de autenticación (login/registro) con React Hook Form + Zod
- [ ] Dashboard con datos reales (próximo partido, goleadores, actividad)
- [ ] CRUD de jugadores
- [ ] CRUD de partidos + convocatoria
- [ ] Registro de resultados y estadísticas automáticas

## Roadmap futuro

Torneos y tabla de posiciones, ranking ELO, generación automática de equipos
equilibrados, pagos con Mercado Pago, notificaciones (email/WhatsApp/push),
PWA instalable, app móvil con React Native, internacionalización.
