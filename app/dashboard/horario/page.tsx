import { getHorarios, getMaterias } from '@/app/actions/data'
import { ScheduleContent } from '@/components/schedule/schedule-content'

export default async function HorarioPage() {
  const [horarios, materias] = await Promise.all([
    getHorarios(),
    getMaterias(),
  ])

  return <ScheduleContent horarios={horarios} materias={materias} />
}
