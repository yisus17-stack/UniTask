'use client'

import React from "react"
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, Calendar, CheckSquare, Bell, ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PlaceHolderImages } from '@/lib/placeholder-images'

export default function SplashPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-dashboard');

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
    <main className="min-h-screen flex flex-col bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="w-full flex-1 flex items-center">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center px-6 py-16 md:py-24">
          {/* Left Column: Text Content */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left animate-in fade-in slide-in-from-bottom-12 duration-500">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-2xl shadow-primary/20">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              Organiza tu éxito académico con Unitask
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mb-8">
              Tu asistente personal para dominar horarios, tareas y recordatorios. Simplifica tu vida estudiantil y alcanza tus metas.
            </p>
            <div className="w-full max-w-sm md:max-w-none flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 text-base font-semibold"
                onClick={() => router.push('/auth/register')}
              >
                Empezar Gratis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto h-12 text-base font-medium"
                onClick={() => router.push('/auth/login')}
              >
                Iniciar Sesión
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-6 text-sm text-muted-foreground">
              <div className="flex">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <span>Amado por miles de estudiantes.</span>
            </div>
          </div>
          {/* Right Column: Image */}
          <div className="relative animate-in fade-in slide-in-from-bottom-12 duration-500 delay-100 hidden md:block">
            <div className="bg-muted/50 p-3 rounded-2xl shadow-2xl shadow-primary/10 ring-1 ring-border/20">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={1200}
                  height={900}
                  className="rounded-lg shadow-md"
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </section>

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
    <div className="bg-card border border-border/50 rounded-xl p-6 flex flex-col text-left hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
