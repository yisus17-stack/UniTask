import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, PlusCircle } from "lucide-react";

const horarioData: { [key: string]: { hora: string; materia: string; aula: string }[] } = {
  Lunes: [{ hora: "08:00 - 10:00", materia: "Cálculo I", aula: "A-101" }],
  Martes: [{ hora: "10:00 - 12:00", materia: "Programación Orientada a Objetos", aula: "Lab-3" }],
  Miércoles: [{ hora: "08:00 - 10:00", materia: "Cálculo I", aula: "A-101" }],
  Jueves: [{ hora: "14:00 - 16:00", materia: "Estructuras de Datos", aula: "B-204" }],
  Viernes: [{ hora: "10:00 - 12:00", materia: "Programación Orientada a Objetos", aula: "Lab-3" }],
  Sábado: [],
  Domingo: [],
};

const dias = Object.keys(horarioData);

export default function PaginaHorario() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight sr-only">Mi Horario</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Clase
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nueva Clase</DialogTitle>
              <DialogDescription>Completa los detalles de tu nueva clase.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="materia">Materia</Label>
                <Input id="materia" placeholder="Ej: Cálculo I" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dia">Día</Label>
                   <Select>
                    <SelectTrigger><SelectValue placeholder="Selecciona un día" /></SelectTrigger>
                    <SelectContent>
                      {dias.slice(0, 5).map(dia => <SelectItem key={dia} value={dia}>{dia}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="aula">Aula</Label>
                  <Input id="aula" placeholder="Ej: A-101" />
                </div>
              </div>
               <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="hora-inicio">Hora de inicio</Label>
                  <Input id="hora-inicio" type="time" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hora-fin">Hora de fin</Label>
                  <Input id="hora-fin" type="time" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar Clase</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        {dias.map(dia => (
          <div key={dia} className="flex flex-col space-y-4">
            <h3 className="font-headline text-lg font-semibold text-center">{dia}</h3>
            <div className="space-y-2 rounded-lg bg-card p-4 min-h-[150px]">
              {horarioData[dia].length > 0 ? (
                horarioData[dia].map((clase, index) => (
                  <Card key={index} className="bg-accent/30 shadow-sm transition-all hover:shadow-md">
                    <CardContent className="p-3">
                       <div className="flex justify-between items-start">
                         <div className="space-y-1">
                          <p className="font-semibold text-sm leading-none">{clase.materia}</p>
                          <p className="text-xs text-muted-foreground">{clase.hora}</p>
                          <p className="text-xs text-muted-foreground">Aula: {clase.aula}</p>
                        </div>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                       </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-muted-foreground">Sin clases.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
