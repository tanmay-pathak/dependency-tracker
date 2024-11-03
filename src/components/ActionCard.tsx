import { components } from '@octokit/openapi-types'
import { Button } from './ui/button'
import { Activity, Clock4Icon, Flag, GitBranch } from 'lucide-react'

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
          <Clock4Icon className="inline" /> {runStart}
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
      </div>

      <a href={link} target="_blank" className="w-full">
        <Button className="w-full">View Run</Button>
      </a>
    </div>
  )
}

export default ActionCard
