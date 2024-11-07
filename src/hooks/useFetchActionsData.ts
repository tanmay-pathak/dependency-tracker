import { fetchActionsData } from '@/server-actions/github'
import { useQuery } from '@tanstack/react-query'
import { Endpoints } from '@octokit/types'

export type Filter = Exclude<
  Endpoints['GET /repos/{owner}/{repo}/actions/runs']['parameters']['status'],
  undefined
>

export type ActionOptions = {
  repoName: string
  owner: string
  filter: Filter
}

const useFetchActionsData = (options: ActionOptions) =>
  useQuery({
    queryKey: ['actionsData', options],
    queryFn: () => fetchActionsData(options),
    enabled: options.repoName !== '' && options.owner !== '',
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchInterval: 1000 * 60 * 15, // 15 minutes
    retry: 1,
  })

export default useFetchActionsData
