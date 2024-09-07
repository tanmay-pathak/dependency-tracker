import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const technologies = [
  { name: 'PHP', slug: 'php_version' },
  { name: 'Drupal', slug: 'drupal_version' },
  { name: 'Drush', slug: 'drush_version' },
  { name: 'Composer', slug: 'composer_version' },
  { name: 'DB', slug: 'db_version' },
  { name: 'DB Hostname', slug: 'db_hostname' },
  { name: 'Platform', slug: 'platform' },
]

export default function VersionsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {technologies.map((tech) => (
          <Link href={`/versions/${tech.slug}`} key={tech.slug}>
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
