import { getProfile } from '@/app/actions/data'
import { createClient } from '@/lib/supabase/server'
import { ProfileContent } from '@/components/profile/profile-content'
import { redirect } from 'next/navigation'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const profile = await getProfile()

  return <ProfileContent profile={profile} email={user.email || ''} />
}
