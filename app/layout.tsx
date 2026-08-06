import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FutGo — Organizá tus partidos",
    template: "%s · FutGo",
  },
  description:
    "Plataforma para organizar partidos de fútbol amateur entre amigos: convocatorias, resultados y estadísticas.",
  metadataBase: new URL("https://futgo.app"),
  openGraph: {
    title: "FutGo",
    description:
      "Organizá partidos, convocá jugadores y llevá las estadísticas de tu grupo.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
