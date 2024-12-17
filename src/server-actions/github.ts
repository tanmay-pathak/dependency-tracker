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

export async function fetchDependabotAlertsData(
  repoName: string,
  severity?: string,
) {
  try {
    const response = await octokit.dependabot.listAlertsForRepo({
      owner,
      repo: repoName,
      severity: severity,
      state: 'open',
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

export async function fetchDeploymentStatus(repoName: string) {
  try {
    // Fetch the latest 30 deployments to cover all environments
    const response = await octokit.repos.listDeployments({
      owner,
      repo: repoName,
      per_page: 30,
    })

    // Fetch releases for the repository
    const releasesResponse = await octokit.repos.listReleases({
      owner,
      repo: repoName,
      per_page: 100,
    })
    const releases = releasesResponse.data

    // Get statuses for each deployment
    const deploymentStatuses = await Promise.all(
      response.data.map(async (deployment) => {
        const statusResponse = await octokit.repos.listDeploymentStatuses({
          owner,
          repo: repoName,
          deployment_id: deployment.id,
        })

        // Only return if the latest status is success
        if (statusResponse.data[0]?.state === 'success') {
          // Fetch the deployment commit to get its parents
          const commitResponse = await octokit.repos.getCommit({
            owner,
            repo: repoName,
            ref: deployment.sha,
          })

          // Find matching release by checking commit and its parents
          let matchingRelease = null
          const commitShas = [
            deployment.sha,
            ...commitResponse.data.parents.map((p) => p.sha),
          ]

          for (const release of releases) {
            if (commitShas.includes(release.target_commitish)) {
              matchingRelease = {
                name: release.name,
                tag: release.tag_name,
                url: release.html_url,
              }
              break
            }
          }

          return {
            environment: deployment.environment,
            status: 'success',
            created_at: deployment.created_at,
            url: statusResponse.data[0]?.target_url,
            ref: deployment.ref,
            sha: deployment.sha.substring(0, 7),
            commitUrl: `https://github.com/${owner}/${repoName}/commit/${deployment.sha}`,
            refUrl: `https://github.com/${owner}/${repoName}/tree/${deployment.ref}`,
            actor: deployment.creator
              ? {
                  login: deployment.creator.login,
                  avatar_url: deployment.creator.avatar_url,
                  html_url: deployment.creator.html_url,
                }
              : null,
            release: matchingRelease,
          }
        }
        return null
      }),
    )

    // Filter out null values and get latest successful deployment for each environment
    const latestDeployments = new Map()
    deploymentStatuses
      .filter(
        (deployment): deployment is NonNullable<typeof deployment> =>
          deployment !== null,
      )
      .forEach((deployment) => {
        // Normalize environment names
        let envKey = deployment.environment.toLowerCase()
        if (['uat', 'staging'].includes(envKey)) {
          envKey = 'beta'
        }

        const current = latestDeployments.get(envKey)
        if (
          !current ||
          new Date(deployment.created_at) > new Date(current.created_at)
        ) {
          latestDeployments.set(envKey, deployment)
        }
      })

    return {
      dev: latestDeployments.get('dev') || null,
      beta: latestDeployments.get('beta') || null,
      prod: latestDeployments.get('prod') || null,
    }
  } catch (error) {
    console.error('Error fetching deployment status:', error)
    return {
      dev: null,
      beta: null,
      prod: null,
    }
  }
}
