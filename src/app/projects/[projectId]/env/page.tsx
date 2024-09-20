import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { DataTable } from '@/components/data-table'
import { columns } from './columns'
import Link from 'next/link'
import { Dependency } from '@/app/versions/[search]/columns'
import { Button } from '@/components/ui/button'
import { Table } from 'lucide-react'

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
      <div className="prose max-w-none pb-2">
        <h2 className="text-center">{projectId}</h2>
        <div className="flex justify-end">
          <Link href={`/projects/${projectId}/tools`} passHref>
            <Button variant="outline" size="sm" asChild>
              <span>
                <Table className="mr-2 h-4 w-4" />
                Compare Environments
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <DataTable columns={columns} data={dependencies} />
    </div>
  )
}
