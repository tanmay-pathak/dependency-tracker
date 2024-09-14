import TechnologyList from './TechnologyList'

const technologies = [
  { name: 'PHP', search: 'php_version', tech: 'php' },
  { name: 'Drupal', search: 'drupal_version', tech: 'drupal' },
  { name: 'Drush', search: 'drush_version', tech: 'drush' },
  { name: 'Composer', search: 'composer_version', tech: 'composer' },
  { name: 'DB', search: 'db_version' },
  { name: 'DB Hostname', search: 'db_hostname' },
  { name: 'Platform', search: 'platform' },
  { name: 'NGINX', search: 'nginx_version', tech: 'nginx' },
  { name: 'Wordpress', search: 'wordpress_version', tech: 'wordpress' },
]

export default function VersionsPage() {
  return (
    <div className="container mx-auto p-4">
      <TechnologyList technologies={technologies} />
    </div>
  )
}
