'use client'

import Link from 'next/link'
import { Calendar, CheckSquare, Bell, Clock, BookOpen, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Horario, Tarea, Recordatorio } from '@/lib/types'
import { DIAS_SEMANA } from '@/lib/types'
import { formatDistanceToNow } from '@/lib/date-utils'

interface DashboardContentProps {
  userName: string
  clasesHoy: Horario[]
  tareasPendientes: Tarea[]
  recordatoriosProximos: Recordatorio[]
  totalTareasPendientes: number
  totalRecordatoriosActivos: number
}

export function DashboardContent({
  userName,
  clasesHoy,
  tareasPendientes,
  recordatoriosProximos,
  totalTareasPendientes,
  totalRecordatoriosActivos,
}: DashboardContentProps) {
  const today = new Date()
  const dayName = DIAS_SEMANA[today.getDay()]

  return (
    <main className="px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <p className="text-muted-foreground text-sm">{dayName}, {today.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Hola, {userName.split(' ')[0]}
        </h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Link href="/dashboard/horario" className="text-center p-3 rounded-lg hover:bg-muted">
          <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{clasesHoy.length}</p>
          <p className="text-xs text-muted-foreground">Clases hoy</p>
        </Link>
        
        <Link href="/dashboard/tareas" className="text-center p-3 rounded-lg hover:bg-muted">
           <CheckSquare className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{totalTareasPendientes}</p>
          <p className="text-xs text-muted-foreground">Pendientes</p>
        </Link>
        
        <Link href="/dashboard/recordatorios" className="text-center p-3 rounded-lg hover:bg-muted">
          <Bell className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{totalRecordatoriosActivos}</p>
          <p className="text-xs text-muted-foreground">Alertas</p>
        </Link>
      </div>

      {/* Today's Classes */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Clases de hoy
          </h2>
          <Link href="/dashboard/horario">
            <Button variant="ghost" size="sm" className="text-primary h-8 px-2">
              Ver todo
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        {clasesHoy.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-lg bg-muted/50">
            <p className="text-muted-foreground text-sm">
              No tienes clases programadas para hoy. ¡Disfruta tu día libre!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {clasesHoy.slice(0, 3).map((clase) => (
              <div
                key={clase.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
              >
                <div
                  className="w-1.5 h-10 rounded-full"
                  style={{ backgroundColor: clase.materia?.color || '#A78BFA' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {clase.materia?.nombre || 'Clase'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {clase.hora_inicio.slice(0, 5)} - {clase.hora_fin.slice(0, 5)}
                    {clase.aula && ` • ${clase.aula}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pending Tasks */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-muted-foreground" />
            Próximas entregas
          </h2>
          <Link href="/dashboard/tareas">
            <Button variant="ghost" size="sm" className="text-primary h-8 px-2">
              Ver todo
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        {tareasPendientes.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-lg bg-muted/50">
            <p className="text-muted-foreground text-sm">
              No tienes tareas pendientes esta semana. ¡Buen trabajo!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tareasPendientes.map((tarea) => (
              <div
                key={tarea.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
              >
                <div
                  className="w-1.5 h-full min-h-[36px] rounded-full mt-1"
                  style={{ backgroundColor: tarea.materia?.color || '#A78BFA' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-base line-clamp-2">
                    {tarea.descripcion}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <Badge variant={
                      tarea.prioridad === 'alta' ? 'destructive' :
                      tarea.prioridad === 'media' ? 'default' : 'secondary'
                    } className="text-xs capitalize">
                      {tarea.prioridad}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(tarea.fecha_entrega))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Reminders */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5 text-muted-foreground" />
            Recordatorios próximos
          </h2>
          <Link href="/dashboard/recordatorios">
            <Button variant="ghost" size="sm" className="text-primary h-8 px-2">
              Ver todo
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        {recordatoriosProximos.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-lg bg-muted/50">
            <p className="text-muted-foreground text-sm">
              No tienes recordatorios para las próximas 24 horas.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recordatoriosProximos.map((recordatorio) => (
              <div
                key={recordatorio.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {recordatorio.titulo}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(recordatorio.fecha_hora).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
