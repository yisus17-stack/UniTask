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
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
        <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center mb-6 shadow-2xl shadow-primary/20">
          <BookOpen className="w-12 h-12 text-primary-foreground" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Bienvenido a Unitask
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mb-10">
          Tu asistente académico personal para organizar clases, tareas y recordatorios, todo en un solo lugar.
        </p>

        {/* CTA Buttons */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full h-12 text-base font-semibold"
            onClick={() => router.push('/auth/register')}
          >
            Empezar Ahora
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full h-12 text-base font-medium"
            onClick={() => router.push('/auth/login')}
          >
            Ya tengo una cuenta
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-muted w-full py-16">
        <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-10">Todo lo que necesitas para triunfar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
                icon={<Calendar className="w-7 h-7" />}
                title="Horarios Inteligentes"
                description="Visualiza tu semana de clases de forma clara y organizada."
            />
            <FeatureCard
                icon={<CheckSquare className="w-7 h-7" />}
                title="Gestión de Tareas"
                description="Lleva un registro de todas tus tareas y fechas de entrega."
            />
            <FeatureCard
                icon={<Bell className="w-7 h-7" />}
                title="Recordatorios"
                description="Crea alertas personalizadas para no olvidar nada importante."
            />
            <FeatureCard
                icon={<BookOpen className="w-7 h-7" />}
                title="Materias Centralizadas"
                description="Toda la información de tus materias en un solo lugar."
            />
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Hecho con ❤️ para estudiantes por estudiantes
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
    <div className="bg-card border border-border/50 rounded-xl p-6 flex flex-col text-left hover:shadow-lg transition-shadow hover:-translate-y-1">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
