import { getTareas, getMaterias } from '@/app/actions/data'
import { TasksContent } from '@/components/tasks/tasks-content'

export default async function TareasPage() {
  const [tareas, materias] = await Promise.all([
    getTareas(),
    getMaterias(),
  ])

  return <TasksContent tareas={tareas} materias={materias} />
}
