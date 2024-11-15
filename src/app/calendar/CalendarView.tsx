'use client'

import { Calendar } from '@/components/ui/calendar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format, isSameMonth } from 'date-fns'
import { useState } from 'react'

interface CalendarEvent {
  summary: string
  description?: string
  start: Date
  end: Date
}

interface CalendarViewProps {
  events: CalendarEvent[]
}

export function CalendarView({ events }: CalendarViewProps) {
  const [date, setDate] = useState<Date>(new Date())

  const eventsInSelectedMonth = events.filter((event) =>
    isSameMonth(event.start, date),
  )

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 text-center text-2xl font-bold">
        Lifecycle Calendar
      </h2>
      <div className="flex gap-4">
        <Calendar
          mode="single"
          onMonthChange={setDate}
          className="rounded-md border"
          modifiers={{
            hasEvent: (date) =>
              events.some(
                (event) =>
                  format(event.start, 'yyyy-MM-dd') ===
                  format(date, 'yyyy-MM-dd'),
              ),
          }}
          modifiersStyles={{
            hasEvent: {
              fontWeight: 'bold',
              backgroundColor: 'hsl(var(--primary) / 0.1)',
            },
          }}
        />
        <div className="flex-1">
          <h2 className="mb-4 text-xl font-semibold">
            Lifecycle Events for {format(date, 'MMMM yyyy')}
          </h2>
          <ScrollArea className="h-[500px] rounded-md border">
            <div className="space-y-2 p-4">
              {eventsInSelectedMonth.length > 0 ? (
                eventsInSelectedMonth.map((event, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <h3 className="font-medium">{event.summary}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(event.start, 'PPP')}
                    </p>
                    {event.description && (
                      <p className="mt-2 text-sm">{event.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No lifecycle events this month
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">
          All Upcoming Lifecycle Events
        </h2>
        <ScrollArea className="h-[400px] rounded-md border">
          <div className="space-y-4 p-4">
            {events.map((event, index) => (
              <div key={index} className="rounded-lg border p-4">
                <h3 className="font-medium">{event.summary}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(event.start, 'PPP')}
                </p>
                {event.description && (
                  <p className="mt-2 text-sm">{event.description}</p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
