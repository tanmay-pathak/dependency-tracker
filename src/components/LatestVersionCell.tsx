'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { dependencyBySearch } from '@/constants/dependency-mappings'
import { InfoTooltip } from './InfoTooltip'
import useFetchTechData from '@/hooks/useFetchTechData'

interface LatestVersionCellProps {
  currentVersion?: string
  searchKey: string
}

export function LatestVersionCell({
  currentVersion,
  searchKey,
}: LatestVersionCellProps) {
  const dependency = dependencyBySearch[searchKey.toLowerCase()]
  const { data: techData, isLoading } = useFetchTechData(dependency?.tech || '')

  const latestVersion = techData?.[0]?.latest || '-'
  const getMainVersion = (version?: string) => version?.split('.')[0]
  const isMainVersionSame =
    getMainVersion(currentVersion) === getMainVersion(latestVersion) ||
    latestVersion === '-' ||
    currentVersion === undefined

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />
  }

  return (
    <div className="flex items-center gap-1">
      <Badge
        variant={isMainVersionSame ? 'default' : 'destructive'}
        className={`${latestVersion === '-' ? 'bg-transparent text-white hover:bg-transparent' : ''}`}
      >
        {latestVersion}
      </Badge>
      {techData && techData.length > 0 && <InfoTooltip data={techData} />}
    </div>
  )
}
