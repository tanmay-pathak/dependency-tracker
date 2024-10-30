import { UseQueryResult, useQuery } from '@tanstack/react-query'
import axios from 'axios'

export type ActionOptions = {
  repoName: string
  owner: string
  filter:
    | 'completed'
    | 'action_required'
    | 'cancelled'
    | 'failure'
    | 'neutral'
    | 'skipped'
    | 'stale'
    | 'success'
    | 'timed_out'
    | 'in_progress'
    | 'queued'
    | 'requested'
    | 'waiting'
    | 'pending'
}

export type ghActions = {
  total_count: number
  workflow_runs: any[]
}

export async function fetchTechData(
  options: ActionOptions,
): Promise<ghActions> {
  const url = `https://api.github.com/repos/${options.owner}/${options.repoName}/actions/runs?status=${options.filter}`
  const GH_ACCESS_TOKEN = process.env.NEXT_PUBLIC_GH_ACCESS_TOKEN
  try {
    const { data } = await axios.get<ghActions>(url, {
      headers: {
        Authorization: `${GH_ACCESS_TOKEN}`,
      },
    })

    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { total_count: 0, workflow_runs: [] }
    }
    throw new Error('Failed to fetch tech data')
  }
}

const useFetchActionsData = (
  options: ActionOptions,
): UseQueryResult<ghActions, Error> =>
  useQuery({
    queryKey: ['actionsData', options],
    queryFn: () => fetchTechData(options),
    enabled: options.repoName !== '' && options.owner !== '',
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    refetchInterval: 1000 * 60 * 60 * 24, // 1 day
    retry: 1,
  })

export default useFetchActionsData
