'use client'
import ActionCard from '@/components/ActionCard'
import { Skeleton } from '@/components/ui/skeleton'
import useFetchActionsData from '@/hooks/useFetchActionsData'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Endpoints } from '@octokit/types'

type Props = { repoName: string }

const RepositoryActions = ({ repoName }: Props) => {
  const [selectedFilter, setSelectedFilter] =
    useState<
      Exclude<
        Endpoints['GET /repos/{owner}/{repo}/actions/runs']['parameters']['status'],
        undefined
      >
    >('completed')
  const { data, isLoading } = useFetchActionsData({
    repoName: repoName as string,
    owner: process.env.NEXT_PUBLIC_GITHUB_OWNER ?? '',
    filter: selectedFilter,
  })

  if (data === undefined && !isLoading) {
    return <>Something went wrong...</>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-center text-2xl font-bold uppercase">{repoName}</h2>
      </div>
      <div className="mb-4 flex items-center justify-end gap-4">
        <Select
          value={selectedFilter}
          // @ts-ignore
          onValueChange={(value) => setSelectedFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failure">Failure</SelectItem>
            <SelectItem value="action_required">Action Required</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="skipped">Skipped</SelectItem>
            <SelectItem value="stale">Stale</SelectItem>
            <SelectItem value="timed_out">Timed Out</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
            <SelectItem value="requested">Requested</SelectItem>
            <SelectItem value="waiting">Waiting</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <Skeleton className="h-[150px] w-[350px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data?.workflow_runs.map((action) => (
            <ActionCard key={action.id} action={action} />
          ))}
        </div>
      )}
    </div>
  )
}

export default RepositoryActions
