'use client'

import React, { useState } from 'react'
import { Plus, Clock, MapPin, User, Trash2, Book, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
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
import { cn } from '@/lib/utils'

interface ScheduleContentProps {
  horarios: Horario[]
  materias: Materia[]
}

const START_HOUR = 7;
const END_HOUR = 22;
const DAYS_TO_SHOW = DIAS_SEMANA.slice(1, 7); // Mon to Sat

const timeToMinutes = (time: string) => {
  if (!time) return 0
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export function ScheduleContent({ horarios, materias }: ScheduleContentProps) {
  const [showAddClass, setShowAddClass] = useState(false)
  const [showAddMateria, setShowAddMateria] = useState(false)
  const [showDeleteHorario, setShowDeleteHorario] = useState<Horario | null>(null)
  const [showDeleteMateria, setShowDeleteMateria] = useState<Materia | null>(null)
  const [selectedHorario, setSelectedHorario] = useState<Horario | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  const today = new Date()
  today.setHours(0,0,0,0)
  
  const weekStart = new Date(currentDate)
  const dayOffset = currentDate.getDay() === 0 ? -6 : 1 - currentDate.getDay()
  weekStart.setDate(currentDate.getDate() + dayOffset)
  weekStart.setHours(0,0,0,0)

  const weekDays = Array.from({ length: 6 }).map((_, i) => {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + i)
    return day
  })

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

  const handleDeleteHorario = async () => {
    if (!showDeleteHorario) return
    setLoading(true)
    const result = await deleteHorario(showDeleteHorario.id)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Clase eliminada')
    }
    setShowDeleteHorario(null)
    setSelectedHorario(null)
  }
  
  const handleDeleteMateria = async () => {
    if (!showDeleteMateria) return
    setLoading(true)
    const result = await deleteMateria(showDeleteMateria.id)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Materia eliminada')
    }
    setShowDeleteMateria(null)
  }
  
  const totalRows = (END_HOUR - START_HOUR) * 2;

  return (
    <main className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 pt-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Horario</h1>
          <p className="text-muted-foreground">Tu semana académica</p>
        </div>
        <div className="flex items-center gap-2">
           <Dialog open={showAddMateria} onOpenChange={setShowAddMateria}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Book className="w-4 h-4 mr-2"/>
                Materias
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
                      onClick={() => setShowDeleteMateria(materia)}
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
                Clase
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
                  <Select name="dia_semana" required defaultValue={(new Date().getDay()).toString()}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      {DAYS_TO_SHOW.map((_, index) => (
                        <SelectItem key={index} value={(index + 1).toString()}>{DIAS_SEMANA[index + 1]}</SelectItem>
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
      
      <div className="flex-1 min-h-0 border-t border-border overflow-hidden">
        <div 
          className="grid h-full"
          style={{ gridTemplateColumns: '4rem 1fr' }}
        >
          <div className="h-full border-r relative">
            <div className="sticky top-0 bg-card z-20 h-16 border-b"></div>
            {Array.from({ length: END_HOUR - START_HOUR }).map((_, hourIndex) => {
              const hour = START_HOUR + hourIndex;
              return (
                <div key={hour} className="relative h-24 text-right pr-2">
                  <p className="absolute -top-2.5 right-2 text-xs text-muted-foreground">{`${hour}:00`}</p>
                </div>
              )
            })}
          </div>

          <div className="overflow-x-auto">
            <div 
              className="grid min-w-[750px]"
              style={{ 
                gridTemplateColumns: 'repeat(6, 1fr)',
              }}
            >
              {/* Day Headers */}
              <div className="col-span-6 grid grid-cols-6 sticky top-0 bg-card z-20 border-b">
                {weekDays.map((day) => {
                  const isToday = day.getTime() === today.getTime()
                  return (
                    <div key={day.toISOString()} className="text-center p-3 border-r last:border-r-0">
                      <p className="font-medium text-muted-foreground text-sm">{DIAS_SEMANA_CORTO[day.getDay()]}</p>
                      <p className={cn("text-2xl font-bold", isToday ? "text-primary" : "text-foreground")}>
                        {day.getDate()}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div 
                className="col-span-6 grid relative"
                style={{
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gridTemplateRows: `repeat(${totalRows}, 2rem)`
                }}
              >
                {/* Grid Lines */}
                {Array.from({ length: 6 * totalRows }).map((_, i) => (
                  <div key={i} className="border-b border-r border-border/50"></div>
                ))}
                
                {/* Events */}
                {horarios.map(horario => {
                  if (!horario.hora_inicio || !horario.hora_fin || horario.dia_semana < 1 || horario.dia_semana > 6) return null;
                  
                  const start = timeToMinutes(horario.hora_inicio);
                  const end = timeToMinutes(horario.hora_fin);

                  const gridRowStart = (start - (START_HOUR * 60)) / 30 + 1;
                  const gridRowEnd = (end - (START_HOUR * 60)) / 30 + 1;

                  if (gridRowStart < 1 || gridRowEnd > totalRows + 1) return null;

                  return (
                    <div
                      key={horario.id}
                      onClick={() => setSelectedHorario(horario)}
                      className="relative flex flex-col p-2 rounded-lg m-px overflow-hidden group shadow-sm cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
                      style={{
                        gridColumn: horario.dia_semana,
                        gridRow: `${Math.floor(gridRowStart)} / ${Math.floor(gridRowEnd)}`,
                        backgroundColor: `${horario.materia?.color}20`,
                        borderLeft: `3px solid ${horario.materia?.color}`,
                      }}
                    >
                      <p className="font-semibold text-sm" style={{ color: horario.materia?.color }}>{horario.materia?.nombre}</p>
                      <p className="text-xs text-muted-foreground">{`${horario.hora_inicio.slice(0,5)} - ${horario.hora_fin.slice(0,5)}`}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Class Detail Dialog */}
      <Dialog open={!!selectedHorario} onOpenChange={() => setSelectedHorario(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles de la Clase</DialogTitle>
          </DialogHeader>
          {selectedHorario && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-10 rounded-full" style={{backgroundColor: selectedHorario.materia?.color}}></div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedHorario.materia?.nombre}</h3>
                  <p className="text-muted-foreground">{DIAS_SEMANA[selectedHorario.dia_semana]}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-3"><Clock className="w-4 h-4 text-muted-foreground"/> {selectedHorario.hora_inicio.slice(0,5)} - {selectedHorario.hora_fin.slice(0,5)}</p>
                {selectedHorario.aula && <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-muted-foreground"/> {selectedHorario.aula}</p>}
                {selectedHorario.docente && <p className="flex items-center gap-3"><User className="w-4 h-4 text-muted-foreground"/> {selectedHorario.docente}</p>}
              </div>
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setShowDeleteHorario(selectedHorario)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar Clase
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Horario Confirmation */}
      <AlertDialog open={!!showDeleteHorario} onOpenChange={() => setShowDeleteHorario(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar clase</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de eliminar "{showDeleteHorario?.materia?.nombre}"? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteHorario} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={loading}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       {/* Delete Materia Confirmation */}
       <AlertDialog open={!!showDeleteMateria} onOpenChange={() => setShowDeleteMateria(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar materia</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de eliminar "{showDeleteMateria?.nombre}"? Esto también eliminará todas las clases y tareas asociadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMateria} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={loading}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
