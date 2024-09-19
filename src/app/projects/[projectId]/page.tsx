import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import Link from 'next/link'
import { Dependency } from '@/app/versions/[search]/columns'

export default async function FullDependenciesPage({
  params: { projectId },
}: {
  params: { projectId: string }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data, error } = await supabase
    .from('versions')
    .select('*')
    .eq('id', projectId)

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const dependencies: Dependency[] = data || []

  return (
    <div className="container mx-auto p-6">
      <div className="prose max-w-none pb-2 text-center">
        <h2>{projectId}</h2>
        <Link href={`/projects/${projectId}/environment-versions`}>
          View Environments Side By Side
        </Link>
      </div>
      <DataTable columns={columns} data={dependencies} />
    </div>
  )
}
