import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import ProjectList from './ProjectList'
import { Suspense } from 'react'
import { CardListSkeleton } from '@/components/card-list-skeleton'

export async function ProjectsComponent() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data: dependencies, error } = await supabase
    .from('versions')
    .select('id', { count: 'exact' })

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>
  }

  // Remove duplicates and sort alphabetically
  const uniqueProjects = Array.from(
    new Set(dependencies?.map((dep) => dep.id)),
  ).sort((a, b) => a.localeCompare(b))

  return (
    <div className="container mx-auto p-4">
      <ProjectList projects={uniqueProjects} />
    </div>
  )
}

export default function Projects() {
  return (
    <Suspense fallback={<CardListSkeleton />}>
      <ProjectsComponent />
    </Suspense>
  )
}
