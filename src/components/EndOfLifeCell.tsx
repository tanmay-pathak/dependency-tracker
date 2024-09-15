'use client'

import { Loader2, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { dependencyBySearch } from '@/constants/dependency-mappings'
import { useQuery } from '@tanstack/react-query'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface EndOfLifeCellProps {
  searchKey: string
  version: string
}

async function fetchEolData(tech: string, version: string) {
  async function fetchVersionData(versionToFetch: string) {
    const url = `https://endoflife.date/api/${tech}/${versionToFetch}.json`
    const response = await fetch(url)

    if (response.status === 404) return null
    if (!response.ok) throw new Error('Failed to fetch EOL data')

    return response.json()
  }

  let data = await fetchVersionData(version)

  if (!data) {
    // Try to fetch the main version
    const mainVersion = version.split('.')[0]
    data = await fetchVersionData(mainVersion)
  }

  if (!data) throw new Error('Failed to fetch EOL data')

  return data
}

export function EndOfLifeCell({ searchKey, version }: EndOfLifeCellProps) {
  const dependency = dependencyBySearch[searchKey.toLowerCase()]

  const { data, isLoading } = useQuery({
    queryKey: ['eolData', dependency?.tech, version],
    queryFn: () => fetchEolData(dependency?.tech || '', version),
    enabled: !!dependency?.tech,
    staleTime: 1000 * 60 * 60 * 4, // 4 hours
    retry: 3,
  })

  if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />

  const eolValue = data?.eol
  const eolDisplay = getEolDisplay(eolValue)
  const isPastEol = checkIsPastEol(eolDisplay)

  if (!data) {
    return (
      <Badge variant={isPastEol ? 'destructive' : 'default'}>
        {eolDisplay}
      </Badge>
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <div className="flex items-center gap-1">
          <Badge variant={isPastEol ? 'destructive' : 'default'}>
            {eolDisplay}
          </Badge>
          <TooltipTrigger className="flex items-center gap-1">
            <Info className="h-3 w-3 text-muted-foreground" />
          </TooltipTrigger>
        </div>
        <TooltipContent className="bg-white">
          <pre className="bg-white text-xs text-black">
            {JSON.stringify(data, null, 2)}
          </pre>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function getEolDisplay(eolValue: boolean | string | undefined): string {
  if (typeof eolValue === 'boolean') return eolValue ? 'Yes' : 'No'
  return eolValue || 'N/A'
}

function checkIsPastEol(eolDisplay: string): boolean {
  if (eolDisplay === 'N/A') return false
  if (eolDisplay === 'Yes') return true
  const eolDate = new Date(eolDisplay)
  return !isNaN(eolDate.getTime()) && eolDate < new Date()
}
