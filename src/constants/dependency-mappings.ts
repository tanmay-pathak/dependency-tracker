export const dependency = [
  { name: 'PHP', search: 'php_version', tech: 'php' },
  { name: 'Drupal', search: 'drupal_version', tech: 'drupal' },
  { name: 'Drush', search: 'drush_version', tech: 'drush' },
  { name: 'Composer', search: 'composer_version', tech: 'composer' },
  { name: 'DB', search: 'db_version', tech: 'db' },
  { name: 'NGINX', search: 'nginx_version', tech: 'nginx' },
  { name: 'Wordpress', search: 'wordpress_version', tech: 'wordpress' },
  { name: 'Varnish', search: 'varnish_version', tech: 'varnish' },
  { name: 'Provider', search: 'provider' },
  { name: 'Drupal Admin Theme', search: 'drupal_admin_theme' },
  { name: 'OS Version', search: 'os_version', tech: 'os' },
  { name: 'Lando', search: 'lando' },
  { name: 'Drupal 11 Readiness', search: 'drupal_11_readiness' },
]

export const dependencyByTech = dependency.reduce(
  (acc, item) => {
    if (item.tech) {
      acc[item.tech] = item
    }
    return acc
  },
  {} as Record<string, (typeof dependency)[number]>,
)

export const dependencyBySearch = dependency.reduce(
  (acc, item) => {
    acc[item.search] = item
    return acc
  },
  {} as Record<string, (typeof dependency)[number]>,
)
