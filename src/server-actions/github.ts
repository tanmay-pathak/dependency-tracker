'use server'

import { ActionOptions } from '@/hooks/useFetchActionsData'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GH_ACCESS_TOKEN,
})

export async function fetchRepos() {
  const response = await octokit.repos.listForOrg({
    org: process.env.NEXT_PUBLIC_GITHUB_OWNER ?? '',
    per_page: 200,
    sort: 'full_name',
  })
  return response.data
}

export async function fetchActionsData(options: ActionOptions) {
  const response = await octokit.actions.listWorkflowRunsForRepo({
    repo: options.repoName,
    owner: options.owner,
    status: options.filter,
  })
  return response.data
}
