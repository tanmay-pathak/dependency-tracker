'use client'
import ActionCard from '@/components/ActionCard'
import useFetchActionsData from '@/hooks/useFetchActionsData'

type Props = { repoName: string }

const Actions = ({ repoName }: Props) => {
  const { data } = useFetchActionsData({
    repoName: repoName as string,
    owner: 'theophilusn',
    filter: 'completed',
  })

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {data?.workflow_runs.map((action) => (
          <ActionCard
            key={action.id}
            title={action.name}
            branch={action.head_branch}
            runStart={action.created_at}
            status={action.status}
            conclusion={action.conclusion}
            link={action.html_url}
          />
        ))}
      </div>
    </div>
  )
}

export default Actions
