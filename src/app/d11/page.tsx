import { Cell } from '@/components/DataCells'
import { TableRowSkeleton } from '@/components/table-list-skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Suspense } from 'react'

export const dataFrom = ['DRUPAL_11_READINESS', 'DRUPAL_UPGRADE_STATUS_CUSTOM']

async function ProjectRow({
  project,
  dependencies,
}: {
  project: string
  dependencies: any[]
}) {
  const d11Readiness = dependencies?.find(
    (dep) => dep.id === project && dep.key === dataFrom[0],
  )?.value
  const d11UpgradeStatus = dependencies?.find(
    (dep) => dep.id === project && dep.key === dataFrom[1],
  )?.value

  return (
    <TableRow>
      <Link href={`/projects/${project}/tools`}>
        <TableCell className="underline decoration-muted-foreground underline-offset-2">
          {project}
        </TableCell>
      </Link>
      <TableCell>
        <Cell tech="DRUPAL_11_READINESS" version={d11Readiness || '-'} />
      </TableCell>
      <TableCell>
        <Cell
          tech="DRUPAL_UPGRADE_STATUS_CUSTOM"
          version={d11UpgradeStatus || '-'}
        />
      </TableCell>
    </TableRow>
  )
}

export default async function D11Page() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data: dependencies, error } = await supabase
    .from('versions')
    .select('*')
    .or('key.eq.DRUPAL_11_READINESS,key.eq.DRUPAL_UPGRADE_STATUS_CUSTOM')

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>
  }

  const uniqueProjects = Array.from(
    new Set(dependencies?.map((dep) => dep.id)),
  ).sort((a, b) => a.localeCompare(b))

  return (
    <div className="container mx-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            {dataFrom.map((from) => (
              <TableHead key={from}>{from}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {uniqueProjects.map((project) => (
            <Suspense
              key={project}
              fallback={<TableRowSkeleton cellCount={3} />}
            >
              <ProjectRow project={project} dependencies={dependencies} />
            </Suspense>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
