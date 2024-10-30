'use client'

import useFetchRepos from '@/hooks/useFetchRepos'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function ActionsHomePage() {
  const { data } = useFetchRepos({
    owner: process.env.NEXT_PUBLIC_GITHUB_OWNER ?? '',
  })

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.map((repo) => (
          <Link
            href={`/actions/${repo.name}`}
            key={repo.full_name}
            className="block"
          >
            <Card className="relative h-full">
              <CardHeader>
                <CardTitle>
                  <span className="text-2xl font-bold">{repo.name}</span>
                </CardTitle>
              </CardHeader>
              <ExternalLink className="absolute right-4 top-4 size-4 text-muted-foreground" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
