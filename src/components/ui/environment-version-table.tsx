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

interface VersionData {
  key: string
  value: string
  environment: string
}

interface EnvironmentVersionTableProps {
  data: VersionData[]
}

export function EnvironmentVersionTable({
  data,
}: EnvironmentVersionTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('')

  const groupedData = useMemo(() => {
    const grouped: { [key: string]: { [env: string]: string } } = {}
    data.forEach((item) => {
      if (!grouped[item.key]) {
        grouped[item.key] = {}
      }
      grouped[item.key][item.environment] = item.value
    })
    return grouped
  }, [data])

  const filteredData = useMemo(() => {
    return Object.entries(groupedData).filter(([key]) =>
      key.toLowerCase().includes(searchTerm.toLowerCase()),
    )
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
              <TableHead>Tool</TableHead>
              <TableHead>DEV</TableHead>
              <TableHead>BETA</TableHead>
              <TableHead>LIVE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map(([key, versions]) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                {['DEV', 'BETA', 'LIVE'].map((env) => (
                  <TableCell key={env}>
                    <div className="flex items-center gap-2">
                      {versions[env] || 'N/A'}
                      {versions[env] && (
                        <CurrentVersionTooltip
                          currentVersion={versions[env]}
                          searchKey={key}
                        />
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
