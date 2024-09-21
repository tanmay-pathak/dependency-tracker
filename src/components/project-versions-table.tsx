'use client'

import React, { useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { CurrentVersionTooltip } from '@/components/CurrentVersionTooltip'
import { Dependency } from '@/constants/types'
import { LatestVersionCell } from './LatestVersionCell'
import { EndOfLifeCell } from './EndOfLifeCell'
import Link from 'next/link'

interface ProjectVersionsTableProps {
  data: Dependency[]
  tech: string
}

export function ProjectVersionsTable({
  data,
  tech,
}: ProjectVersionsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('')

  const groupedData = useMemo(() => {
    const grouped: { [key: string]: { [env: string]: string } } = {}
    data.forEach((item) => {
      if (!grouped[item.id]) {
        grouped[item.id] = {}
      }
      grouped[item.id][item.environment] = item.value
    })
    return grouped
  }, [data])

  const filteredData = useMemo(() => {
    return Object.entries(groupedData)
      .filter(([key]) => key.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort(([a], [b]) => a.localeCompare(b))
  }, [groupedData, searchTerm])

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 bg-background p-2">
        <Input
          placeholder="Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
      </div>
      <div className="flex-grow overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>LOCAL</TableHead>
              <TableHead>DEV</TableHead>
              <TableHead>BETA</TableHead>
              <TableHead>PROD</TableHead>
              <TableHead>Latest Version</TableHead>
              <TableHead>EOL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map(([key, versions]) => (
              <TableRow key={key}>
                <Link href={`/projects/${key}/tools`}>
                  <TableCell className="underline decoration-muted-foreground underline-offset-2">
                    {key}
                  </TableCell>
                </Link>
                {['LOCAL', 'DEV', 'BETA', 'PROD'].map((env) => (
                  <TableCell key={env}>
                    <CurrentVersionTooltip
                      currentVersion={versions[env]}
                      searchKey={tech}
                    >
                      {versions[env] || '-'}
                    </CurrentVersionTooltip>
                  </TableCell>
                ))}
                <TableCell>
                  <LatestVersionCell
                    searchKey={tech}
                    currentVersion={
                      versions['PROD'] ||
                      versions['BETA'] ||
                      versions['DEV'] ||
                      versions['LOCAL']
                    }
                  />
                </TableCell>
                <TableCell>
                  <EndOfLifeCell
                    searchKey={tech}
                    version={
                      versions['PROD'] ||
                      versions['BETA'] ||
                      versions['DEV'] ||
                      versions['LOCAL']
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
