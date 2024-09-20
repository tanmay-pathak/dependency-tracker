'use client'

import React from 'react'
import { InfoTooltip } from './InfoTooltip'
import { Loader2 } from 'lucide-react'
import { dependencyBySearch } from '@/constants/dependency-mappings'
import useFetchVersionData from '@/hooks/useFetchVersionData'

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

  const { data, isLoading } = useFetchVersionData(
    dependency?.tech || '',
    currentVersion,
  )

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

  return <InfoTooltip data={[data]}>{children}</InfoTooltip>
}
