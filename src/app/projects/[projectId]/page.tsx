import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'

export default async function Page({
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
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={dependencies || []} />
    </div>
  )
}
