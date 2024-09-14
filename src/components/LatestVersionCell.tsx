import React from 'react'
import { Badge } from '@/components/ui/badge'

interface LatestVersionCellProps {
  currentVersion: string
  latestVersion: string
}

export function LatestVersionCell({
  currentVersion,
  latestVersion,
}: LatestVersionCellProps) {
  const isUpToDate = currentVersion === latestVersion

  return (
    <div className="flex items-center">
      <Badge variant={isUpToDate ? 'default' : 'destructive'}>
        {latestVersion}
      </Badge>
    </div>
  )
}
