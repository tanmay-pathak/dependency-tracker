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
import { cookies } from 'next/headers'

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
    // const count = 0
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
              <TableCell>{project.project}</TableCell>
              <TableCell className="w-10">
                {getEnvironmentBadge(project.environment)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={'destructive'}
                  className="flex w-10 justify-center text-center"
                >
                  {project.count}
                </Badge>
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
