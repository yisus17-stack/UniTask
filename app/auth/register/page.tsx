'use client'

import React from "react"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookOpen, ArrowLeft, Loader2, User, Mail, KeyRound, GraduationCap, Calendar } from 'lucide-react'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    carrera: '',
    semestre: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/dashboard`,
        data: {
          nombre: formData.nombre,
          carrera: formData.carrera,
          semestre: formData.semestre ? parseInt(formData.semestre) : null,
        },
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    router.replace('/auth/verify')
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
          <h1 className="text-3xl font-bold text-foreground">Crear Cuenta</h1>
          <p className="text-muted-foreground mt-2">Empieza a organizar tu vida académica</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="nombre"
              type="text"
              placeholder="Nombre completo"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              className="h-12 pl-12 text-base bg-muted/50"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              placeholder="Contraseña (mín. 6 caracteres)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              autoComplete="new-password"
              className="h-12 pl-12 text-base bg-muted/50"
            />
          </div>

          <div className="relative">
            <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="carrera"
              type="text"
              placeholder="Carrera (opcional)"
              value={formData.carrera}
              onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
              className="h-12 pl-12 text-base bg-muted/50"
            />
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Select
              value={formData.semestre}
              onValueChange={(value) => setFormData({ ...formData, semestre: value })}
            >
              <SelectTrigger className="h-12 text-base pl-12 bg-muted/50">
                <SelectValue placeholder="Semestre (opcional)" />
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

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base font-semibold mt-4"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-primary font-semibold hover:underline underline-offset-4">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  )
}
