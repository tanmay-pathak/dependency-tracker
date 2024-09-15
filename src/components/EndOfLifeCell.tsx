'use client'

import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { dependencyBySearch } from '@/constants/dependency-mappings'
import { useQuery } from '@tanstack/react-query'

interface EndOfLifeCellProps {
  searchKey: string
  version: string
}

async function fetchEolData(tech: string, version: string) {
  const response = await fetch(
    `https://endoflife.date/api/${tech}/${version}.json`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch EOL data')
  }
  return response.json()
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

  const eolDate = data?.eol || 'N/A'
  const isPastEol =
    eolDate !== 'N/A' &&
    !isNaN(Date.parse(eolDate)) &&
    new Date(eolDate) < new Date()

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />
  }

  return (
    <Badge variant={isPastEol ? 'destructive' : 'default'}>{eolDate}</Badge>
  )
}
