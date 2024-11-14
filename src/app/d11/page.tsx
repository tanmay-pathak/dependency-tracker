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

export default async function D11Page() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data: dependencies, error } = await supabase
    .from('versions')
    .select('*')
    .eq('key', 'DRUPAL_11_READINESS')

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>
  }

  // Remove duplicates and sort alphabetically
  const uniqueProjects = Array.from(
    new Set(dependencies?.map((dep) => dep.id)),
  ).sort((a, b) => a.localeCompare(b))

  const tools = ['Php', 'Drupal', 'Drush']

  return (
    <div className="container mx-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            {tools.map((tool) => (
              <TableHead key={tool}>{tool}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {uniqueProjects.map((project) => (
            <TableRow key={project}>
              <TableCell>{project}</TableCell>
              {tools.map((tool) => (
                <TableCell key={tool}>-</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
