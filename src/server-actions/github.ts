'use server'

import { ActionOptions } from '@/hooks/useFetchActionsData'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GH_ACCESS_TOKEN,
})

const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER!

export async function fetchRepos() {
  const response = await octokit.repos.listForOrg({
    org: owner,
    per_page: 200,
    sort: 'full_name',
  })
  return response.data
}

export async function fetchDependabotAlertsData(repoName: string) {
  'use cache'
  try {
    const response = await octokit.dependabot.listAlertsForRepo({
      owner,
      repo: repoName,
    })
    return response.data
  } catch (error) {
    console.error('Error fetching Dependabot alerts:', error)
    return []
  }
}

export async function fetchActionsData(options: ActionOptions) {
  const response = await octokit.actions.listWorkflowRunsForRepo({
    owner,
    repo: options.repoName,
    status: options.filter,
  })
  return response.data
}
