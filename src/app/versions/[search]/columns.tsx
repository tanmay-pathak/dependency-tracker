import { ColumnDef } from '@tanstack/react-table'

export interface Dependency {
  id: string
  key: string
  value: string
  environment: string
  created_at: string
  modified_at: string
}

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
    accessorKey: 'id',
    header: 'Project',
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
