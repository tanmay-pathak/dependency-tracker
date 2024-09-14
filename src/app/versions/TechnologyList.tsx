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

interface Technology {
  name: string
  search: string
  tech?: string
}

interface TechnologyListProps {
  technologies: Technology[]
}

export default function TechnologyList({ technologies }: TechnologyListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTechnologies = useMemo(() => {
    return technologies.filter((tech) =>
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [technologies, searchTerm])

  return (
    <div>
      <Input
        placeholder="Search technologies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
        autoFocus={true}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredTechnologies.map((tech) => (
          <Link
            href={`/versions/${tech.search}?technology=${tech.tech}`}
            key={tech.search}
          >
            <Card className="cursor-pointer">
              <CardHeader>
                <CardTitle>{tech.name}</CardTitle>
                <CardDescription>Click to view versions</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
