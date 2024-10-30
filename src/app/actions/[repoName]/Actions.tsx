'use client'
import ActionCard from '@/components/ActionCard'
import useFetchActionsData from '@/hooks/useFetchActionsData'

type Props = { repoName: string }

const Actions = ({ repoName }: Props) => {
  const { data } = useFetchActionsData({
    repoName: repoName as string,
    owner: process.env.NEXT_PUBLIC_GITHUB_OWNER ?? '',
    filter: 'completed',
  })

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-center text-2xl font-bold uppercase">{repoName}</h2>
      </div>
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
