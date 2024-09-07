import { ColumnDef } from '@tanstack/react-table'

export type Dependency = {
  id: number
  project: string
  environment: string
  key: string
  value: string
  modified_at: string
}

export const columns: ColumnDef<Dependency>[] = [
  {
    accessorKey: 'environment',
    header: 'Environment',
  },
  {
    accessorKey: 'project',
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
  {
    accessorKey: 'modified_at',
    header: 'Updated',
  },
]