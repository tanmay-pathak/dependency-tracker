import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { EnvironmentVersionTable } from '@/components/ui/environment-version-table'
import Link from 'next/link'
import { Dependency } from '@/app/versions/[search]/columns'

export default async function EnvironmentVersionsPage({
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
        <Link href={`/projects/${projectId}`}>Back to Project</Link>
      </div>
      <EnvironmentVersionTable data={dependencies} />
    </div>
  )
}
