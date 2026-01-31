export function formatDistanceToNow(date: Date): string {
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return 'Vencido'
  }
  if (diffDays === 0) {
    return 'Hoy'
  }
  if (diffDays === 1) {
    return 'Manana'
  }
  if (diffDays <= 7) {
    return `En ${diffDays} dias`
  }
  
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

export function formatTime(time: string): string {
  return time.slice(0, 5)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function formatDateTime(dateTime: string): string {
  const d = new Date(dateTime)
  return d.toLocaleString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
