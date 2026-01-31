'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, GraduationCap, BookOpen, Bell, LogOut, Save, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { updateProfile } from '@/app/actions/data'
import { signOut } from '@/app/actions/auth'
import { toast } from 'sonner'

interface ProfileContentProps {
  profile: Profile | null
  email: string
}

export function ProfileContent({ profile, email }: ProfileContentProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: profile?.nombre || '',
    carrera: profile?.carrera || '',
    semestre: profile?.semestre?.toString() || '',
    notificaciones_activas: profile?.notificaciones_activas ?? true,
  })

  const handleSave = async () => {
    setLoading(true)
    
    const data = new FormData()
    data.set('nombre', formData.nombre)
    data.set('carrera', formData.carrera)
    data.set('semestre', formData.semestre)
    data.set('notificaciones_activas', formData.notificaciones_activas.toString())

    const result = await updateProfile(data)
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Perfil actualizado')
    }
  }

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <main className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
        <p className="text-muted-foreground text-sm">Configura tu cuenta</p>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-3">
          <User className="w-10 h-10 text-primary" />
        </div>
        <p className="font-semibold text-foreground">{formData.nombre || 'Estudiante'}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>

      {/* Profile Form */}
      <Card className="mb-4">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Informacion Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Tu nombre"
              className="h-11"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Correo electronico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                value={email}
                disabled
                className="h-11 pl-10 bg-muted"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Info */}
      <Card className="mb-4">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            Informacion Academica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="carrera">Carrera</Label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="carrera"
                value={formData.carrera}
                onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                placeholder="Ingenieria en Sistemas"
                className="h-11 pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="semestre">Semestre</Label>
            <Select
              value={formData.semestre}
              onValueChange={(value) => setFormData({ ...formData, semestre: value })}
            >
              <SelectTrigger className="h-11">
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
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Activar notificaciones</p>
              <p className="text-sm text-muted-foreground">Recibe alertas de tareas y recordatorios</p>
            </div>
            <Switch
              checked={formData.notificaciones_activas}
              onCheckedChange={(checked) => setFormData({ ...formData, notificaciones_activas: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button 
          onClick={handleSave} 
          className="w-full h-12"
          disabled={loading}
        >
          {loading ? (
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
          className="w-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesion
        </Button>
      </div>

      {/* Logout Confirmation */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cerrar sesion</AlertDialogTitle>
            <AlertDialogDescription>
              Estas seguro de que quieres cerrar tu sesion?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cerrar Sesion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
