'use client'

import React, { useState } from 'react'
import { Plus, Clock, MapPin, User, Trash2, Book } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Horario, Materia } from '@/lib/types'
import { DIAS_SEMANA, DIAS_SEMANA_CORTO, COLORES_MATERIA } from '@/lib/types'
import { createHorario, deleteHorario, createMateria, deleteMateria } from '@/app/actions/data'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ScheduleContentProps {
  horarios: Horario[]
  materias: Materia[]
}

const START_HOUR = 7;
const END_HOUR = 22;
const DAYS_TO_SHOW = DIAS_SEMANA.slice(1, 7); // Mon to Sat

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export function ScheduleContent({ horarios, materias }: ScheduleContentProps) {
  const [showAddClass, setShowAddClass] = useState(false)
  const [showAddMateria, setShowAddMateria] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'horario' | 'materia', id: string, name: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedDayForModal, setSelectedDayForModal] = useState(new Date().getDay());

  const handleAddClass = async (formData: FormData) => {
    setLoading(true)
    const result = await createHorario(formData)
    setLoading(false)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Clase agregada')
      setShowAddClass(false)
    }
  }

  const handleAddMateria = async (formData: FormData) => {
    setLoading(true)
    const result = await createMateria(formData)
    setLoading(false)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Materia creada')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setLoading(true)
    
    const result = deleteTarget.type === 'horario' 
      ? await deleteHorario(deleteTarget.id)
      : await deleteMateria(deleteTarget.id)
    
    setLoading(false)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(deleteTarget.type === 'horario' ? 'Clase eliminada' : 'Materia eliminada')
    }
    setDeleteTarget(null)
  }
  
  const totalRows = (END_HOUR - START_HOUR) * 2;

  return (
    <main className="px-4 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Horario</h1>
          <p className="text-muted-foreground">Tu semana académica</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showAddMateria} onOpenChange={setShowAddMateria}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Book className="w-4 h-4 mr-2"/>
                Gestionar Materias
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tus Materias</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="flex gap-2 flex-wrap mb-4">
                  {materias.map((materia) => (
                    <Badge
                      key={materia.id}
                      variant="outline"
                      className="gap-2 p-2 cursor-pointer hover:border-destructive/50 group"
                      onClick={() => setDeleteTarget({ type: 'materia', id: materia.id, name: materia.nombre })}
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: materia.color }} />
                      {materia.nombre}
                      <Trash2 className="w-3 h-3 text-muted-foreground group-hover:text-destructive transition-colors" />
                    </Badge>
                  ))}
                </div>
                {materias.length === 0 && (
                   <p className="text-sm text-muted-foreground text-center py-4">Aún no has creado materias.</p>
                )}
                <form action={handleAddMateria} className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium">Nueva Materia</h3>
                  <div className="space-y-2">
                    <Label htmlFor="materia-nombre">Nombre</Label>
                    <Input id="materia-nombre" name="nombre" placeholder="Cálculo I" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex gap-2 flex-wrap">
                      {COLORES_MATERIA.map((color) => (
                        <label key={color} className="cursor-pointer">
                          <input type="radio" name="color" value={color} className="sr-only peer" defaultChecked={color === COLORES_MATERIA[0]} />
                          <div 
                            className="w-8 h-8 rounded-full transition-all peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-primary peer-checked:ring-offset-background"
                            style={{ backgroundColor: color }}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    <Plus className="w-4 h-4 mr-2"/>
                    Crear Materia
                  </Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showAddClass} onOpenChange={setShowAddClass}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Nueva Clase
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva Clase</DialogTitle>
              </DialogHeader>
              <form action={handleAddClass} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="materia_id">Materia</Label>
                  <Select name="materia_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una materia" />
                    </SelectTrigger>
                    <SelectContent>
                      {materias.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                            {m.nombre}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                   {materias.length === 0 && (
                    <p className="text-xs text-muted-foreground">Primero debes crear materias.</p>
                  )}
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="dia_semana">Día</Label>
                  <Select name="dia_semana" required defaultValue={selectedDayForModal.toString()}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      {DAYS_TO_SHOW.map((day, index) => (
                        <SelectItem key={day} value={(index + 1).toString()}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hora_inicio">Hora inicio</Label>
                    <Input id="hora_inicio" name="hora_inicio" type="time" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hora_fin">Hora fin</Label>
                    <Input id="hora_fin" name="hora_fin" type="time" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aula">Aula (opcional)</Label>
                  <Input id="aula" name="aula" placeholder="A-101" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="docente">Docente (opcional)</Label>
                  <Input id="docente" name="docente" placeholder="Prof. García" />
                </div>
                <Button type="submit" className="w-full" disabled={loading || materias.length === 0}>
                  {materias.length === 0 ? 'Crea una materia primero' : 'Agregar Clase'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-auto bg-card">
        <div 
            className="grid"
            style={{ 
              gridTemplateColumns: '4rem repeat(6, 1fr)',
              gridTemplateRows: `auto repeat(${totalRows}, 2.5rem)`
            }}
          >
          {/* Corner */}
          <div className="border-b border-r sticky top-0 bg-card z-20"></div>

          {/* Day Headers */}
          {DAYS_TO_SHOW.map((day, index) => (
            <div key={day} className="text-center p-3 border-b border-r sticky top-0 bg-card z-10">
              <p className="font-semibold text-foreground">{DIAS_SEMANA_CORTO[index + 1]}</p>
            </div>
          ))}

          {/* Time Gutter and Grid Lines */}
          {Array.from({ length: END_HOUR - START_HOUR }).map((_, hourIndex) => {
            const hour = START_HOUR + hourIndex;
            return (
              <React.Fragment key={hour}>
                <div 
                  className="row-span-2 border-r relative"
                  style={{ gridRow: hourIndex * 2 + 2 }}
                >
                  <p className="absolute -top-2.5 right-2 text-xs text-muted-foreground">{`${hour}:00`}</p>
                </div>
                {DAYS_TO_SHOW.map((_, dayIndex) => (
                  <div 
                    key={`${hour}-${dayIndex}`}
                    className="border-b border-r"
                    style={{ 
                      gridColumn: dayIndex + 2,
                      gridRow: `${hourIndex * 2 + 2} / span 2`
                    }}
                  ></div>
                ))}
              </React.Fragment>
            )
          })}

          {/* Events */}
          {horarios.map(horario => {
            if (horario.dia_semana < 1 || horario.dia_semana > 6) return null;
            
            const start = timeToMinutes(horario.hora_inicio);
            const end = timeToMinutes(horario.hora_fin);

            const gridRowStart = (start - (START_HOUR * 60)) / 30 + 2;
            const gridRowEnd = (end - (START_HOUR * 60)) / 30 + 2;

            if (gridRowStart < 2 || gridRowEnd > totalRows + 2) return null;

            return (
              <div
                key={horario.id}
                className="relative flex flex-col p-2 rounded-lg m-px overflow-hidden group shadow-sm"
                style={{
                  gridColumn: horario.dia_semana + 1,
                  gridRow: `${Math.floor(gridRowStart)} / ${Math.floor(gridRowEnd)}`,
                  backgroundColor: `${horario.materia?.color}20`,
                  border: `1px solid ${horario.materia?.color}80`
                }}
              >
                <p className="font-semibold text-sm" style={{ color: horario.materia?.color }}>{horario.materia?.nombre}</p>
                <p className="text-xs text-muted-foreground">{`${horario.hora_inicio.slice(0,5)} - ${horario.hora_fin.slice(0,5)}`}</p>
                {horario.aula && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/>{horario.aula}</p>}
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-0.5 right-0.5 h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setDeleteTarget({ type: 'horario', id: horario.id, name: horario.materia?.nombre || 'esta clase' })}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar {deleteTarget?.type === 'horario' ? 'clase' : 'materia'}</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de eliminar "{deleteTarget?.name}"? 
              {deleteTarget?.type === 'materia' && ' Esto también eliminará todas las clases y tareas asociadas.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={loading}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
