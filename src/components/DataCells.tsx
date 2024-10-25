import { CurrentVersionTooltip } from './CurrentVersionTooltip'
import { Drupal11ReadinessTooltip } from './Drupal11ReadinessTooltip'
import { Badge } from './ui/badge'

export const Cell = ({ tech, version }: { tech: string; version: string }) => {
  return (
    <>
      {tech.toLowerCase() === 'drupal_11_readiness' ? (
        <Drupal11ReadinessCell version={version} />
      ) : (
        <CurrentVersionTooltip currentVersion={version} searchKey={tech}>
          {version || '-'}
        </CurrentVersionTooltip>
      )}
    </>
  )
}

export const Drupal11ReadinessCell = ({ version }: { version: any }) => {
  if (!version) return <>-</>

  const parsedVersion = JSON.parse(version)

  const isError = parsedVersion.some(
    (item: any) =>
      item.class &&
      typeof item.class === 'string' &&
      item.class === 'color-error',
  )

  return (
    <Drupal11ReadinessTooltip data={parsedVersion}>
      {isError ? <Badge variant={'destructive'}>No</Badge> : 'Yes'}
    </Drupal11ReadinessTooltip>
  )
}
