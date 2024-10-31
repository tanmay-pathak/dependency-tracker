import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import ProjectList from './ProjectList'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

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

function ProjectListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <Skeleton key={i} className="h-[125px] w-full rounded-xl" />
      ))}
    </div>
  )
}

export default function Projects() {
  return (
    <Suspense fallback={<ProjectListSkeleton />}>
      <ProjectsComponent />
    </Suspense>
  )
}
