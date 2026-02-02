import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/diseño/logo';

export default function PaginaIngreso() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <Logo />
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tu correo para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" placeholder="nombre@ejemplo.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" required />
          </div>
          <Button asChild className="w-full">
            <Link href="/tablero/horario">Iniciar sesión</Link>
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p className="w-full">
            ¿No tienes una cuenta?{' '}
            <Link href="/registro" className="font-semibold text-primary underline-offset-4 hover:underline">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
