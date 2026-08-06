"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, MapPin, Users, BarChart2, User } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export const navItems = [
  { name: "Inicio", href: "/inicio", icon: Home },
  { name: "Partidos", href: "/partidos", icon: Calendar },
  { name: "Jugadores", href: "/jugadores", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-card md:flex">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary">
          <span className="text-xl">TUKAS</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
