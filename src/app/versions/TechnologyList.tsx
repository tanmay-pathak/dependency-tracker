'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'
import { useQueryState } from 'nuqs'

interface Technology {
  name: string
  search: string
  tech?: string
}

interface TechnologyListProps {
  technologies: Technology[]
}

export default function TechnologyList({ technologies }: TechnologyListProps) {
  const [searchTerm, setSearchTerm] = useQueryState('search', {
    defaultValue: '',
  })

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
            href={`/versions/${tech.search}/project${tech.tech ? `?technology=${tech.tech}` : ''}`}
            key={tech.search}
          >
            <Card className="relative h-full">
              <CardHeader>
                <CardTitle>
                  <span className="text-2xl font-bold">{tech.name}</span>
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
