'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'

interface ProjectListProps {
  projects: string[]
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [projects, searchTerm])

  return (
    <div>
      <Input
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
        autoFocus={true}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProjects.map((project) => (
          <Link
            href={`/projects/${project}/tools`}
            key={project}
            className="block"
          >
            <Card className="relative h-full">
              <CardHeader>
                <CardTitle className="prose max-w-none">
                  <h2>{project}</h2>
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
