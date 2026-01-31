export interface Profile {
  id: string
  nombre: string | null
  correo: string | null
  carrera: string | null
  semestre: number | null
  notificaciones_activas: boolean
  created_at: string
  updated_at: string
}

export interface Materia {
  id: string
  user_id: string
  nombre: string
  color: string
  created_at: string
}

export interface Horario {
  id: string
  user_id: string
  materia_id: string | null
  dia_semana: number
  hora_inicio: string
  hora_fin: string
  aula: string | null
  docente: string | null
  created_at: string
  materia?: Materia | null
}

export interface Tarea {
  id: string
  user_id: string
  materia_id: string | null
  descripcion: string
  fecha_entrega: string
  prioridad: 'baja' | 'media' | 'alta'
  completada: boolean
  created_at: string
  updated_at: string
  materia?: Materia | null
}

export interface Recordatorio {
  id: string
  user_id: string
  titulo: string
  descripcion: string | null
  fecha_hora: string
  tipo: 'manual' | 'tarea' | 'clase'
  activo: boolean
  tarea_id: string | null
  created_at: string
}

export interface Notificacion {
  id: string
  user_id: string
  titulo: string
  mensaje: string
  leida: boolean
  created_at: string
}

export const DIAS_SEMANA = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
] as const

export const DIAS_SEMANA_CORTO = [
  'Dom',
  'Lun',
  'Mar',
  'Mié',
  'Jue',
  'Vie',
  'Sáb'
] as const

export const COLORES_MATERIA = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16', // lime
] as const
