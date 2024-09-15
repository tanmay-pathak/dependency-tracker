'use client'

import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { dependencyBySearch } from '@/constants/dependency-mappings'
import { useQuery } from '@tanstack/react-query'
import { InfoTooltip } from '@/components/InfoTooltip'

interface EndOfLifeCellProps {
  searchKey: string
  version: string
}

export async function fetchVersionData(tech: string, version: string) {
  async function fetchDataForSpecificVersion(versionToFetch: string) {
    const url = `https://endoflife.date/api/${tech}/${versionToFetch}.json`
    const response = await fetch(url)

    if (response.status === 404) return null
    if (!response.ok) throw new Error('Failed to fetch EOL data')

    return (await response.json()) as Record<string, string>
  }

  let versionToTry = version
  let data = null

  while (versionToTry) {
    data = await fetchDataForSpecificVersion(versionToTry)
    if (data) break

    const versionParts = versionToTry.split('.')
    versionParts.pop()
    versionToTry = versionParts.join('.')
  }

  if (!data) throw new Error('Failed to fetch version data')

  return { Showing_Info_For_Version: versionToTry, ...data }
}

export function EndOfLifeCell({ searchKey, version }: EndOfLifeCellProps) {
  const dependency = dependencyBySearch[searchKey.toLowerCase()]

  const { data, isLoading } = useQuery({
    queryKey: ['eolData', dependency?.tech, version],
    queryFn: () => fetchVersionData(dependency?.tech || '', version),
    enabled: !!dependency?.tech,
    staleTime: 1000 * 60 * 60 * 4, // 4 hours
    retry: 3,
  })

  if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />

  // @ts-expect-error - No proper type hints for this API exists.
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
    <div className="flex items-center gap-1">
      <Badge variant={isPastEol ? 'destructive' : 'default'}>
        {eolDisplay}
      </Badge>
      <InfoTooltip data={data} title="End of Life Information" type="eol" />
    </div>
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
