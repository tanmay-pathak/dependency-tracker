import { Cell } from '@/components/DataCells'
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

  // Remove duplicates and sort alphabetically
  const uniqueProjects = Array.from(
    new Set(dependencies?.map((dep) => dep.id)),
  ).sort((a, b) => a.localeCompare(b))

  const dataFrom = ['DRUPAL_11_READINESS', 'DRUPAL_UPGRADE_STATUS_CUSTOM']

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
            <TableRow key={project}>
              <Link href={`/projects/${project}/tools`}>
                <TableCell className="underline decoration-muted-foreground underline-offset-2">
                  {project}
                </TableCell>
              </Link>
              {dataFrom.map((from) => (
                <TableCell key={`${project}-${from}`}>
                  <Cell
                    tech={from}
                    version={
                      dependencies?.find(
                        (dep) => dep.id === project && dep.key === from,
                      )?.value || '-'
                    }
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
