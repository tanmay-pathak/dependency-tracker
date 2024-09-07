import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Project Dependencies</CardTitle>
          <Link href={`/projects/${projectId}/dependencies`}>
            <Button variant="outline">View Full Table</Button>
          </Link>
        </CardHeader>
        <CardContent className="max-h-[500px] overflow-auto">
          <DataTable columns={columns} data={dependencies || []} />
        </CardContent>
      </Card>
    </div>
  )
}
