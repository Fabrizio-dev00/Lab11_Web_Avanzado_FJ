import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-xl border-indigo-100">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-indigo-700">
            Lab 11 - Dashboard shadcn/ui
          </CardTitle>
          <CardDescription className="text-base">
            Proyecto de Web Avanzado con componentes de shadcn/ui, lógica en memoria,
            formularios, validaciones y paginación.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <p className="text-slate-600">
            Ingresa al panel para gestionar proyectos, equipo, tareas, configuración
            y ver el resumen actualizado.
          </p>

          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/dashboard">
              Ir al Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}