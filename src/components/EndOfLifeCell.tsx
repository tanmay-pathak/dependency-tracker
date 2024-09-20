'use client'

import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { dependencyBySearch } from '@/constants/dependency-mappings'
import { InfoTooltip } from '@/components/InfoTooltip'
import useFetchVersionData from '@/hooks/useFetchVersionData'
import { formatDate } from '@/utils/utility-functions'

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
  const formattedDate = formatDate(eolDisplay)

  if (!data) {
    return (
      <Badge
        variant={isPastEol ? 'destructive' : 'default'}
        className={`${eolDisplay === '-' ? 'bg-transparent text-white hover:bg-transparent' : ''}`}
      >
        {eolDisplay}
      </Badge>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <Badge variant={isPastEol ? 'destructive' : 'default'}>
        {formattedDate}
      </Badge>
      <InfoTooltip data={[data]} />
    </div>
  )
}

export function getEolDisplay(eolValue: boolean | string | undefined): string {
  if (typeof eolValue === 'boolean') return eolValue ? 'Yes' : 'No'
  return eolValue || '-'
}

function checkIsPastEol(eolDisplay: string): boolean {
  if (eolDisplay === '-') return false
  if (eolDisplay === 'Yes') return true
  const eolDate = new Date(eolDisplay)
  return !isNaN(eolDate.getTime()) && eolDate < new Date()
}
