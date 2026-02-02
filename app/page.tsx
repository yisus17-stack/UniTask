'use client'

import React from "react"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, Calendar, CheckSquare, Bell, ArrowRight } from 'lucide-react'
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
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <p className="text-muted-foreground font-medium">Cargando Unitask...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative w-full flex-1 flex flex-col items-center justify-center text-center px-4 py-24 md:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50 to-indigo-100 z-0"></div>
        <div className="max-w-4xl mx-auto z-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/50 backdrop-blur-sm border border-black/5 flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            Tu centro de mando para el éxito académico.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Unitask es tu asistente todo en uno para la universidad. Gestiona horarios, tareas y recordatorios sin esfuerzo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="h-12 text-base font-semibold"
              onClick={() => router.push('/auth/register')}
            >
              Empezar Gratis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 text-base font-medium bg-white/50 hover:bg-white"
              onClick={() => router.push('/auth/login')}
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background w-full py-24">
        <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Todo lo que necesitas para triunfar</h2>
              <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">Centraliza tu vida académica en un solo lugar y mantén el control total sobre tus responsabilidades.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                  icon={<Calendar className="w-6 h-6" />}
                  title="Horarios Inteligentes"
                  description="Visualiza tu semana de clases de forma clara y organizada."
              />
              <FeatureCard
                  icon={<CheckSquare className="w-6 h-6" />}
                  title="Gestión de Tareas"
                  description="Lleva un registro de todas tus tareas y fechas de entrega."
              />
              <FeatureCard
                  icon={<Bell className="w-6 h-6" />}
                  title="Recordatorios"
                  description="Crea alertas personalizadas para no olvidar nada importante."
              />
              <FeatureCard
                  icon={<BookOpen className="w-6 h-6" />}
                  title="Materias Centralizadas"
                  description="Toda la información de tus materias en un solo lugar."
              />
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t">
        <p className="text-sm text-muted-foreground">
          Hecho con ❤️ para estudiantes, por estudiantes.
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
    <div className="bg-card border rounded-2xl p-6 flex flex-col text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-5">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
