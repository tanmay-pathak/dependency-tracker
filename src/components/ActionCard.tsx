import { components } from '@octokit/openapi-types'
import { Button } from './ui/button'
import { Activity, Clock4Icon, Flag, GitBranch } from 'lucide-react'
import { formatDate } from '@/utils/utility-functions'

type Props = {
  action: components['schemas']['workflow-run']
}

const ActionCard = ({
  action: {
    head_branch,
    conclusion,
    html_url: link,
    status,
    created_at: runStart,
    name: title,
    actor,
  },
}: Props) => {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border bg-card px-4 py-6 text-card-foreground shadow transition-all hover:scale-105">
      <div className="flex flex-col gap-2">
        <h1 className="mb-4 text-xl font-medium">{title}</h1>
        <p>
          <GitBranch className="inline" /> {head_branch}
        </p>
        <p>
          <Clock4Icon className="inline" /> {formatDate(runStart)}
        </p>
        <p>
          <Activity className="inline" /> {status}
        </p>
        <p>
          <Flag className="inline" />
          <span
            className={`${conclusion === 'success' ? 'text-green-500' : 'text-red-500'}`}
          >
            {' '}
            {conclusion}
          </span>
        </p>
        <a
          className="flex w-fit items-center"
          href={actor?.html_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={actor?.avatar_url}
            alt={actor?.login}
            className="mr-2 inline h-6 w-6 rounded-full"
          />
          {actor?.login}
        </a>
      </div>

      <a href={link} target="_blank" className="w-full">
        <Button className="w-full">View Run</Button>
      </a>
    </div>
  )
}

export default ActionCard
