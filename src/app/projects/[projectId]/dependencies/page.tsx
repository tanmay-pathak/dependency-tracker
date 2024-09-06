import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { DataTable } from '@/components/ui/data-table'
import { columns } from '../columns'

export default async function FullDependenciesPage({
  params: { projectId },
}: {
  params: { projectId: string }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data: dependencies, error } = await supabase
    .from('dependency')
    .select('*')
    .eq('project', projectId)

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-4 text-2xl font-bold">Full Project Dependencies</h1>
      <DataTable columns={columns} data={dependencies || []} />
    </div>
  )
}
