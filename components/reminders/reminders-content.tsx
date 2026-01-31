'use client'

import { useState, useTransition } from 'react'
import { Plus, Bell, BellOff, Trash2, Clock } from 'lucide-react'
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

  const upcomingReminders = recordatorios.filter(r => new Date(r.fecha_hora) >= now)
  const pastReminders = recordatorios.filter(r => new Date(r.fecha_hora) < now)

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

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'tarea': return 'bg-accent/20 text-accent'
      case 'clase': return 'bg-primary/20 text-primary'
      default: return 'bg-warning/20 text-warning'
    }
  }

  return (
    <main className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recordatorios</h1>
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
            <form action={handleAddReminder} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Titulo</Label>
                <Input 
                  id="titulo" 
                  name="titulo" 
                  placeholder="Ej: Estudiar para examen" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripcion (opcional)</Label>
                <Textarea 
                  id="descripcion" 
                  name="descripcion" 
                  placeholder="Detalles adicionales..." 
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_hora">Fecha y hora</Label>
                <Input 
                  id="fecha_hora" 
                  name="fecha_hora" 
                  type="datetime-local" 
                  required 
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select name="tipo" defaultValue="manual">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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

      {/* Upcoming Reminders */}
      <div className="space-y-3 mb-6">
        <h2 className="text-sm font-medium text-muted-foreground">Proximos</h2>
        
        {upcomingReminders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No tienes recordatorios proximos</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => setShowAddReminder(true)}
              >
                Crear un recordatorio
              </Button>
            </CardContent>
          </Card>
        ) : (
          upcomingReminders.map((recordatorio) => (
            <ReminderCard
              key={recordatorio.id}
              recordatorio={recordatorio}
              onToggle={() => handleToggle(recordatorio)}
              onDelete={() => setDeleteTarget(recordatorio)}
              isPending={isPending}
              getTipoLabel={getTipoLabel}
              getTipoColor={getTipoColor}
            />
          ))
        )}
      </div>

      {/* Past Reminders */}
      {pastReminders.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Pasados</h2>
          {pastReminders.map((recordatorio) => (
            <ReminderCard
              key={recordatorio.id}
              recordatorio={recordatorio}
              onToggle={() => handleToggle(recordatorio)}
              onDelete={() => setDeleteTarget(recordatorio)}
              isPending={isPending}
              getTipoLabel={getTipoLabel}
              getTipoColor={getTipoColor}
              isPast
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar recordatorio</AlertDialogTitle>
            <AlertDialogDescription>
              Estas seguro de eliminar "{deleteTarget?.titulo}"? Esta accion no se puede deshacer.
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
  getTipoColor: (tipo: string) => string
  isPast?: boolean
}

function ReminderCard({ 
  recordatorio, 
  onToggle, 
  onDelete, 
  isPending,
  getTipoLabel,
  getTipoColor,
  isPast 
}: ReminderCardProps) {
  return (
    <Card className={isPast ? 'opacity-60' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            recordatorio.activo ? 'bg-warning/20' : 'bg-muted'
          }`}>
            {recordatorio.activo ? (
              <Bell className="w-5 h-5 text-warning" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground truncate">
                {recordatorio.titulo}
              </p>
              <Badge className={`text-xs ${getTipoColor(recordatorio.tipo)}`}>
                {getTipoLabel(recordatorio.tipo)}
              </Badge>
            </div>
            
            {recordatorio.descripcion && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {recordatorio.descripcion}
              </p>
            )}
            
            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
              <Clock className="w-3 h-3" />
              {formatDateTime(recordatorio.fecha_hora)}
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Switch
              checked={recordatorio.activo}
              onCheckedChange={onToggle}
              disabled={isPending}
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
