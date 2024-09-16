import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EOLDependenciesTable from './EOLDependenciesTable'

async function getDashboardData() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const [{ data: projects }, { data: tools }, { data: versions }] =
    await Promise.all([
      supabase.from('versions').select('id'),
      supabase.from('versions').select('key'),
      supabase.from('versions').select('*'),
    ])

  const uniqueProjects = new Set(projects?.map((p) => p.id))
  const projectCount = uniqueProjects.size

  const uniqueTools = new Set(
    tools
      ?.filter((t) => t.key.toLowerCase().includes('version'))
      .map((t) => t.key),
  )
  const uniqueToolsCount = uniqueTools.size

  return {
    projectCount,
    uniqueToolsCount,
    versions,
  }
}

export default async function DashboardPage() {
  const { projectCount, uniqueToolsCount, versions } = await getDashboardData()

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{projectCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unique Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{uniqueToolsCount}</p>
          </CardContent>
        </Card>
      </div>
      <EOLDependenciesTable versions={versions ?? []} />
    </div>
  )
}
