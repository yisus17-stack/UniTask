'use client'

import { useState, useTransition } from 'react'
import { Plus, Bell, BellOff, Trash2, Clock, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Recordatorio } from '@/lib/types'
import { createRecordatorio, toggleRecordatorio, deleteRecordatorio } from '@/app/actions/data'
import { formatDateTime } from '@/lib/date-utils'
import { toast } from 'sonner'

interface RemindersContentProps {
  recordatorios: Recordatorio[]
}

export function RemindersContent({ recordatorios }: RemindersContentProps) {
  const [showAddReminder, setShowAddReminder] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Recordatorio | null>(null)
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)

  const activeCount = recordatorios.filter(r => r.activo).length
  const now = new Date()

  const upcomingReminders = recordatorios.filter(r => new Date(r.fecha_hora) >= now).sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime())
  const pastReminders = recordatorios.filter(r => new Date(r.fecha_hora) < now).sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime())

  const handleAddReminder = async (formData: FormData) => {
    setLoading(true)
    const result = await createRecordatorio(formData)
    setLoading(false)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Recordatorio creado')
      setShowAddReminder(false)
    }
  }

  const handleToggle = (recordatorio: Recordatorio) => {
    startTransition(async () => {
      const result = await toggleRecordatorio(recordatorio.id, !recordatorio.activo)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(recordatorio.activo ? 'Recordatorio desactivado' : 'Recordatorio activado')
      }
    })
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setLoading(true)
    const result = await deleteRecordatorio(deleteTarget.id)
    setLoading(false)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Recordatorio eliminado')
    }
    setDeleteTarget(null)
  }

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'tarea': return 'Tarea'
      case 'clase': return 'Clase'
      default: return 'Manual'
    }
  }

  return (
    <main className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Recordatorios</h1>
          <p className="text-muted-foreground text-sm">
            {activeCount} activo{activeCount !== 1 ? 's' : ''}
          </p>
        </div>
        <Dialog open={showAddReminder} onOpenChange={setShowAddReminder}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Nuevo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Recordatorio</DialogTitle>
            </DialogHeader>
            <form action={handleAddReminder} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input id="titulo" name="titulo" placeholder="Ej: Estudiar para examen" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción (opcional)</Label>
                <Textarea id="descripcion" name="descripcion" placeholder="Detalles adicionales..." rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_hora">Fecha y hora</Label>
                <Input id="fecha_hora" name="fecha_hora" type="datetime-local" required min={new Date().toISOString().slice(0, 16)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select name="tipo" defaultValue="manual">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="tarea">Tarea</SelectItem>
                    <SelectItem value="clase">Clase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                Crear Recordatorio
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reminders List */}
      {recordatorios.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-lg bg-muted/30 border-2 border-dashed border-border">
          <Bell className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground">Sin recordatorios</h3>
          <p className="text-muted-foreground mb-4">Parece que no has creado ningún recordatorio aún.</p>
          <Button variant="outline" onClick={() => setShowAddReminder(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crear un recordatorio
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {upcomingReminders.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" />Próximos</h2>
              {upcomingReminders.map((recordatorio) => (
                <ReminderCard
                  key={recordatorio.id}
                  recordatorio={recordatorio}
                  onToggle={() => handleToggle(recordatorio)}
                  onDelete={() => setDeleteTarget(recordatorio)}
                  isPending={isPending}
                  getTipoLabel={getTipoLabel}
                />
              ))}
            </section>
          )}

          {pastReminders.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" />Pasados</h2>
              {pastReminders.map((recordatorio) => (
                <ReminderCard
                  key={recordatorio.id}
                  recordatorio={recordatorio}
                  onToggle={() => handleToggle(recordatorio)}
                  onDelete={() => setDeleteTarget(recordatorio)}
                  isPending={isPending}
                  getTipoLabel={getTipoLabel}
                  isPast
                />
              ))}
            </section>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar recordatorio</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de eliminar "{deleteTarget?.titulo}"? Esta acción no se puede deshacer.
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

interface ReminderCardProps {
  recordatorio: Recordatorio
  onToggle: () => void
  onDelete: () => void
  isPending: boolean
  getTipoLabel: (tipo: string) => string
  isPast?: boolean
}

function ReminderCard({ 
  recordatorio, 
  onToggle, 
  onDelete, 
  isPending,
  getTipoLabel,
  isPast 
}: ReminderCardProps) {

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'tarea': return 'border-accent-foreground/50'
      case 'clase': return 'border-primary/50'
      default: return 'border-warning/50'
    }
  }

  return (
    <div className={cn(
      "p-4 rounded-lg border flex items-start gap-4",
      isPast ? 'bg-muted/30 opacity-70' : 'bg-muted/50',
      getTipoColor(recordatorio.tipo)
    )}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-foreground truncate">
            {recordatorio.titulo}
          </p>
          <Switch
            checked={recordatorio.activo}
            onCheckedChange={onToggle}
            disabled={isPending}
          />
        </div>
        
        {recordatorio.descripcion && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {recordatorio.descripcion}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {formatDateTime(recordatorio.fecha_hora)}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive w-7 h-7"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
