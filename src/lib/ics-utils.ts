import ICAL from 'ical.js'

interface CalendarEvent {
  summary: string
  description?: string
  start: Date
  end: Date
}

export async function fetchAndParseICSEvents(
  urls: string[],
): Promise<CalendarEvent[]> {
  const events: CalendarEvent[] = []
  const now = new Date()

  for (const url of urls) {
    try {
      const response = await fetch(url.replace('webcal://', 'https://'))
      const data = await response.text()
      const jcalData = ICAL.parse(data)
      const comp = new ICAL.Component(jcalData)
      const vevents = comp.getAllSubcomponents('vevent')

      for (const vevent of vevents) {
        const event = new ICAL.Event(vevent)
        const startDate = event.startDate.toJSDate()

        // Only include future events
        if (startDate >= now) {
          events.push({
            summary: event.summary,
            description: event.description,
            start: startDate,
            end: event.endDate.toJSDate(),
          })
        }
      }
    } catch (error) {
      console.error(`Error fetching ICS from ${url}:`, error)
    }
  }

  return events.sort((a, b) => a.start.getTime() - b.start.getTime())
}
