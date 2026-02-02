import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreVertical, PlusCircle } from "lucide-react";

const tareas = [
  { id: 1, titulo: "Resolver guía de Cálculo", materia: "Cálculo I", fecha: "2024-09-15", prioridad: "Alta", completada: false },
  { id: 2, titulo: "Entregar reporte de laboratorio", materia: "Programación", fecha: "2024-09-12", prioridad: "Alta", completada: false },
  { id: 3, titulo: "Leer capítulo 5 del libro", materia: "Estructuras de Datos", fecha: "2024-09-20", prioridad: "Media", completada: true },
  { id: 4, titulo: "Estudiar para el parcial", materia: "Cálculo I", fecha: "2024-09-25", prioridad: "Baja", completada: false },
  { id: 5, titulo: "Terminar proyecto final", materia: "Programación", fecha: "2024-09-10", prioridad: "Alta", completada: true },
];

const getPriorityVariant = (prioridad: string): "destructive" | "secondary" | "outline" => {
  switch (prioridad) {
    case 'Alta': return 'destructive';
    case 'Media': return 'secondary';
    default: return 'outline';
  }
};

const TaskCard = ({ tarea }: { tarea: typeof tareas[0] }) => (
  <Card className="transition-all hover:shadow-md">
    <CardContent className="p-4 flex items-start gap-4">
      <Checkbox id={`task-${tarea.id}`} checked={tarea.completada} className="mt-1" />
      <div className="flex-1 grid gap-1">
        <label htmlFor={`task-${tarea.id}`} className={`font-medium ${tarea.completada ? 'line-through text-muted-foreground' : ''}`}>
          {tarea.titulo}
        </label>
        <p className="text-sm text-muted-foreground">{tarea.materia}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Vence: {new Date(tarea.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
          <Badge variant={getPriorityVariant(tarea.prioridad)}>{tarea.prioridad}</Badge>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Editar</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardContent>
  </Card>
);

export default function PaginaTareas() {
  const tareasPendientes = tareas.filter(t => !t.completada);
  const tareasCompletadas = tareas.filter(t => t.completada);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold tracking-tight sr-only">Mis Tareas</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Tarea
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nueva Tarea</DialogTitle>
              <DialogDescription>Añade una nueva tarea a tu lista.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="titulo">Título de la tarea</Label>
                <Input id="titulo" placeholder="Ej: Reporte de laboratorio" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="materia-tarea">Materia</Label>
                <Input id="materia-tarea" placeholder="Ej: Programación" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fecha">Fecha de entrega</Label>
                  <Input id="fecha" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prioridad">Prioridad</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Selecciona prioridad" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reminder">Recordatorio</Label>
                <Select>
                    <SelectTrigger><SelectValue placeholder="Sin recordatorio" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 minutos antes</SelectItem>
                        <SelectItem value="15">15 minutos antes</SelectItem>
                        <SelectItem value="60">1 hora antes</SelectItem>
                        <SelectItem value="1440">1 día antes</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar Tarea</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="pendientes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="completadas">Completadas</TabsTrigger>
        </TabsList>
        <TabsContent value="pendientes" className="mt-4 space-y-4">
          {tareasPendientes.length > 0 ? tareasPendientes.map(tarea => (
            <TaskCard key={tarea.id} tarea={tarea} />
          )) : <p className="text-center text-muted-foreground py-8">¡No tienes tareas pendientes!</p>}
        </TabsContent>
        <TabsContent value="completadas" className="mt-4 space-y-4">
          {tareasCompletadas.length > 0 ? tareasCompletadas.map(tarea => (
            <TaskCard key={tarea.id} tarea={tarea} />
          )) : <p className="text-center text-muted-foreground py-8">Aún no has completado ninguna tarea.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
