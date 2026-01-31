import { createClient } from '@/lib/supabase/server'
import { getTareas, getHorarios, getRecordatorios, getProfile } from '@/app/actions/data'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const [profile, tareas, horarios, recordatorios] = await Promise.all([
    getProfile(),
    getTareas(),
    getHorarios(),
    getRecordatorios(),
  ])

  const now = new Date()
  const today = now.getDay()
  
  // Get today's classes
  const clasesHoy = horarios.filter(h => h.dia_semana === today)
    .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
  
  // Get pending tasks (not completed, due within 7 days)
  const tareasPendientes = tareas
    .filter(t => !t.completada)
    .filter(t => {
      const dueDate = new Date(t.fecha_entrega)
      const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 7 && diffDays >= 0
    })
    .slice(0, 5)
  
  // Get upcoming reminders (next 24 hours)
  const recordatoriosProximos = recordatorios
    .filter(r => r.activo)
    .filter(r => {
      const reminderDate = new Date(r.fecha_hora)
      const diffHours = (reminderDate.getTime() - now.getTime()) / (1000 * 60 * 60)
      return diffHours >= 0 && diffHours <= 24
    })
    .slice(0, 3)

  return (
    <DashboardContent
      userName={profile?.nombre || user?.email?.split('@')[0] || 'Estudiante'}
      clasesHoy={clasesHoy}
      tareasPendientes={tareasPendientes}
      recordatoriosProximos={recordatoriosProximos}
      totalTareasPendientes={tareas.filter(t => !t.completada).length}
      totalRecordatoriosActivos={recordatorios.filter(r => r.activo).length}
    />
  )
}
