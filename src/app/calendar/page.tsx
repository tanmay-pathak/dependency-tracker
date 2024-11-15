// Remove 'use client'
import { fetchAndParseICSEvents } from '@/lib/ics-utils'
import { CalendarView } from './CalendarView'

export const revalidate = 3600 // Revalidate every hour

async function CalendarPage() {
  const events = await fetchAndParseICSEvents([
    'webcal://endoflife.date/calendar/drupal.ics',
    'webcal://endoflife.date/calendar/php.ics',
    'webcal://endoflife.date/calendar/nginx.ics',
    'webcal://endoflife.date/calendar/wordpress.ics',
    'webcal://endoflife.date/calendar/varnish.ics',
    'webcal://endoflife.date/calendar/mysql.ics',
    'webcal://endoflife.date/calendar/mariadb.ics',
    'webcal://endoflife.date/calendar/drush.ics',
  ])

  return <CalendarView events={events} />
}

export default CalendarPage
