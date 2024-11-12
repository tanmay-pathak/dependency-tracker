import { getEnvironmentBadge } from '@/components/env-badges'
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

type ProjectToAlert = {
  project: string
  environment: string
  count: number
  modified: string
}

const SecurityAlertsTable = async () => {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data } = await supabase
    .from('versions')
    .select('id')
    .order('id', { ascending: true })
  const uniqueProjects = new Set(data?.map((p) => p.id))
  const projectToOpenAlerts: ProjectToAlert[] = []
  for (const project of uniqueProjects) {
    const alerts = await fetchDependabotAlertsData(project)
    const count = alerts.filter((alert) => alert.state === 'open').length

    if (count === 0) {
      continue
    }

    projectToOpenAlerts.push({
      project,
      environment: 'PROD',
      count: count,
      modified: new Date().toISOString(),
    })
  }
  const total = projectToOpenAlerts.reduce((acc, project) => {
    return acc + project.count
  }, 0)

  return (
    <>
      <div className="prose mb-3 max-w-none text-center">
        <h1>
          Open Dependabot Security Alerts:{' '}
          <span className="text-destructive">{total}</span>
        </h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Environment</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projectToOpenAlerts.map((project, index) => (
            <TableRow key={index}>
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
              <TableCell>now</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default SecurityAlertsTable
