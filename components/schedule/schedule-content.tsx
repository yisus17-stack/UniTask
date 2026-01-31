'use client'

import { useState } from 'react'
import { Plus, Clock, MapPin, User, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Horario, Materia } from '@/lib/types'
import { DIAS_SEMANA, DIAS_SEMANA_CORTO, COLORES_MATERIA } from '@/lib/types'
import { createHorario, deleteHorario, createMateria, deleteMateria } from '@/app/actions/data'
import { toast } from 'sonner'

interface ScheduleContentProps {
  horarios: Horario[]
  materias: Materia[]
}

export function ScheduleContent({ horarios, materias }: ScheduleContentProps) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay())
  const [showAddClass, setShowAddClass] = useState(false)
  const [showAddMateria, setShowAddMateria] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'horario' | 'materia', id: string, name: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const horariosDelDia = horarios
    .filter(h => h.dia_semana === selectedDay)
    .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))

  const handleAddClass = async (formData: FormData) => {
    setLoading(true)
    formData.set('dia_semana', selectedDay.toString())
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
      setShowAddMateria(false)
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

  return (
    <main className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Horario</h1>
          <p className="text-muted-foreground text-sm">Tu semana academica</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddMateria} onOpenChange={setShowAddMateria}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Plus className="w-4 h-4 mr-1" />
                Materia
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva Materia</DialogTitle>
              </DialogHeader>
              <form action={handleAddMateria} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="materia-nombre">Nombre</Label>
                  <Input id="materia-nombre" name="nombre" placeholder="Calculo I" required />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORES_MATERIA.map((color) => (
                      <label key={color} className="cursor-pointer">
                        <input type="radio" name="color" value={color} className="sr-only peer" defaultChecked={color === COLORES_MATERIA[0]} />
                        <div 
                          className="w-8 h-8 rounded-full peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-primary"
                          style={{ backgroundColor: color }}
                        />
                      </label>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  Crear Materia
                </Button>
              </form>
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
                <DialogTitle>Nueva Clase - {DIAS_SEMANA[selectedDay]}</DialogTitle>
              </DialogHeader>
              <form action={handleAddClass} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="materia_id">Materia</Label>
                  <Select name="materia_id">
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
                  <Input id="docente" name="docente" placeholder="Prof. Garcia" />
                </div>
                <Button type="submit" className="w-full" disabled={loading || materias.length === 0}>
                  {materias.length === 0 ? 'Primero crea una materia' : 'Agregar Clase'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {DIAS_SEMANA_CORTO.map((dia, index) => (
          <button
            key={index}
            onClick={() => setSelectedDay(index)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedDay === index
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {dia}
          </button>
        ))}
      </div>

      {/* Materias Section */}
      {materias.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Tus Materias</h2>
          <div className="flex gap-2 flex-wrap">
            {materias.map((materia) => (
              <Badge
                key={materia.id}
                variant="secondary"
                className="gap-2 pr-1 cursor-pointer hover:bg-secondary/80"
                onClick={() => setDeleteTarget({ type: 'materia', id: materia.id, name: materia.nombre })}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: materia.color }} />
                {materia.nombre}
                <Trash2 className="w-3 h-3 ml-1 text-muted-foreground" />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Schedule List */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          {DIAS_SEMANA[selectedDay]} - {horariosDelDia.length} clase{horariosDelDia.length !== 1 ? 's' : ''}
        </h2>
        
        {horariosDelDia.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No tienes clases este dia</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => setShowAddClass(true)}
              >
                Agregar una clase
              </Button>
            </CardContent>
          </Card>
        ) : (
          horariosDelDia.map((horario) => (
            <Card key={horario.id} className="overflow-hidden">
              <div className="flex">
                <div 
                  className="w-1.5"
                  style={{ backgroundColor: horario.materia?.color || '#3B82F6' }}
                />
                <CardContent className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {horario.materia?.nombre || 'Clase'}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {horario.hora_inicio.slice(0, 5)} - {horario.hora_fin.slice(0, 5)}
                        </span>
                        {horario.aula && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {horario.aula}
                          </span>
                        )}
                      </div>
                      {horario.docente && (
                        <p className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          {horario.docente}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteTarget({ 
                        type: 'horario', 
                        id: horario.id, 
                        name: horario.materia?.nombre || 'esta clase' 
                      })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar {deleteTarget?.type === 'horario' ? 'clase' : 'materia'}</AlertDialogTitle>
            <AlertDialogDescription>
              Estas seguro de eliminar {deleteTarget?.name}? 
              {deleteTarget?.type === 'materia' && ' Esto tambien eliminara todas las clases asociadas.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
