import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function PaginaPerfil() {
  const avatarImage = PlaceHolderImages.find(img => img.id === 'user-avatar');

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Administra tu información personal y de contacto.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              {avatarImage && <AvatarImage src={avatarImage.imageUrl} data-ai-hint={avatarImage.imageHint} />}
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <Button variant="outline">Cambiar foto</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" defaultValue="Ana Ureña" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" defaultValue="ana.urena@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="course">Curso o carrera</Label>
            <Input id="course" defaultValue="Ingeniería de Software" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Guardar Cambios</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Cambiar Contraseña</CardTitle>
          <CardDescription>Para mayor seguridad, te recomendamos usar una contraseña única.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Contraseña actual</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva contraseña</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </CardContent>
         <CardFooter>
          <Button>Actualizar Contraseña</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>Gestiona cómo recibes las notificaciones.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="push-notifications" className="text-base">Notificaciones Push</Label>
                    <p className="text-sm text-muted-foreground">Recibe alertas en tu dispositivo.</p>
                </div>
                <Switch id="push-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="task-reminders" className="text-base">Recordatorios de Tareas</Label>
                    <p className="text-sm text-muted-foreground">Avisos para las fechas de entrega.</p>
                </div>
                <Switch id="task-reminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="class-alerts" className="text-base">Alertas de Clases</Label>
                    <p className="text-sm text-muted-foreground">Avisos 15 minutos antes de cada clase.</p>
                </div>
                <Switch id="class-alerts" />
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
