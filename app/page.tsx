'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, Calendar, CheckSquare, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SplashPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/dashboard')
      } else {
        setChecking(false)
      }
    })
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/25">
          <BookOpen className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground text-center mb-2">
          Unitask
        </h1>
        <p className="text-muted-foreground text-center max-w-xs mb-12">
          Tu asistente personal para organizar tu vida academica
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
          <FeatureCard
            icon={<Calendar className="w-5 h-5" />}
            title="Horarios"
            description="Organiza tus clases"
          />
          <FeatureCard
            icon={<CheckSquare className="w-5 h-5" />}
            title="Tareas"
            description="Nunca olvides entregas"
          />
          <FeatureCard
            icon={<Bell className="w-5 h-5" />}
            title="Recordatorios"
            description="Alertas personalizadas"
          />
          <FeatureCard
            icon={<BookOpen className="w-5 h-5" />}
            title="Materias"
            description="Todo en un lugar"
          />
        </div>

        {/* CTA Buttons */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full h-12 text-base font-semibold"
            onClick={() => router.push('/auth/login')}
          >
            Iniciar Sesion
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full h-12 text-base font-semibold bg-transparent"
            onClick={() => router.push('/auth/register')}
          >
            Crear Cuenta
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-sm text-muted-foreground">
          Hecho para estudiantes
        </p>
      </footer>
    </main>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center text-center">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
