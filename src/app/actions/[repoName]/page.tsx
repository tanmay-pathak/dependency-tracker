import Actions from './Actions'

export default async function ActionsForRepo(props: {
  params: Promise<{ repoName: string }>
}) {
  const params = await props.params
  const { repoName } = params

  return <Actions repoName={repoName} />
}
