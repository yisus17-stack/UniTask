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
    <main className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">{dayName}, {today.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
        <h1 className="text-2xl font-bold text-foreground">
          Hola, {userName.split(' ')[0]}
        </h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Link href="/dashboard/horario">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{clasesHoy.length}</p>
              <p className="text-xs text-muted-foreground">Clases hoy</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/dashboard/tareas">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mb-2">
                <CheckSquare className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">{totalTareasPendientes}</p>
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/dashboard/recordatorios">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center mb-2">
                <Bell className="w-5 h-5 text-warning" />
              </div>
              <p className="text-2xl font-bold text-foreground">{totalRecordatoriosActivos}</p>
              <p className="text-xs text-muted-foreground">Alertas</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Today's Classes */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Clases de hoy
            </CardTitle>
            <Link href="/dashboard/horario">
              <Button variant="ghost" size="sm" className="text-primary h-8 px-2">
                Ver todo
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {clasesHoy.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">
              No tienes clases programadas para hoy
            </p>
          ) : (
            <div className="space-y-3">
              {clasesHoy.slice(0, 3).map((clase) => (
                <div
                  key={clase.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div
                    className="w-1 h-12 rounded-full"
                    style={{ backgroundColor: clase.materia?.color || '#3B82F6' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
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
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-accent" />
              Proximas entregas
            </CardTitle>
            <Link href="/dashboard/tareas">
              <Button variant="ghost" size="sm" className="text-primary h-8 px-2">
                Ver todo
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {tareasPendientes.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">
              No tienes tareas pendientes esta semana
            </p>
          ) : (
            <div className="space-y-3">
              {tareasPendientes.map((tarea) => (
                <div
                  key={tarea.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div
                    className="w-1 h-full min-h-[40px] rounded-full"
                    style={{ backgroundColor: tarea.materia?.color || '#3B82F6' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm line-clamp-2">
                      {tarea.descripcion}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={
                        tarea.prioridad === 'alta' ? 'destructive' :
                        tarea.prioridad === 'media' ? 'default' : 'secondary'
                      } className="text-xs">
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
        </CardContent>
      </Card>

      {/* Upcoming Reminders */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-warning" />
              Recordatorios proximos
            </CardTitle>
            <Link href="/dashboard/recordatorios">
              <Button variant="ghost" size="sm" className="text-primary h-8 px-2">
                Ver todo
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {recordatoriosProximos.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">
              No tienes recordatorios para las proximas 24 horas
            </p>
          ) : (
            <div className="space-y-3">
              {recordatoriosProximos.map((recordatorio) => (
                <div
                  key={recordatorio.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {recordatorio.titulo}
                    </p>
                    <p className="text-xs text-muted-foreground">
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
        </CardContent>
      </Card>
    </main>
  )
}
