'use client'

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { dependencyBySearch } from '@/constants/dependency-mappings'

interface LatestVersionCellProps {
  currentVersion: string
  searchKey: string
}

export function LatestVersionCell({
  currentVersion,
  searchKey,
}: LatestVersionCellProps) {
  const [latestVersion, setLatestVersion] = useState<string | undefined>(
    undefined,
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchLatestVersion() {
      const dependency = dependencyBySearch[searchKey.toLowerCase()]
      if (!dependency || !dependency.tech) {
        setLatestVersion('N/A')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(
          `https://endoflife.date/api/${dependency.tech}.json`,
        )
        if (response.ok) {
          const data = await response.json()
          setLatestVersion(data[0]?.latest || 'N/A')
        } else {
          setLatestVersion('N/A')
        }
      } catch (error) {
        console.error('Error fetching latest version:', error)
        setLatestVersion('Error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestVersion()
  }, [searchKey])

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
        {latestVersion || 'N/A'}
      </Badge>
    </div>
  )
}
