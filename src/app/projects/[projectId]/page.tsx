import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'

export default async function FullDependenciesPage({
  params: { projectId },
}: {
  params: { projectId: string }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data: dependencies, error } = await supabase
    .from('versions')
    .select('*')
    .eq('id', projectId)

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="prose max-w-none pb-2 text-center">
        <h2 className="text-white">{projectId}</h2>
      </div>
      <DataTable columns={columns} data={dependencies || []} />
    </div>
  )
}
