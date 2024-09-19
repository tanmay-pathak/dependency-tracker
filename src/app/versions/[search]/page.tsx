import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { Dependency } from '@/app/versions/[search]/columns'

export default async function FullDependenciesPage({
  params: { search },
}: {
  params: { search: string }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data, error } = await supabase
    .from('versions')
    .select('*')
    .ilike('key', `%${search}%`)

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const dependencies: Dependency[] = data || []

  return (
    <div className="container mx-auto p-6">
      <DataTable
        columns={columns}
        data={dependencies}
        searchField="id"
        showChart={true}
      />
    </div>
  )
}
