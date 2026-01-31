'use client'

import { useState, useTransition } from 'react'
import { Plus, CheckCircle2, Circle, Trash2, Calendar, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Tarea, Materia } from '@/lib/types'
import { createTarea, updateTarea, deleteTarea } from '@/app/actions/data'
import { formatDistanceToNow, formatDate } from '@/lib/date-utils'
import { toast } from 'sonner'

interface TasksContentProps {
  tareas: Tarea[]
  materias: Materia[]
}

type FilterType = 'todas' | 'pendientes' | 'completadas'

export function TasksContent({ tareas, materias }: TasksContentProps) {
  const [showAddTask, setShowAddTask] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Tarea | null>(null)
  const [filter, setFilter] = useState<FilterType>('pendientes')
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)

  const filteredTareas = tareas.filter(t => {
    if (filter === 'pendientes') return !t.completada
    if (filter === 'completadas') return t.completada
    return true
  })

  const handleAddTask = async (formData: FormData) => {
    setLoading(true)
    const result = await createTarea(formData)
    setLoading(false)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Tarea creada')
      setShowAddTask(false)
    }
  }

  const handleToggleComplete = (tarea: Tarea) => {
    startTransition(async () => {
      const result = await updateTarea(tarea.id, !tarea.completada)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(tarea.completada ? 'Tarea marcada como pendiente' : 'Tarea completada')
      }
    })
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setLoading(true)
    const result = await deleteTarea(deleteTarget.id)
    setLoading(false)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Tarea eliminada')
    }
    setDeleteTarget(null)
  }

  const pendingCount = tareas.filter(t => !t.completada).length
  const completedCount = tareas.filter(t => t.completada).length

  return (
    <main className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tareas</h1>
          <p className="text-muted-foreground text-sm">
            {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''} • {completedCount} completada{completedCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Filter className="w-4 h-4 mr-1" />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
                <DropdownMenuRadioItem value="todas">Todas</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pendientes">Pendientes</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="completadas">Completadas</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Nueva
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva Tarea</DialogTitle>
              </DialogHeader>
              <form action={handleAddTask} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripcion</Label>
                  <Textarea 
                    id="descripcion" 
                    name="descripcion" 
                    placeholder="Describe tu tarea..." 
                    required 
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="materia_id">Materia (opcional)</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="fecha_entrega">Fecha de entrega</Label>
                  <Input 
                    id="fecha_entrega" 
                    name="fecha_entrega" 
                    type="date" 
                    required 
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prioridad">Prioridad</Label>
                  <Select name="prioridad" defaultValue="media">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baja">Baja</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  Crear Tarea
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTareas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {filter === 'pendientes' ? 'No tienes tareas pendientes' :
                 filter === 'completadas' ? 'No tienes tareas completadas' :
                 'No tienes tareas'}
              </p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => setShowAddTask(true)}
              >
                Crear una tarea
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredTareas.map((tarea) => (
            <Card key={tarea.id} className={tarea.completada ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleComplete(tarea)}
                    disabled={isPending}
                    className="mt-0.5 flex-shrink-0"
                  >
                    {tarea.completada ? (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-foreground ${tarea.completada ? 'line-through' : ''}`}>
                      {tarea.descripcion}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {tarea.materia && (
                        <Badge variant="secondary" className="gap-1">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: tarea.materia.color }} 
                          />
                          {tarea.materia.nombre}
                        </Badge>
                      )}
                      <Badge variant={
                        tarea.prioridad === 'alta' ? 'destructive' :
                        tarea.prioridad === 'media' ? 'default' : 'secondary'
                      }>
                        {tarea.prioridad}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(tarea.fecha_entrega))}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive flex-shrink-0"
                    onClick={() => setDeleteTarget(tarea)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar tarea</AlertDialogTitle>
            <AlertDialogDescription>
              Estas seguro de eliminar esta tarea? Esta accion no se puede deshacer.
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
