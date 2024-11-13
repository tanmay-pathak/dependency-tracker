import { getEnvironmentBadge } from '@/components/env-badges'
import { InfoTooltip } from '@/components/InfoTooltip'
import { TableRowSkeleton } from '@/components/table-list-skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetchDependabotAlertsData } from '@/server-actions/github'
import { createServerClient } from '@/utils/supabase'
import { ExternalLink } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Suspense, use } from 'react'

type ProjectToAlert = {
  project: string
  environment: string
  count: number
  modified: string
  alerts: Awaited<ReturnType<typeof fetchDependabotAlertsData>>
}

async function fetchProjectAlerts(project: string) {
  const alerts = await fetchDependabotAlertsData(project)
  const openAlerts = alerts.filter((alert) => alert.state === 'open')
  const count = openAlerts.length

  if (count === 0) return null

  return {
    project,
    environment: 'PROD',
    count,
    modified: new Date().toISOString(),
    alerts: openAlerts,
  }
}

function AlertRow({ project }: { project: ProjectToAlert }) {
  const tooltipData = project.alerts.map((alert) => ({
    Package:
      alert.security_advisory?.vulnerabilities[0]?.package?.name || 'Unknown',
    Severity: alert.security_advisory?.severity || 'Unknown',
    State: alert.state,
    Created: new Date(alert.created_at).toLocaleDateString(),
    Summary: alert.security_advisory?.summary || 'No summary available',
  }))

  return (
    <TableRow>
      <Link href={`/projects/${project.project}/tools`}>
        <TableCell className="underline decoration-muted-foreground underline-offset-2">
          {project.project}
        </TableCell>
      </Link>
      <TableCell className="w-10">
        {getEnvironmentBadge(project.environment)}
      </TableCell>
      <TableCell>
        <Link
          href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER}/${project.project}/security/dependabot`}
          target={'_blank'}
          rel={'noopener noreferrer'}
        >
          <Badge
            variant={'destructive'}
            className="flex w-fit justify-center gap-1 text-center"
          >
            {project.count} <ExternalLink className="size-3" />
          </Badge>
        </Link>
      </TableCell>
      <TableCell>
        <InfoTooltip data={tooltipData}>
          <span className="sr-only">Alert Details</span>
        </InfoTooltip>
      </TableCell>
      <TableCell>now</TableCell>
    </TableRow>
  )
}

function ProjectAlerts({ project }: { project: string }) {
  const alertData = use(fetchProjectAlerts(project))
  if (!alertData) return null
  return <AlertRow project={alertData} />
}

const SecurityAlertsTable = async () => {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data } = await supabase
    .from('versions')
    .select('id')
    .order('id', { ascending: true })
  const uniqueProjects = Array.from(new Set(data?.map((p) => p.id) || []))

  return (
    <>
      <div className="prose mb-3 max-w-none text-center">
        <h1>Open Dependabot Security Alerts</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Environment</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {uniqueProjects.map((project) => (
            <Suspense key={project} fallback={<TableRowSkeleton />}>
              <ProjectAlerts project={project} />
            </Suspense>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default SecurityAlertsTable
