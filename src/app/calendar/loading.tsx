import { Calendar } from '@/components/ui/calendar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 text-center text-2xl font-bold">
        Lifecycle Calendar
      </h2>
      <div className="flex gap-4">
        <div className="rounded-md border p-4">
          <Calendar mode="single" className="opacity-50" />
        </div>
        <div className="flex-1">
          <Skeleton className="mb-4 h-6 w-36 rounded-md" />
          <ScrollArea className="h-[500px] rounded-md border">
            <div className="space-y-2 p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <Skeleton className="mb-2 h-5 w-3/4 rounded-md" />
                  <Skeleton className="mb-2 h-4 w-1/3 rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="mt-8">
        <Skeleton className="mb-4 h-6 w-40 rounded-md" />
        <ScrollArea className="h-[400px] rounded-md border">
          <div className="space-y-4 p-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <Skeleton className="mb-2 h-5 w-3/4 rounded-md" />
                <Skeleton className="mb-2 h-4 w-1/3 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
