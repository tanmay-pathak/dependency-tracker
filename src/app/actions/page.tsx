import ActionsHomePage from './ActionsHomePage'
import { Suspense } from 'react'
import { CardListSkeleton } from '@/components/card-list-skeleton'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'

export async function ActionsComponent() {
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

  return <ActionsHomePage projects={uniqueProjects} />
}

export default function Actions() {
  return (
    <Suspense fallback={<CardListSkeleton />}>
      <ActionsComponent />
    </Suspense>
  )
}
