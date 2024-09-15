'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { InfoTooltip } from './InfoTooltip'
import { Loader2 } from 'lucide-react'
import { dependencyBySearch } from '@/constants/dependency-mappings'

interface CurrentVersionTooltipProps {
  currentVersion: string
  searchKey: string
}

async function fetchVersionData(tech: string, version: string) {
  const response = await fetch(`https://endoflife.date/api/${tech}/${version}.json`)
  if (!response.ok) {
    throw new Error('Failed to fetch version data')
  }
  return response.json()
}

export function CurrentVersionTooltip({ currentVersion, searchKey }: CurrentVersionTooltipProps) {
  const dependency = dependencyBySearch[searchKey.toLowerCase()]

  const { data, isLoading } = useQuery({
    queryKey: ['versionData', dependency?.tech, currentVersion],
    queryFn: () => fetchVersionData(dependency?.tech || '', currentVersion),
    enabled: !!dependency?.tech && !!currentVersion,
    staleTime: 1000 * 60 * 60 * 4, // 4 hours
    retry: 3,
  })

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />
  }

  if (!data) {
    return null
  }

  return (
    <InfoTooltip
      data={data}
      title="Current Version Information"
      type="current"
    />
  )
}