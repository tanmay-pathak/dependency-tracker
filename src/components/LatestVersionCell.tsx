'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { dependencyBySearch } from '@/constants/dependency-mappings'
import { useQuery } from '@tanstack/react-query'

interface LatestVersionCellProps {
  currentVersion: string
  searchKey: string
}

async function fetchTechData(tech: string) {
  const response = await fetch(`https://endoflife.date/api/${tech}.json`)
  if (!response.ok) {
    throw new Error('Failed to fetch tech data')
  }
  return response.json()
}

export function LatestVersionCell({
  currentVersion,
  searchKey,
}: LatestVersionCellProps) {
  const dependency = dependencyBySearch[searchKey.toLowerCase()]

  const { data: techData, isLoading } = useQuery({
    queryKey: ['techData', dependency?.tech],
    queryFn: () => fetchTechData(dependency?.tech || ''),
    enabled: !!dependency?.tech,
    staleTime: 1000 * 60 * 60 * 4, // 4 hours
    retry: 3,
  })

  const latestVersion = techData?.[0]?.latest || 'N/A'
  const getMainVersion = (version?: string) => version?.split('.')[0]
  const isMainVersionSame =
    getMainVersion(currentVersion) === getMainVersion(latestVersion) ||
    latestVersion === null

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />
  }

  return (
    <div className="flex items-center">
      <Badge variant={isMainVersionSame ? 'default' : 'destructive'}>
        {latestVersion}
      </Badge>
    </div>
  )
}
