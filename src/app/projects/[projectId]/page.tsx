import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
    <div className="container mx-auto p-2">
      <div className="max-h-[500px]">
        <DataTable columns={columns} data={dependencies || []} />
      </div>
      <div className="my-2 flex justify-center">
        <Link href={`/projects/${projectId}/dependencies`}>
          <Button>View Full Table</Button>
        </Link>
      </div>
    </div>
  )
}
