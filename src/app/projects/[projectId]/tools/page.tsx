import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Dependency } from '@/app/versions/[search]/columns'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ProjectToolsTable } from '@/components/ui/project-tools-table'

export default async function ToolsPage({
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
      <div className="relative mb-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <Link href={`/projects/${projectId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Button>
          </Link>
        </div>
        <h2 className="text-center text-2xl font-bold">{projectId}</h2>
      </div>
      <ProjectToolsTable data={dependencies} />
    </div>
  )
}
