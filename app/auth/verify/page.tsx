import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function VerifyPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background px-6 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-foreground">Verificar Correo</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Mail className="w-10 h-10 text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Revisa tu correo
        </h2>
        
        <p className="text-muted-foreground mb-8">
          Te hemos enviado un enlace de verificacion. Por favor revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
        </p>

        <div className="space-y-3 w-full">
          <Link href="/auth/login" className="block">
            <Button variant="outline" className="w-full h-12 bg-transparent">
              Volver a Iniciar Sesion
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          No recibiste el correo? Revisa tu carpeta de spam o intenta registrarte de nuevo.
        </p>
      </div>
    </main>
  )
}
