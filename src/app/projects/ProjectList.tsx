'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

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
          <Link href={`/projects/${project}`} key={project} className="block">
            <Card className="cursor-pointer">
              <CardHeader>
                <CardTitle className="text-primary">{project}</CardTitle>
                <CardDescription>Click to view dependencies</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
