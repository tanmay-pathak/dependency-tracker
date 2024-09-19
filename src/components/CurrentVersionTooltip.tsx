'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { InfoTooltip } from './InfoTooltip'
import { Loader2 } from 'lucide-react'
import { dependencyBySearch } from '@/constants/dependency-mappings'
import { fetchVersionData } from './EndOfLifeCell'

interface CurrentVersionTooltipProps {
  currentVersion: string
  searchKey: string
  children?: React.ReactNode
}

export function CurrentVersionTooltip({
  currentVersion,
  searchKey,
  children,
}: CurrentVersionTooltipProps) {
  const dependency = dependencyBySearch[searchKey.toLowerCase()]

  const { data, isLoading } = useQuery({
    queryKey: ['versionData', dependency?.tech, currentVersion],
    queryFn: () => fetchVersionData(dependency?.tech || '', currentVersion),
    enabled: !!dependency?.tech && !!currentVersion,
    staleTime: 1000 * 60 * 60 * 4, // 4 hours
    retry: 3,
  })

  if (isLoading) {
    return (
      <>
        {children}
        <Loader2 className="h-4 w-4 animate-spin" />
      </>
    )
  }

  if (!data) {
    return <>{children}</>
  }

  return (
    <InfoTooltip data={data} title="Current Version Information" type="current">
      {children}
    </InfoTooltip>
  )
}
