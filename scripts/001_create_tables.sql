-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT,
  correo TEXT,
  carrera TEXT,
  semestre INTEGER,
  notificaciones_activas BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Materias table
CREATE TABLE IF NOT EXISTS public.materias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.materias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "materias_select_own" ON public.materias FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "materias_insert_own" ON public.materias FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "materias_update_own" ON public.materias FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "materias_delete_own" ON public.materias FOR DELETE USING (auth.uid() = user_id);

-- Horarios table (schedule/classes)
CREATE TABLE IF NOT EXISTS public.horarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  materia_id UUID REFERENCES public.materias(id) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6), -- 0=Domingo, 1=Lunes, etc.
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  aula TEXT,
  docente TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.horarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "horarios_select_own" ON public.horarios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "horarios_insert_own" ON public.horarios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "horarios_update_own" ON public.horarios FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "horarios_delete_own" ON public.horarios FOR DELETE USING (auth.uid() = user_id);

-- Tareas table (tasks)
CREATE TABLE IF NOT EXISTS public.tareas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  materia_id UUID REFERENCES public.materias(id) ON DELETE SET NULL,
  descripcion TEXT NOT NULL,
  fecha_entrega DATE NOT NULL,
  prioridad TEXT DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta')),
  completada BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tareas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tareas_select_own" ON public.tareas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tareas_insert_own" ON public.tareas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tareas_update_own" ON public.tareas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "tareas_delete_own" ON public.tareas FOR DELETE USING (auth.uid() = user_id);

-- Recordatorios table (reminders)
CREATE TABLE IF NOT EXISTS public.recordatorios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha_hora TIMESTAMPTZ NOT NULL,
  tipo TEXT DEFAULT 'manual' CHECK (tipo IN ('manual', 'tarea', 'clase')),
  activo BOOLEAN DEFAULT true,
  tarea_id UUID REFERENCES public.tareas(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.recordatorios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recordatorios_select_own" ON public.recordatorios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "recordatorios_insert_own" ON public.recordatorios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "recordatorios_update_own" ON public.recordatorios FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "recordatorios_delete_own" ON public.recordatorios FOR DELETE USING (auth.uid() = user_id);

-- Notificaciones table (notifications history)
CREATE TABLE IF NOT EXISTS public.notificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  leida BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notificaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notificaciones_select_own" ON public.notificaciones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notificaciones_insert_own" ON public.notificaciones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notificaciones_update_own" ON public.notificaciones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notificaciones_delete_own" ON public.notificaciones FOR DELETE USING (auth.uid() = user_id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, correo, carrera, semestre)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'nombre', NULL),
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'carrera', NULL),
    COALESCE((new.raw_user_meta_data ->> 'semestre')::INTEGER, NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
