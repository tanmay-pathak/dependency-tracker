import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'

async function fetchTechInfo(technology: string) {
  const response = await fetch(`https://endoflife.date/api/${technology}.json`)
  if (!response.ok) {
    console.error(`Failed to fetch tech info for ${technology}`, response)
    return null
  }
  return response.json()
}

export default async function FullDependenciesPage({
  params: { search },
  searchParams,
}: {
  params: { search: string }
  searchParams: { technology?: string }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const [{ data: dependencies, error }, techInfo] = await Promise.all([
    supabase.from('dependency').select('*').ilike('key', `%${search}%`),
    searchParams.technology ? fetchTechInfo(searchParams.technology) : null,
  ])

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="container prose prose-lg mx-auto p-6 dark:prose-invert">
      {techInfo && (
        <div className="group mb-6">
          <h2 className="cursor-pointer">
            {searchParams.technology} Information
          </h2>
          <pre className="hidden group-hover:block">
            {JSON.stringify(techInfo, null, 2)}
          </pre>
        </div>
      )}
      <DataTable columns={columns} data={dependencies || []} />
    </div>
  )
}
