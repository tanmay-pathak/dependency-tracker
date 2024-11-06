import React from 'react'
import { Skeleton } from '../ui/skeleton'

type Props = {}

const InProgressSkeleton = (props: Props) => {
  return (
    <div className="flex flex-col gap-8 px-2">
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-2">
          <Skeleton className="h-[150px] rounded-xl px-2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default InProgressSkeleton
