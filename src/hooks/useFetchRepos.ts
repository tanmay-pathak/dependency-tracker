import { useQuery } from '@tanstack/react-query'
import { fetchRepos } from '@/server-actions/github'

const useFetchRepos = () =>
  useQuery({
    queryKey: ['reposData'],
    queryFn: () => fetchRepos(),
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    refetchInterval: 1000 * 60 * 60 * 24, // 1 day
    retry: 1,
  })

export default useFetchRepos
