import { TableSkeleton } from '@/components/table-list-skeleton'

export default async function Loading() {
  return (
    <div className="container mx-auto p-4">
      <div className="prose mb-3 max-w-none text-center">
        <h1>Loading...</h1>
      </div>
      <TableSkeleton headers={['Project', 'Tool', 'Ready']} />
    </div>
  )
}
