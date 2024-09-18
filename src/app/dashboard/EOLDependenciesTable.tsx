'use client'

import { useState, useEffect, useMemo } from 'react'
import { fetchVersionData, getEolDisplay } from '@/components/EndOfLifeCell'
import { dependencyBySearch } from '@/constants/dependency-mappings'
import { extractCycle, formatDate } from '@/utils/utility-functions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getEnvironmentBadge } from '@/components/ui/data-table'
import { isAfter, addMonths, addYears } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { CurrentVersionTooltip } from '@/components/CurrentVersionTooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

type EolDependency = {
  id: string
  environment: string
  key: string
  value: string
  modified_at?: string
  eol: string
  eolDate: Date | null
}

type VersionData = {
  eol?: boolean | string
  [key: string]: any
}

export default function EolDependenciesTable({
  versions,
}: {
  versions: Array<Record<string, string>>
}) {
  const [eolDependencies, setEolDependencies] = useState<EolDependency[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('all')
  const [showLocal, setShowLocal] = useState(false)

  useEffect(() => {
    async function fetchEolData() {
      const eolData = await Promise.all(
        versions.map(async (version) => {
          const dependency = dependencyBySearch[version.key.toLowerCase()]
          if (!dependency?.tech) return null

          const cycle = extractCycle(version.value)
          if (!cycle) return null

          try {
            const data = (await fetchVersionData(
              dependency.tech,
              cycle,
            )) as VersionData
            if (data && isEolReached(data.eol)) {
              const eolDisplay = getEolDisplay(data.eol)
              return {
                id: version.id || '',
                environment: version.environment || '',
                key: version.key || '',
                value: version.value || '',
                modified_at: version.modified_at,
                eol: eolDisplay,
                eolDate: parseEolDate(eolDisplay),
              }
            }
          } catch (error) {
            console.error('Error fetching EOL data:', error)
          }
          return null
        }),
      )

      setEolDependencies(
        eolData.filter((item) => item !== null) as EolDependency[],
      )
      setIsLoading(false)
    }

    fetchEolData()
  }, [versions])

  const sortedEolDependencies = useMemo(() => {
    return [...eolDependencies].sort((a, b) => {
      if (a.eolDate === null && b.eolDate === null) return 0
      if (a.eolDate === null) return 1
      if (b.eolDate === null) return -1
      return a.eolDate.getTime() - b.eolDate.getTime()
    })
  }, [eolDependencies])

  const filteredEolDependencies = useMemo(() => {
    return selectedEnvironment === 'all'
      ? sortedEolDependencies
      : sortedEolDependencies.filter(
          (dep) =>
            dep.environment === selectedEnvironment ||
            (showLocal && dep.environment === 'LOCAL'),
        )
  }, [sortedEolDependencies, selectedEnvironment, showLocal])

  if (isLoading) {
    return (
      <div className="mt-6 flex justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="prose mb-3 max-w-none text-center">
        <h1>
          Past E.O.L Count:{' '}
          <span className="text-destructive">
            {filteredEolDependencies.length}
          </span>
        </h1>
      </div>
      <div className="mb-4 flex items-center justify-end gap-4">
        {selectedEnvironment !== 'all' && selectedEnvironment !== 'LOCAL' && (
          <div className="flex h-9 min-w-fit items-center gap-2 rounded-md border px-3 py-2 text-sm">
            Show Local
            <Switch checked={showLocal} onCheckedChange={setShowLocal} />
          </div>
        )}
        <Select
          value={selectedEnvironment}
          onValueChange={(value) => setSelectedEnvironment(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Environments</SelectItem>
            <SelectItem value="LOCAL">LOCAL</SelectItem>
            <SelectItem value="DEV">DEV</SelectItem>
            <SelectItem value="BETA">BETA</SelectItem>
            <SelectItem value="PROD">PROD</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Environment</TableHead>
            <TableHead>Tool</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>End of Life</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEolDependencies.map((dep, index) => (
            <TableRow key={index}>
              <TableCell>{dep.id}</TableCell>
              <TableCell>{getEnvironmentBadge(dep.environment)}</TableCell>
              <TableCell>{dep.key}</TableCell>
              <TableCell className="flex gap-2">
                {dep.value}
                <CurrentVersionTooltip
                  currentVersion={dep.value}
                  searchKey={dep.key}
                />
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    isAfter(new Date(), addYears(new Date(dep.eol), 1))
                      ? 'destructive'
                      : 'warning'
                  }
                >
                  {formatDate(dep.eol)}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(dep.modified_at || '')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function isEolReached(eolValue: boolean | string | undefined): boolean {
  if (typeof eolValue === 'boolean') return eolValue
  if (eolValue === 'N/A') return false
  if (eolValue === 'Yes') return true
  const eolDate = new Date(eolValue || '')
  return !isNaN(eolDate.getTime()) && eolDate < new Date()
}

function parseEolDate(eolDisplay: string): Date | null {
  if (eolDisplay === 'Yes' || eolDisplay === 'No' || eolDisplay === 'N/A') {
    return null
  }
  const date = new Date(eolDisplay)
  return isNaN(date.getTime()) ? null : date
}
