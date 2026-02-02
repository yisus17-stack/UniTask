'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, CheckSquare, Bell, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Inicio' },
  { href: '/dashboard/horario', icon: Calendar, label: 'Horario' },
  { href: '/dashboard/tareas', icon: CheckSquare, label: 'Tareas' },
  { href: '/dashboard/recordatorios', icon: Bell, label: 'Alertas' },
  { href: '/dashboard/perfil', icon: User, label: 'Perfil' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t border-border">
      <div className="max-w-lg mx-auto px-2">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-colors min-w-[64px]',
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className={cn('w-6 h-6', isActive && 'stroke-[2.5px]')} />
                <span className={cn(
                  "text-xs font-medium",
                  isActive && "font-bold"
                )}>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-background/80" />
    </nav>
  )
}
