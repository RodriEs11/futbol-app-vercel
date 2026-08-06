"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const bottomNavItems = [
  { name: "Inicio", href: "/inicio", icon: Home },
  { name: "Partidos", href: "/partidos", icon: Calendar },
  { name: "Jugadores", href: "/jugadores", icon: Users },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full h-16 bg-card border-t flex items-center justify-around md:hidden pb-safe">
      {bottomNavItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 text-xs font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
