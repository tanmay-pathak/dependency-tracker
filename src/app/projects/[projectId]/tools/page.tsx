import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Dependency } from '@/constants/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, List } from 'lucide-react'
import { ProjectToolsTable } from '@/components/project-tools-table'
import { fetchDependabotAlertsData } from '@/server-actions/github'
import CardWithLink from '@/components/card-with-link'

export default async function ToolsPage(props: {
  params: Promise<{ projectId: string }>
}) {
  const params = await props.params

  const { projectId } = params

  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data, error } = await supabase
    .from('versions')
    .select('*')
    .eq('id', projectId)

  if (error) {
    return <div>Error: {error.message}</div>
  }
  const dependencies: Dependency[] = data || []

  const alerts = await fetchDependabotAlertsData(projectId)
  const count = alerts.filter((alert) => alert.state === 'open').length

  return (
    <div className="container mx-auto p-6">
      <div className="relative mb-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <Link prefetch={true} href={`/projects`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Projects
            </Button>
          </Link>
        </div>
        <h2 className="text-center text-2xl font-bold">{projectId}</h2>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <Link prefetch={true} href={`/projects/${projectId}/simple-tools`}>
            <Button variant="outline" size="sm">
              <List className="mr-2 h-4 w-4" />
              Simple View
            </Button>
          </Link>
        </div>
      </div>
      {count > 0 && (
        <CardWithLink
          title="Open Dependabot Security Issues"
          content={count.toString()}
          link={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER}/${projectId}/security/dependabot`}
          isExternalLink={true}
          className="md:w-1/2"
          contentClassName="text-red-500"
        />
      )}
      <ProjectToolsTable data={dependencies} />
    </div>
  )
}
