import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import ProjectList from './ProjectList'

export default async function Projects() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data: dependencies, error } = await supabase
    .from('versions')
    .select('id', { count: 'exact' })

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>
  }

  // Remove duplicates
  const uniqueProjects = Array.from(new Set(dependencies?.map((dep) => dep.id)))

  return (
    <div className="container mx-auto p-4">
      <ProjectList projects={uniqueProjects} />
    </div>
  )
}
