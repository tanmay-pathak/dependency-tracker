'use client'

import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { dependencyBySearch } from '@/constants/dependency-mappings'
import { InfoTooltip } from '@/components/InfoTooltip'
import useFetchVersionData from '@/hooks/useFetchVersionData'

interface EndOfLifeCellProps {
  searchKey: string
  version: string
}

export function EndOfLifeCell({ searchKey, version }: EndOfLifeCellProps) {
  const dependency = dependencyBySearch[searchKey.toLowerCase()]

  const { data, isLoading } = useFetchVersionData(
    dependency?.tech || '',
    version,
  )

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
    <div className="flex items-center gap-1">
      <Badge variant={isPastEol ? 'destructive' : 'default'}>
        {eolDisplay}
      </Badge>
      <InfoTooltip data={data} title="End of Life Information" type="eol" />
    </div>
  )
}

export function getEolDisplay(eolValue: boolean | string | undefined): string {
  if (typeof eolValue === 'boolean') return eolValue ? 'Yes' : 'No'
  return eolValue || 'N/A'
}

function checkIsPastEol(eolDisplay: string): boolean {
  if (eolDisplay === 'N/A') return false
  if (eolDisplay === 'Yes') return true
  const eolDate = new Date(eolDisplay)
  return !isNaN(eolDate.getTime()) && eolDate < new Date()
}
