import { getRecordatorios } from '@/app/actions/data'
import { RemindersContent } from '@/components/reminders/reminders-content'

export default async function RecordatoriosPage() {
  const recordatorios = await getRecordatorios()

  return <RemindersContent recordatorios={recordatorios} />
}
