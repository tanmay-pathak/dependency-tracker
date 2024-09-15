'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { dependencyBySearch } from '@/constants/dependency-mappings'

interface EndOfLifeCellProps {
  searchKey: string
  version: string
}

export function EndOfLifeCell({ searchKey, version }: EndOfLifeCellProps) {
  const [eolDate, setEolDate] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPastEol, setIsPastEol] = useState(false)

  useEffect(() => {
    async function fetchEolData() {
      const dependency = dependencyBySearch[searchKey.toLowerCase()]
      if (!dependency || !dependency.tech) {
        setEolDate('N/A')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(
          `https://endoflife.date/api/${dependency.tech}/${version}.json`,
        )
        if (response.ok) {
          const data = await response.json()
          setEolDate(data.eol)

          // Check if eol is a valid date and set isPastEol
          if (data.eol && !isNaN(Date.parse(data.eol))) {
            const eolDateObj = new Date(data.eol)
            const currentDate = new Date()
            setIsPastEol(eolDateObj < currentDate)
          } else {
            setIsPastEol(false)
          }
        } else {
          setEolDate('N/A')
          setIsPastEol(false)
        }
      } catch (error) {
        console.error('Error fetching EOL data:', error)
        setEolDate('Error')
        setIsPastEol(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEolData()
  }, [searchKey, version])

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />
  }

  return (
    <Badge variant={isPastEol ? 'destructive' : 'default'}>
      {eolDate || 'N/A'}
    </Badge>
  )
}
