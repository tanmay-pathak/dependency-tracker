import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'

export default async function FullDependenciesPage({
  params: { search },
}: {
  params: { search: string }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data: dependencies, error } = await supabase
    .from('versions')
    .select('*')
    .ilike('key', `%${search}%`)

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="container prose prose-lg mx-auto p-6">
      <DataTable
        columns={columns}
        data={dependencies || []}
        searchField="id"
        showChart={true}
      />
    </div>
  )
}
