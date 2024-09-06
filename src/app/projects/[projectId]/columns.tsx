import { ColumnDef } from "@tanstack/react-table"

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
    accessorKey: "environment",
    header: "Environment",
  },
  {
    accessorKey: "key",
    header: "Key",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
  },
  {
    accessorKey: "modified_at",
    header: "Modified At",
  },
]