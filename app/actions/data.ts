'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Materia, Horario, Tarea, Recordatorio, Profile } from '@/lib/types'

// Profile actions
export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return null
  return data as Profile
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const nombre = formData.get('nombre') as string
  const carrera = formData.get('carrera') as string
  const semestre = parseInt(formData.get('semestre') as string) || null

  const { error } = await supabase
    .from('profiles')
    .update({
      nombre,
      carrera,
      semestre,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/perfil')
  return { success: true }
}

export async function setPushSubscription(subscription: object | null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('profiles')
    .update({
      push_subscription: subscription,
      notificaciones_activas: !!subscription,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/perfil')
  return { success: true }
}

// Materias actions
export async function getMaterias() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('materias')
    .select('*')
    .eq('user_id', user.id)
    .order('nombre')

  if (error) return []
  return data as Materia[]
}

export async function createMateria(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const nombre = formData.get('nombre') as string
  const color = formData.get('color') as string || '#3B82F6'

  const { error } = await supabase
    .from('materias')
    .insert({
      user_id: user.id,
      nombre,
      color,
    })

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/horario')
  return { success: true }
}

export async function deleteMateria(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('materias')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/horario')
  return { success: true }
}

// Horarios actions
export async function getHorarios() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('horarios')
    .select('*, materia:materias(*)')
    .eq('user_id', user.id)
    .order('dia_semana')
    .order('hora_inicio')

  if (error) return []
  return data as Horario[]
}

export async function createHorario(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const materia_id = formData.get('materia_id') as string || null
  const dia_semana = parseInt(formData.get('dia_semana') as string)
  const hora_inicio = formData.get('hora_inicio') as string
  const hora_fin = formData.get('hora_fin') as string
  const aula = formData.get('aula') as string || null
  const docente = formData.get('docente') as string || null

  const { error } = await supabase
    .from('horarios')
    .insert({
      user_id: user.id,
      materia_id,
      dia_semana,
      hora_inicio,
      hora_fin,
      aula,
      docente,
    })

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/horario')
  return { success: true }
}

export async function deleteHorario(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('horarios')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/horario')
  return { success: true }
}

// Tareas actions
export async function getTareas() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('tareas')
    .select('*, materia:materias(*)')
    .eq('user_id', user.id)
    .order('fecha_entrega')
    .order('prioridad')

  if (error) return []
  return data as Tarea[]
}

export async function createTarea(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const materia_id = formData.get('materia_id') as string || null
  const descripcion = formData.get('descripcion') as string
  const fecha_entrega = formData.get('fecha_entrega') as string
  const prioridad = formData.get('prioridad') as 'baja' | 'media' | 'alta' || 'media'

  const { error } = await supabase
    .from('tareas')
    .insert({
      user_id: user.id,
      materia_id: materia_id || null,
      descripcion,
      fecha_entrega,
      prioridad,
    })

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/tareas')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateTarea(id: string, completada: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('tareas')
    .update({
      completada,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/tareas')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteTarea(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('tareas')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/tareas')
  revalidatePath('/dashboard')
  return { success: true }
}

// Recordatorios actions
export async function getRecordatorios() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('recordatorios')
    .select('*')
    .eq('user_id', user.id)
    .order('fecha_hora')

  if (error) return []
  return data as Recordatorio[]
}

export async function createRecordatorio(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const titulo = formData.get('titulo') as string
  const descripcion = formData.get('descripcion') as string || null
  const fecha_hora = formData.get('fecha_hora') as string
  const tipo = formData.get('tipo') as 'manual' | 'tarea' | 'clase' || 'manual'

  const { error } = await supabase
    .from('recordatorios')
    .insert({
      user_id: user.id,
      titulo,
      descripcion,
      fecha_hora,
      tipo,
    })

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/recordatorios')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function toggleRecordatorio(id: string, activo: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('recordatorios')
    .update({ activo })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/recordatorios')
  return { success: true }
}

export async function deleteRecordatorio(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('recordatorios')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/recordatorios')
  revalidatePath('/dashboard')
  return { success: true }
}

// Notificaciones actions
export async function getNotificaciones() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('notificaciones')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) return []
  return data
}

export async function markNotificacionAsRead(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('notificaciones')
    .update({ leida: true })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard')
  return { success: true }
}
