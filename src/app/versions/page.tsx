import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

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
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {technologies.map((tech) => (
          <Link
            href={`/versions/${tech.search}?technology=${tech.tech}`}
            key={tech.search}
          >
            <Card className="cursor-pointer">
              <CardHeader>
                <CardTitle>{tech.name}</CardTitle>
                <CardDescription>Click to view versions</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
