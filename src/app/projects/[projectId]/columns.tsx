import { ColumnDef } from '@tanstack/react-table'

export type Dependency = {
  id: number
  project: string
  environment: string
  key: string
  value: string
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
    accessorKey: 'key',
    header: 'Tool',
  },
  {
    accessorKey: 'value',
    header: 'Version',
  },
]
