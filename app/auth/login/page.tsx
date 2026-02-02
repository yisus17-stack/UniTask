'use client'

import React from "react"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, ArrowLeft, Loader2, Mail, KeyRound } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message === 'Invalid login credentials' 
        ? 'Credenciales inválidas' 
        : error.message)
      setLoading(false)
      return
    }

    toast.success('Bienvenido de vuelta')
    router.replace('/dashboard')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background p-4 antialiased">
      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Iniciar Sesión</h1>
          <p className="text-muted-foreground mt-2">Ingresa a tu cuenta de Unitask</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-12 pl-12 text-base bg-muted/50"
            />
          </div>

          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="h-12 pl-12 text-base bg-muted/50"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base font-semibold mt-4"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-8">
          ¿No tienes cuenta?{' '}
          <Link href="/auth/register" className="text-primary font-semibold hover:underline underline-offset-4">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  )
}
