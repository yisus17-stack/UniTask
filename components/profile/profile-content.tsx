'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, GraduationCap, BookOpen, Bell, LogOut, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import type { Profile } from '@/lib/types'
import { updateProfile, setPushSubscription } from '@/app/actions/data'
import { signOut } from '@/app/actions/auth'
import { toast } from 'sonner'
import { urlBase64ToUint8Array } from '@/lib/utils'

interface ProfileContentProps {
  profile: Profile | null
  email: string
}

export function ProfileContent({ profile, email }: ProfileContentProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  
  const [formData, setFormData] = useState({
    nombre: profile?.nombre || '',
    carrera: profile?.carrera || '',
    semestre: profile?.semestre?.toString() || '',
  })

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(profile?.notificaciones_activas || false)
  const [isNotificationSwitchPending, startNotificationTransition] = useTransition()
  const [isPwaCapable, setIsPwaCapable] = useState(false)

  useEffect(() => {
    setIsPwaCapable('serviceWorker' in navigator && 'PushManager' in window)
    if (Notification.permission === 'granted') {
      setIsNotificationsEnabled(profile?.notificaciones_activas || false)
    } else {
      setIsNotificationsEnabled(false)
    }
  }, [profile?.notificaciones_activas])

  const handleSave = async () => {
    setIsSaving(true)
    const data = new FormData()
    data.set('nombre', formData.nombre)
    data.set('carrera', formData.carrera)
    data.set('semestre', formData.semestre)

    const result = await updateProfile(data)
    setIsSaving(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Perfil actualizado')
    }
  }

  const handleNotificationToggle = async (checked: boolean) => {
    startNotificationTransition(async () => {
      if (Notification.permission === 'denied') {
        toast.error('Las notificaciones están bloqueadas. Habilítalas en la configuración de tu navegador.');
        return;
      }
      
      if (checked) {
        // SUBSCRIBE
        try {
          const swRegistration = await navigator.serviceWorker.ready;
          const subscription = await swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
          });
          
          const result = await setPushSubscription(subscription);
          if (result.error) throw new Error(result.error);
          
          toast.success('Notificaciones activadas');
          setIsNotificationsEnabled(true)
        } catch (error) {
          console.error(error);
          toast.error('No se pudieron activar las notificaciones.', {
            description: (error as Error).message,
          });
        }
      } else {
        // UNSUBSCRIBE
        try {
          const swRegistration = await navigator.serviceWorker.ready;
          const subscription = await swRegistration.pushManager.getSubscription();
          if (subscription) {
            await subscription.unsubscribe();
          }
          const result = await setPushSubscription(null);
          if (result.error) throw new Error(result.error);

          toast.success('Notificaciones desactivadas');
          setIsNotificationsEnabled(false)
        } catch (error) {
          console.error(error);
          toast.error('No se pudieron desactivar las notificaciones.', {
            description: (error as Error).message,
          });
        }
      }
    });
  };

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <main className="px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Perfil</h1>
        <p className="text-muted-foreground">Gestiona la información de tu cuenta.</p>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-10 h-10 text-primary" />
        </div>
        <div>
          <p className="text-xl font-semibold text-foreground">{formData.nombre || 'Estudiante'}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Profile Form */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><User className="w-5 h-5" /> Información Personal</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Tu nombre"
                className="h-11 bg-muted/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="h-11 pl-10 bg-muted/30"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Academic Info */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Información Académica</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="carrera">Carrera</Label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="carrera"
                  value={formData.carrera}
                  onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                  placeholder="Ingeniería en Sistemas"
                  className="h-11 pl-10 bg-muted/50"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="semestre">Semestre</Label>
              <Select
                value={formData.semestre}
                onValueChange={(value) => setFormData({ ...formData, semestre: value })}
              >
                <SelectTrigger className="h-11 bg-muted/50">
                  <SelectValue placeholder="Selecciona tu semestre" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      {sem}° Semestre
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Bell className="w-5 h-5" /> Notificaciones</h2>
          <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Activar notificaciones push</p>
              <p className="text-sm text-muted-foreground">Recibe alertas de tareas y recordatorios</p>
            </div>
            <Switch
              checked={isNotificationsEnabled}
              onCheckedChange={handleNotificationToggle}
              disabled={isNotificationSwitchPending || !isPwaCapable}
            />
          </div>
           {!isPwaCapable && <p className="text-xs text-muted-foreground mt-2">Tu navegador no es compatible con notificaciones push o la app no se está ejecutando en modo seguro (HTTPS).</p>}
        </section>
      </div>

      {/* Actions */}
      <div className="space-y-3 mt-10">
        <Button 
          onClick={handleSave} 
          className="w-full h-12"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>

      {/* Logout Confirmation */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cerrar sesión</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres cerrar tu sesión?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cerrar Sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
