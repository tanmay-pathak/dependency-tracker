'use client'

import ActionCard from '@/components/ActionCard'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ActionOptions } from '@/hooks/useFetchActionsData'
import { fetchActionsData } from '@/server-actions/github'
import { useQueries } from '@tanstack/react-query'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface ProjectListProps {
  projects: string[]
}

let actionOptions: ActionOptions = {
  repoName: '',
  owner: process.env.NEXT_PUBLIC_GITHUB_OWNER ?? '',
  filter: 'in_progress',
}

export default function ActionsHomePage({ projects }: ProjectListProps) {
  const results = useQueries({
    queries:
      projects.map((project) => ({
        queryKey: ['actionsData', { ...actionOptions, repoName: project }],
        queryFn: () =>
          fetchActionsData({ ...actionOptions, repoName: project }),
        staleTime: 1000 * 60 * 15, // 15 minutes
        refetchInterval: 1000 * 60 * 15, // 15 minutes
        retry: 1,
      })) ?? [],
  })

  return (
    <div>
      <div className="container mx-auto grid flex-1 grid-cols-8 p-4">
        <div className="col-span-2 flex flex-col gap-8">
          <div>
            <h2 className="mt-4 rounded-xl border p-4 text-2xl font-semibold">
              In Progress Actions
            </h2>
          </div>
          <div className="flex max-h-screen flex-col gap-4 overflow-x-hidden overflow-y-scroll overscroll-y-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-700">
            {results.map((query) => {
              const { data } = query
              const result = data?.workflow_runs.map((action) => {
                return <ActionCard key={action.id} action={action} />
              })
              return result
            })}
          </div>
        </div>
        <div className="col-span-6">
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {projects.map((repo) => (
                <Link href={`/actions/${repo}`} key={repo} className="block">
                  <Card className="relative h-full">
                    <CardHeader>
                      <CardTitle>
                        <span className="break-words text-2xl font-bold">
                          {repo}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <ExternalLink className="absolute right-4 top-4 size-4 text-muted-foreground" />
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
