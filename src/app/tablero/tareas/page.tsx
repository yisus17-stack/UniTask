'use client';

import { useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreVertical, PlusCircle } from "lucide-react";

const initialTareas = [
  { id: 1, titulo: "Resolver guía de Cálculo", materia: "Cálculo I", fecha: "2024-09-15", prioridad: "Alta", completada: false },
  { id: 2, titulo: "Entregar reporte de laboratorio", materia: "Programación", fecha: "2024-09-12", prioridad: "Alta", completada: false },
  { id: 3, titulo: "Leer capítulo 5 del libro", materia: "Estructuras de Datos", fecha: "2024-09-20", prioridad: "Media", completada: true },
  { id: 4, titulo: "Estudiar para el parcial", materia: "Cálculo I", fecha: "2024-09-25", prioridad: "Baja", completada: false },
  { id: 5, titulo: "Terminar proyecto final", materia: "Programación", fecha: "2024-09-10", prioridad: "Alta", completada: true },
];

type Tarea = typeof initialTareas[0];

const getPriorityVariant = (prioridad: string): "destructive" | "secondary" | "outline" => {
  switch (prioridad) {
    case 'Alta': return 'destructive';
    case 'Media': return 'secondary';
    default: return 'outline';
  }
};

const TaskCard = ({ tarea, onToggle, onDelete }: { tarea: Tarea, onToggle: (id: number) => void, onDelete: (id: number) => void }) => (
  <Card className="transition-all hover:shadow-md">
    <CardContent className="p-4 flex items-start gap-4">
      <Checkbox id={`task-${tarea.id}`} checked={tarea.completada} onCheckedChange={() => onToggle(tarea.id)} className="mt-1" />
      <div className="flex-1 grid gap-1">
        <label htmlFor={`task-${tarea.id}`} className={`font-medium cursor-pointer ${tarea.completada ? 'line-through text-muted-foreground' : ''}`}>
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
          <DropdownMenuItem className="text-destructive" onClick={() => onDelete(tarea.id)}>Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardContent>
  </Card>
);


function AddTaskInput({ onAdd }: { onAdd: (title: string) => void }) {
  const [text, setText] = useState("");

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  };

  return (
    <form onSubmit={handleAdd} className="flex w-full items-center space-x-2">
      <Input
        placeholder="Nueva tarea..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit">
        <PlusCircle className="mr-2 h-4 w-4" />
        Agregar Tarea
      </Button>
    </form>
  );
}


export default function PaginaTareas() {
  const [tareas, setTareas] = useState<Tarea[]>(initialTareas);

  const handleAddTask = (titulo: string) => {
    const newTask: Tarea = {
      id: Date.now(),
      titulo,
      materia: "Sin materia",
      fecha: new Date().toISOString().split('T')[0],
      prioridad: "Media",
      completada: false,
    };
    setTareas([newTask, ...tareas]);
  };

  const handleToggleTask = (id: number) => {
    setTareas(
      tareas.map(t =>
        t.id === id ? { ...t, completada: !t.completada } : t
      )
    );
  };
  
  const handleDeleteTask = (id: number) => {
    setTareas(tareas.filter(t => t.id !== id));
  };

  const tareasPendientes = tareas.filter(t => !t.completada).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  const tareasCompletadas = tareas.filter(t => t.completada).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold tracking-tight sr-only">Mis Tareas</h2>
         <div className="w-full">
            <AddTaskInput onAdd={handleAddTask} />
         </div>
      </div>

      <Tabs defaultValue="pendientes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="completadas">Completadas</TabsTrigger>
        </TabsList>
        <TabsContent value="pendientes" className="mt-4 space-y-4">
          {tareasPendientes.length > 0 ? tareasPendientes.map(tarea => (
            <TaskCard key={tarea.id} tarea={tarea} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
          )) : <p className="text-center text-muted-foreground py-8">¡No tienes tareas pendientes!</p>}
        </TabsContent>
        <TabsContent value="completadas" className="mt-4 space-y-4">
          {tareasCompletadas.length > 0 ? tareasCompletadas.map(tarea => (
            <TaskCard key={tarea.id} tarea={tarea} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
          )) : <p className="text-center text-muted-foreground py-8">Aún no has completado ninguna tarea.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
