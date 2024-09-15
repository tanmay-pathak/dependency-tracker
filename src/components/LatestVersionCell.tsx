import React from 'react'
import { Badge } from '@/components/ui/badge'

interface LatestVersionCellProps {
  currentVersion: string
  latestVersion?: string
}

export function LatestVersionCell({
  currentVersion,
  latestVersion,
}: LatestVersionCellProps) {
  const getMainVersion = (version?: string) => version?.split('.')[0]
  const isMainVersionSame =
    getMainVersion(currentVersion) === getMainVersion(latestVersion) ||
    latestVersion === undefined

  return (
    <div className="flex items-center">
      <Badge variant={isMainVersionSame ? 'default' : 'destructive'}>
        {latestVersion || 'N/A'}
      </Badge>
    </div>
  )
}
