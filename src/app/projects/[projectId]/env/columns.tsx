import { Dependency } from '@/app/versions/[search]/columns'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Dependency>[] = [
  {
    accessorKey: 'modified_at',
    header: 'Updated',
  },
  {
    accessorKey: 'environment',
    header: 'Environment',
  },
  {
    accessorKey: 'key',
    header: 'Tool',
  },
  {
    accessorKey: 'value',
    header: 'Version',
  },
]
