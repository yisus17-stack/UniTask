'use client'

import { useState, useTransition } from 'react'
import { Plus, CheckCircle2, Circle, Trash2, Calendar, Filter } from 'lucide-react'
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
import { formatDistanceToNow } from '@/lib/date-utils'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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
  }).sort((a,b) => new Date(a.fecha_entrega).getTime() - new Date(b.fecha_entrega).getTime())

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
        toast.success(tarea.completada ? 'Tarea marcada como pendiente' : '¡Tarea completada! 🎉')
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Tareas</h1>
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
              <form action={handleAddTask} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea id="descripcion" name="descripcion" placeholder="Describe tu tarea..." required rows={3} />
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
                  <Input id="fecha_entrega" name="fecha_entrega" type="date" required min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prioridad">Prioridad</Label>
                  <Select name="prioridad" defaultValue="media">
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
          <div className="text-center py-20 px-4 rounded-lg bg-muted/30 border-2 border-dashed border-border">
            <CheckCircle2 className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              {filter === 'pendientes' ? '¡Todo al día!' :
               filter === 'completadas' ? 'Sin tareas completadas' :
               'No hay tareas'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {filter === 'pendientes' ? 'No tienes tareas pendientes.' : 'Aquí aparecerán tus tareas.'}
            </p>
            <Button variant="outline" onClick={() => setShowAddTask(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear una tarea
            </Button>
          </div>
        ) : (
          filteredTareas.map((tarea) => (
            <div key={tarea.id} className={cn("p-4 rounded-lg border flex items-start gap-4 transition-opacity", tarea.completada ? 'bg-muted/30 opacity-60' : 'bg-muted/50')}>
              <button
                onClick={() => handleToggleComplete(tarea)}
                disabled={isPending}
                className="mt-1 flex-shrink-0"
              >
                {tarea.completada ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground transition-colors hover:text-primary" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={cn("font-medium text-foreground", tarea.completada && 'line-through decoration-muted-foreground')}>
                  {tarea.descripcion}
                </p>
                
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {tarea.materia && (
                    <Badge variant="secondary" className="gap-1.5">
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
                  } className="capitalize">
                    {tarea.prioridad}
                  </Badge>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDistanceToNow(new Date(tarea.fecha_entrega))}
                  </span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive flex-shrink-0 h-8 w-8"
                onClick={() => setDeleteTarget(tarea)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar tarea</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de eliminar esta tarea? Esta acción no se puede deshacer.
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
