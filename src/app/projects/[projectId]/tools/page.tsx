import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Dependency } from '@/constants/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ProjectToolsTable } from '@/components/project-tools-table'
import { SimpleProjectToolsTable } from '@/components/simple-project-tools-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function ToolsPage({
  params: { projectId },
}: {
  params: { projectId: string }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const [allDependencies, simpleDependencies] = await Promise.all([
    supabase.from('versions').select('*').eq('id', projectId),
    supabase
      .from('versions')
      .select('*')
      .eq('id', projectId)
      .eq('environment', 'PROD')
      .ilike('key', '%VERSION%')
      .order('key', { ascending: true }),
  ])

  if (allDependencies.error || simpleDependencies.error) {
    return (
      <div>
        Error:{' '}
        {allDependencies.error?.message || simpleDependencies.error?.message}
      </div>
    )
  }

  const dependencies: Dependency[] = allDependencies.data || []
  const simpleDependenciesData: Dependency[] = simpleDependencies.data || []

  return (
    <div className="container mx-auto p-6">
      <div className="relative mb-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <Link href={`/projects`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Projects
            </Button>
          </Link>
        </div>
        <h2 className="text-center text-2xl font-bold">{projectId}</h2>
      </div>

      <Tabs defaultValue="detailed" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          <TabsTrigger value="simple">Simple View</TabsTrigger>
        </TabsList>
        <TabsContent value="detailed">
          <ProjectToolsTable data={dependencies} />
        </TabsContent>
        <TabsContent value="simple">
          <SimpleProjectToolsTable data={simpleDependenciesData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
